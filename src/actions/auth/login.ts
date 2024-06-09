"use server";

import { validSchemaAuth } from "@/zod/auth/schema-auth";
import { ActionResult } from "next/dist/server/app-render/types";
import { getUserFromDatabaseIfExist } from "./user";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/resend";
export async function login(formData: FormData): Promise<ActionResult> {
  //check if data is valid
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const parseResult = validSchemaAuth.safeParse({ username, password });

  if (!parseResult.success) {
    return;
  }

  const parseData = parseResult.data;

  //check if user exist in database
  const ifUsernameAlreadyExist = await getUserFromDatabaseIfExist(
    parseData.username
  );

  //if user does not exist
  if (!ifUsernameAlreadyExist) {
    return {
      status: "error",
      message: "Incorrect username or password",
    };
  }
  //else check if password is correct

  const validPassword = await verify(
    ifUsernameAlreadyExist.password_hash as string,
    parseData.password,
    { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 }
  );

  if (!validPassword) {
    return {
      status: "error",
      message: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(ifUsernameAlreadyExist.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  //send email
  try {
    await sendEmail();
  } catch (e) {
    console.log(e);
  }
  return redirect("/");
}
