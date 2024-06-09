import { db } from "@/db/db";
import { oauthAccount, userTable } from "@/db/schemas";
import { lucia } from "@/lib/auth/auth";
import { google } from "@/lib/auth/providers";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedStateVerifier =
    cookies().get("google_oauth_code_verifier")?.value ?? null;

  //throw error if nothing matches
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedStateVerifier as string
    );

    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const googleUser: GoogleUser = await googleUserResponse.json();

    const existingUser = await db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.email, googleUser.email),
    });

    const existingAccount = await db.query.oauthAccount.findFirst({
      where: (user, { eq, and }) =>
        and(
          eq(user.providerId, "google"),
          eq(user.providerUserId, googleUser.sub.toString())
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
        providerId: "google",
        providerUserId: googleUser.sub.toString(),
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
        id: userId,
        email: googleUser.email,
        username: null,
      });

      await db.insert(oauthAccount).values({
        providerId: "google",
        providerUserId: googleUser.sub.toString(),
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

interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}
