"use client";

import React, { useState } from "react";
import { signup } from "@/actions/auth/signup";
import { toast } from "sonner";
import { validSchemaAuthWithEmail } from "@/zod/auth/schema-auth";

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const parseDataWithZod = validSchemaAuthWithEmail.safeParse({
      username,
      password,
      email,
    });

    if (!parseDataWithZod.success) {
      const errorMessages = parseDataWithZod.error.errors
        .map((error) => error.message)
        .join(", ");
      setErrorMessage(errorMessages);
      return;
    }

    const result = await signup(formData);
    if (result && result.status === "error") {
      setErrorMessage(result.message);
      return;
    }

    toast.success("Account created successfully");
  };

  return (
    <>
      <h1>Create an account</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="username">Email</label>
        <input name="email" id="email" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        {errorMessage && (
          <p className="text-red-500 font-bold">{errorMessage}</p>
        )}
        <button type="submit">Continue</button>
      </form>
    </>
  );
};

export default SignUp;
