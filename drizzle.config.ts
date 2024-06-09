import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas",
  out: "./src/db/migrations",
  dbCredentials: {
    url: "postgresql://postgres:root@localhost:5432/mysetup",
  },
  verbose: true,
});
