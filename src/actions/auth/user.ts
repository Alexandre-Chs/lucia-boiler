"use server";

import { db } from "@/db/db";
import { userTable } from "@/db/schemas/user";
import { eq, sql } from "drizzle-orm";

export async function ifUsernameExistInDatabase(
  username: string
): Promise<boolean> {
  const response = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username.toLowerCase()));

  return response.length > 0;
}

export async function ifEmailExistInDatabase(email: string): Promise<boolean> {
  const response = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  return response.length > 0;
}

export async function getUserFromDatabaseIfExist(username: string) {
  const response = await db
    .select({
      id: userTable.id,
      username: userTable.username,
      password_hash: userTable.password_hash,
    })
    .from(userTable)
    .where(eq(sql`LOWER(${userTable.username})`, username.toLowerCase()));

  if (response.length === 0) {
    return false;
  } else {
    return response[0];
  }
}

export async function addUserToDatabase(
  id: string,
  username: string,
  password_hash: string,
  email: string
) {
  await db.insert(userTable).values({
    id,
    username,
    password_hash,
    email,
  });
}
