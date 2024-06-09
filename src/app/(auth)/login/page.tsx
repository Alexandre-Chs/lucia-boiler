import Login from "@/components/auth/Login";
import { LoginProvider } from "@/components/auth/LoginProviders";
import React from "react";

const Page = () => {
  return (
    <>
      <Login />
      <LoginProvider />
    </>
  );
};

export default Page;
