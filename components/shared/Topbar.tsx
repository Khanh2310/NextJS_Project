"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../../public/assets/logo.svg";
import Logout from "../../public/assets/logout.svg";
import { SignOutButton, SignedIn, OrganizationSwitcher } from "@clerk/nextjs";

const Topbar = () => {
  const isUserLoggedIn = true;
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src={Logo} width={28} height={28} alt="logo" />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image src={Logout} width={24} height={24} alt="logout"></Image>
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Topbar;