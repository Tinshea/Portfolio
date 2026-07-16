import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

// SECURITY: local storage mode has no authentication, and GitHub mode without
// its secrets crashes the build (leaving a stale, exposed deployment live).
// In production the Keystatic API therefore only exists when GitHub mode is
// FULLY configured; anything partial serves 404. Dev behavior is unchanged.
const githubModeConfigured = Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);
const serverSecretsConfigured = Boolean(
  process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
    process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
    process.env.KEYSTATIC_SECRET
);
const enabled =
  process.env.NODE_ENV !== "production" || (githubModeConfigured && serverSecretsConfigured);

const notFoundResponse = async () => new Response(null, { status: 404 });

const handlers = enabled
  ? makeRouteHandler({ config })
  : { GET: notFoundResponse, POST: notFoundResponse };

export const GET = handlers.GET;
export const POST = handlers.POST;
