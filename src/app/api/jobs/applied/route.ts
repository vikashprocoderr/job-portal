export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const [{ db }, { applications }, drizzleOps, jwtLib] = await Promise.all([
      import('@/app/config/db'),
      import('@/drizzle/drizzle'),
      import('drizzle-orm'),
      import('@/components/lib/jwt')
    ]);

    const { eq, isNull, and } = drizzleOps;
    const { verifyToken } = jwtLib;

    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/authToken=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;

    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 401 }
      );
    }

    const rows = await db
      .select({ jobId: applications.jobId })
      .from(applications)
      .where(
        and(
          eq(applications.userId, payload.userId),
          isNull(applications.deletedAt)
        )
      );

    const jobIds = rows.map(r => Number(r.jobId));

    return NextResponse.json({
      status: 'success',
      data: jobIds,
    });

  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch applied jobs' },
      { status: 500 }
    );
  }
}
