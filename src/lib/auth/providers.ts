import { Google } from "arctic";
import { Reddit } from "arctic";

export const google = new Google(
  process.env.GOOGLE_ID!,
  process.env.GOOGLE_SECRET!,
  `${process.env.BASE_URL}/login/google/callback`
);

export const reddit = new Reddit(
  process.env.REDDIT_ID!,
  process.env.REDDIT_SECRET!,
  `${process.env.BASE_URL}/login/reddit/callback`
);
