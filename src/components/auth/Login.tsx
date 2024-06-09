"use client";

import { login } from "@/actions/auth/login";
import { validSchemaAuth } from "@/zod/auth/schema-auth";
import React, { useState } from "react";
import { toast } from "sonner";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const parseDataWithZod = validSchemaAuth.safeParse({
      username,
      password,
    });

    if (!parseDataWithZod.success) {
      const errorMessages = parseDataWithZod.error.errors
        .map((error) => error.message)
        .join(", ");
      setErrorMessage(errorMessages);
      return;
    }

    const result = await login(formData);
    if (result && result.status === "error") {
      setErrorMessage(result.message);
      return;
    }

    toast.success("Logged in successfully");
  };

  return (
    <div>
      <h1>Log in page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        {errorMessage && (
          <p className="text-red-500 font-bold">{errorMessage}</p>
        )}
        <button>Continue</button>
      </form>
    </div>
  );
};

export default Login;
