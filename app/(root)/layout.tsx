import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import '../globals.css';
import Topbar from '@/components/shared/Topbar';
import LeftSideBar from '@/components/shared/LeftSideBar';
import RightSideBar from '@/components/shared/RightSideBar';
import Bottombar from '@/components/shared/Bottombar';
import { dark } from '@clerk/themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js 13 ',
  description: 'A Next.js 13 application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
          <main className="flex flex-row">
            <LeftSideBar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSideBar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
