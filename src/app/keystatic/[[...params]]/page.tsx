import { notFound } from "next/navigation";
import KeystaticApp from "../keystatic";

// SECURITY: same gate as the API route. The admin page only exists in
// production when GitHub mode (OAuth-protected) is fully configured.
const githubModeConfigured = Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);
const serverSecretsConfigured = Boolean(
  process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
    process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
    process.env.KEYSTATIC_SECRET
);
const enabled =
  process.env.NODE_ENV !== "production" || (githubModeConfigured && serverSecretsConfigured);

export default function KeystaticPage() {
  if (!enabled) {
    notFound();
  }
  return <KeystaticApp />;
}
