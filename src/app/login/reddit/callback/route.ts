import { db } from "@/db/db";
import { oauthAccount, userTable } from "@/db/schemas";
import { lucia } from "@/lib/auth/auth";
import { reddit } from "@/lib/auth/providers";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("reddit_oauth_state")?.value ?? null;

  //throw error if nothing matches
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await reddit.validateAuthorizationCode(code);
    const redditUserResponse = await fetch(
      "https://oauth.reddit.com/api/v1/me",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const redditUser = await redditUserResponse.json();

    const redditUserId = redditUser.id;

    const existingUser = await db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.id, redditUserId),
    });

    const existingAccount = await db.query.oauthAccount.findFirst({
      where: (user, { eq, and }) =>
        and(
          eq(user.providerId, "reddit"),
          eq(user.providerUserId, redditUserId)
        ),
    });

    if (existingAccount) {
      const session = await lucia.createSession(existingAccount.userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    if (existingUser && !existingAccount) {
      await db.insert(oauthAccount).values({
        providerId: "reddit",
        providerUserId: redditUserId,
        userId: existingUser.id,
      });

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10);

    try {
      await db.insert(userTable).values({
        id: redditUserId,
        username: null,
      });

      await db.insert(oauthAccount).values({
        providerId: "reddit",
        providerUserId: redditUserId,
        userId,
      });
    } catch (err) {
      console.log(err);
    }

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
