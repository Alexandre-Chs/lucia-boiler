"use client";

import { logout } from "@/actions/auth/signout";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const SignOut = ({ username }: { username?: string }) => {
  const handleSignOut = async () => {
    await logout();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="cursor-pointer font-semibold">{username}</div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="profile">Profile</DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          onClick={handleSignOut}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default SignOut;
