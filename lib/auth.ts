import "server-only";

import { betterAuth } from "better-auth";
import { verifyPassword } from "better-auth/crypto";
import { nextCookies } from "better-auth/next-js";
import { compare } from "bcryptjs";
import { PostgresDialect } from "kysely";
import { createTransport } from "nodemailer";

import { getPostgresPool } from "./database";

function requiredEnvironmentVariable(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be configured.`);
  }

  return value;
}

let emailTransport: ReturnType<typeof createTransport> | undefined;

function getEmailTransport() {
  if (!emailTransport) {
    emailTransport = createTransport({
      url: requiredEnvironmentVariable("SMTP_URL"),
      requireTLS: process.env.NODE_ENV === "production",
    });
  }

  return emailTransport;
}

function createAuth() {
  const secret = requiredEnvironmentVariable("BETTER_AUTH_SECRET");

  if (Buffer.byteLength(secret) < 32) {
    throw new Error("BETTER_AUTH_SECRET must be at least 32 bytes.");
  }

  const baseURL = new URL(requiredEnvironmentVariable("BETTER_AUTH_URL"));

  if (
    baseURL.pathname !== "/" ||
    baseURL.search ||
    baseURL.hash ||
    (process.env.NODE_ENV === "production" && baseURL.protocol !== "https:")
  ) {
    throw new Error(
      "BETTER_AUTH_URL must be an origin and use HTTPS in production.",
    );
  }

  return betterAuth({
    appName: "The Wild Oasis",
    baseURL: baseURL.origin,
    secret,
    trustedOrigins: [baseURL.origin],
    database: {
      dialect: new PostgresDialect({ pool: getPostgresPool() }),
      type: "postgres",
      schemaName: "better_auth",
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      password: {
        verify: async ({ hash, password }) => {
          if (hash.startsWith("$2")) {
            return compare(password, hash);
          }

          return verifyPassword({ hash, password });
        },
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await getEmailTransport().sendMail({
          from: requiredEnvironmentVariable("EMAIL_FROM"),
          to: user.email,
          subject: "Confirm your Wild Oasis account",
          text: `Confirm your email address by opening this link:\n\n${url}\n\nIf you did not create an account, you can ignore this message.`,
        });
      },
    },
    advanced: {
      database: {
        generateId: "uuid",
      },
      useSecureCookies: process.env.NODE_ENV === "production",
    },
    plugins: [nextCookies()],
  });
}

let authInstance: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  if (!authInstance) {
    authInstance = createAuth();
  }

  return authInstance;
}
