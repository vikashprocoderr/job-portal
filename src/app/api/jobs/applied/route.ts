export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { db } from '@/app/config/db';
import { applications } from '@/drizzle/drizzle';
import { eq, isNull, and } from 'drizzle-orm';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: Request) {
  try {
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
