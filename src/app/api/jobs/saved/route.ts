import { NextResponse } from 'next/server';

// GET: return array of jobIds saved by current user
export async function GET(req: Request) {
  try {
    const [{ db }, { savedJobs }, drizzleOps, jwtLib] = await Promise.all([
      import('@/app/config/db'),
      import('@/drizzle/drizzle'),
      import('drizzle-orm'),
      import('@/components/lib/jwt')
    ]);
    const { eq, and, isNull } = drizzleOps;
    const { verifyToken } = jwtLib;
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/authToken=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    if (!token) return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ status: 'error', message: 'Invalid token' }, { status: 401 });
    const rows = await db.select({ jobId: savedJobs.jobId }).from(savedJobs).where(and(eq(savedJobs.userId, payload.userId), isNull(savedJobs.deletedAt)));
    const jobIds = rows.map(r => Number(r.jobId));
    return NextResponse.json({ status: 'success', data: jobIds });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch saved jobs' }, { status: 500 });
  }
}

// POST: save a job
export async function POST(req: Request) {
  try {
    const [{ db }, { savedJobs }, drizzleOps, jwtLib] = await Promise.all([
      import('@/app/config/db'),
      import('@/drizzle/drizzle'),
      import('drizzle-orm'),
      import('@/components/lib/jwt')
    ]);
    const { eq, and } = drizzleOps;
    const { verifyToken } = jwtLib;
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/authToken=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    if (!token) return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ status: 'error', message: 'Invalid token' }, { status: 401 });
    const { jobId } = await req.json();
    if (!jobId) return NextResponse.json({ status: 'error', message: 'Missing jobId' }, { status: 400 });
    // Upsert: if already saved and soft-deleted, restore; else insert
    const existing = await db.select().from(savedJobs).where(and(eq(savedJobs.userId, payload.userId), eq(savedJobs.jobId, jobId)));
    if (existing.length > 0) {
      // If soft-deleted, restore
      if (existing[0].deletedAt) {
        await db.update(savedJobs).set({ deletedAt: null }).where(eq(savedJobs.id, existing[0].id));
      }
    } else {
      await db.insert(savedJobs).values({ userId: payload.userId, jobId });
    }
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error saving job:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to save job' }, { status: 500 });
  }
}

// DELETE: unsave a job
export async function DELETE(req: Request) {
  try {
    const [{ db }, { savedJobs }, drizzleOps, jwtLib] = await Promise.all([
      import('@/app/config/db'),
      import('@/drizzle/drizzle'),
      import('drizzle-orm'),
      import('@/components/lib/jwt')
    ]);
    const { eq, and, isNull } = drizzleOps;
    const { verifyToken } = jwtLib;
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/authToken=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    if (!token) return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ status: 'error', message: 'Invalid token' }, { status: 401 });
    const { jobId } = await req.json();
    if (!jobId) return NextResponse.json({ status: 'error', message: 'Missing jobId' }, { status: 400 });
    await db.update(savedJobs).set({ deletedAt: new Date() }).where(and(eq(savedJobs.userId, payload.userId), eq(savedJobs.jobId, jobId), isNull(savedJobs.deletedAt)));
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error unsaving job:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to unsave job' }, { status: 500 });
  }
}