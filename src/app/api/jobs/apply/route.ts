import { NextResponse } from 'next/server';
import { db } from '@/app/config/db';
import { applications, jobs } from '@/drizzle/drizzle';
import { isNull, eq, and, sql } from 'drizzle-orm';
import { verifyToken } from '@/lib/jwt';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/authToken=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;

    if (!token) {
      return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ status: 'error', message: 'Invalid token' }, { status: 401 });
    }

    let jobId: number | null = null;
    let coverLetter: string | null = null;
    let resumePath: string | null = null;

    const contentType = req.headers.get('content-type') || '';

    // ---------------------------------------------
    //   Multipart Form (Resume Upload Support)
    // ---------------------------------------------
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();

      const jobIdVal = form.get('jobId');
      jobId = jobIdVal ? Number(jobIdVal.toString()) : null;

      const coverVal = form.get('coverLetter');
      coverLetter = coverVal ? coverVal.toString() : null;

      const resumeFile = form.get('resume') as File | null;

      if (resumeFile && resumeFile.size > 0) {
        const MAX = 5 * 1024 * 1024;
        const allowed = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (resumeFile.size > MAX) {
          return NextResponse.json({ status: 'error', message: 'Resume file too large (max 5MB)' }, { status: 400 });
        }

        if (resumeFile.type && !allowed.includes(resumeFile.type)) {
          return NextResponse.json({ status: 'error', message: 'Unsupported resume format' }, { status: 400 });
        }

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
        await fs.mkdir(uploadsDir, { recursive: true });

        const safeName = `${Date.now()}-${payload.userId}-${jobId}-${resumeFile.name}`
          .replace(/[^a-zA-Z0-9.\-_]/g, '_');

        const filePath = path.join(uploadsDir, safeName);
        const buffer = Buffer.from(await resumeFile.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        resumePath = `/uploads/resumes/${safeName}`;
      }

    } else {
      // JSON Body
      const body = await req.json();
      jobId = Number(body.jobId);
      coverLetter = body.coverLetter ?? null;
    }

    if (!jobId) {
      return NextResponse.json({ status: 'error', message: 'Missing jobId' }, { status: 400 });
    }

    // -------------------------------------------------------
    //   Prevent duplicate applications (FIXED with and())
    // -------------------------------------------------------
    const existing = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.jobId, jobId),
          eq(applications.userId, payload.userId),
          isNull(applications.deletedAt)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json({ status: 'error', message: 'You have already applied to this job' }, { status: 409 });
    }

    // -------------------------------------------------------
    //   Verify job exists (FIXED with and())
    // -------------------------------------------------------
    const [job] = await db
      .select()
      .from(jobs)
      .where(
        and(
          eq(jobs.id, jobId),
          isNull(jobs.deletedAt)
        )
      );

    if (!job) {
      return NextResponse.json({ status: 'error', message: 'Job not found' }, { status: 404 });
    }

    // Prevent job poster applying to own job
    if (job.postedBy === payload.userId) {
      return NextResponse.json({ status: 'error', message: 'You cannot apply to your own job posting' }, { status: 403 });
    }

    // -------------------------------------------------------
    //   Insert application
    // -------------------------------------------------------
    await db.insert(applications).values({
      jobId,
      userId: payload.userId,
      status: 'pending',
      coverLetter: coverLetter ?? null,
      resumePath: resumePath ?? null
    });

    // -------------------------------------------------------
    //   Increase applicants count atomically
    // -------------------------------------------------------
    await db
      .update(jobs)
      .set({ applicants: sql`${jobs.applicants} + 1` })
      .where(eq(jobs.id, jobId));

    // Fetch updated count
    const [updatedJob] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    const updatedCount = updatedJob?.applicants ?? null;

    return NextResponse.json({
      status: 'success',
      message: 'Application submitted',
      data: { jobId, applicants: updatedCount }
    });

  } catch (error) {
    console.error('Error in apply route:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to apply' }, { status: 500 });
  }
}
