import Image from 'next/image';
import React from 'react';
interface PropsProfile {
  accountID: string;
  authUserID: string;
  name: string;
  username: string;
  bio: string;
  imgUrl: string;
}
const Profile = ({
  accountID,
  authUserID,
  name,
  username,
  bio,
  imgUrl,
}: PropsProfile) => {
  return (
    <div className="w-full flex flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 ">
          <div className="relative object-cover ">
            <Image
              src={imgUrl}
              alt="profile-image"
              width={80}
              height={80}
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1 mb-1">@{username}</p>
          </div>
        </div>
      </div>
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default Profile;
