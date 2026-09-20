import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.ts";
import * as authSchema from "../db/authSchema.ts";

const secret = (process.env.BETTER_AUTH_SECRET || "").trim();
if (!secret) {
  throw new Error(
    "BETTER_AUTH_SECRET is not set. Generate one (e.g. `openssl rand -base64 32`) and set it in the environment before starting the server."
  );
}

const baseURL = (process.env.BETTER_AUTH_URL || process.env.APP_URL || "http://localhost:3000").trim();

export const auth = betterAuth({
  secret,
  baseURL,
  basePath: "/api/auth",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    autoSignIn: true,
    // TODO: requireEmailVerification currently disabled because no transactional
    // email provider (SMTP/API) is configured yet. Enable together with a mail
    // sender in Phase 2 (see ENTWICKLUNGSRICHTLINIEN AUTH-04).
    requireEmailVerification: false,
  },
  // No cookieCache: every request re-checks the session against the DB, so
  // sign-out (or a revoked session) takes effect immediately (AUTH-03) rather
  // than staying valid for a cached window.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
  },
  trustedOrigins: (process.env.AUTH_TRUSTED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
});

export type AuthSession = typeof auth.$Infer.Session;
