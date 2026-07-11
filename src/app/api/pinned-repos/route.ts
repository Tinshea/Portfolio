import { NextRequest, NextResponse } from "next/server";
import { PinnedRepo } from "@/types";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
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
    const fallbackResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repos = await fallbackResponse.json();
    return NextResponse.json(repos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json({ error: "Failed to load repositories" }, { status: 502 });
  }
}
