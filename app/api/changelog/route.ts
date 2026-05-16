import { NextResponse } from 'next/server';

export const revalidate = 300; // cache for 5 minutes

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  const res = await fetch(
    'https://api.github.com/repos/Sucu-Syndicate/silverline-portfolio/commits?per_page=30',
    {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'failed to fetch commits' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
