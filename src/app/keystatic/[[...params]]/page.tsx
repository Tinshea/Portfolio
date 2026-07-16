import { notFound } from "next/navigation";
import KeystaticApp from "../keystatic";

// SECURITY: local storage mode has no authentication. It is only acceptable
// on a dev machine; in production the admin must not exist until GitHub mode
// (which enforces the GitHub App OAuth login) is configured.
const githubModeConfigured = Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);

export default function KeystaticPage() {
  if (process.env.NODE_ENV === "production" && !githubModeConfigured) {
    notFound();
  }
  return <KeystaticApp />;
}
