"use server";

import { reddit } from "@/lib/auth/providers";
import { generateState } from "arctic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginWithReddit = async () => {
  const state = generateState();
  const url: URL = await reddit.createAuthorizationURL(state, {
    scopes: ["identity"],
  });

  cookies().set("reddit_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  redirect(url.toString());
};
