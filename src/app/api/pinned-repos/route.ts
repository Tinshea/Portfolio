import { NextRequest, NextResponse } from "next/server";
import { PinnedRepo } from "@/types";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  // GitHub usernames are alphanumeric + hyphens; rejecting anything else also
  // keeps the interpolated GraphQL query safe.
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      const query = `
        {
          user(login: "${username}") {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name
                  description
                  forkCount
                  stargazerCount
                }
              }
            }
          }
        }
      `;

      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const { data } = await response.json();
        const repos: PinnedRepo[] = data.user.pinnedItems.nodes.map((repo: PinnedRepo) => ({
          name: repo.name,
          description: repo.description,
          forkCount: repo.forkCount,
          stargazerCount: repo.stargazerCount,
        }));
        return NextResponse.json(repos);
      }
    } catch (error) {
      console.error("Error fetching pinned repositories via GraphQL:", error);
    }
  }

  try {
    const fallbackResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`
    );
    if (!fallbackResponse.ok) {
      return NextResponse.json({ error: "Failed to load repositories" }, { status: 502 });
    }
    const repos = await fallbackResponse.json();
    if (!Array.isArray(repos)) {
      return NextResponse.json({ error: "Failed to load repositories" }, { status: 502 });
    }
    // Normalize the REST shape to the PinnedRepo contract the client expects.
    const normalized: PinnedRepo[] = repos
      .filter((repo: { fork: boolean }) => !repo.fork)
      .slice(0, 6)
      .map((repo: { name: string; description: string | null; forks_count: number; stargazers_count: number }) => ({
        name: repo.name,
        description: repo.description ?? "",
        forkCount: repo.forks_count,
        stargazerCount: repo.stargazers_count,
      }));
    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json({ error: "Failed to load repositories" }, { status: 502 });
  }
}
