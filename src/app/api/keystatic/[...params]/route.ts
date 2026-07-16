import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

// SECURITY: same gate as the admin page. In production without GitHub mode
// configured, the Keystatic API (which would operate the unauthenticated
// local storage mode) must not exist.
const githubModeConfigured = Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);
const enabled = process.env.NODE_ENV !== "production" || githubModeConfigured;

const handlers = makeRouteHandler({ config });

const notFoundResponse = () => new Response(null, { status: 404 });

export const GET = enabled ? handlers.GET : notFoundResponse;
export const POST = enabled ? handlers.POST : notFoundResponse;
