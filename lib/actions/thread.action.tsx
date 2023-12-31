'use server';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import { connectToDB } from '../mongoose';
import User from '../models/user.model';
import { model } from 'mongoose';

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}

export async function getThread(pageNumber = 1, pageSize = 20) {
  connectToDB();
  // Caculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch the post that have no parent (top-level threads)
  const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({
      createAt: 'desc',
    })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: '_id name parentId image',
      },
    });

  const totalPostCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postQuery.exec();
  const isNext = totalPostCount > skipAmount + posts.length;
  return { posts, isNext };
}

export async function getThreadById(id: string) {
  connectToDB();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id name parentId image',
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id name parentId image',
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Failed getThreadById ${error.message}`);
  }
}

export async function addComment(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();
  try {
    // Find original thread by its ID
    const originalId = await Thread.findById(threadId);
    if (!originalId) {
      throw new Error(`Id not fount`);
    }

    // Create new comments with the comment text
    const comment = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // save the new thread
    const saveComment = await comment.save();

    // Update the original thread to include the comments
    originalId.children.push(saveComment._id);

    // save the origin thread new
    await originalId.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed add commnent ${error.message} `);
  }
}
