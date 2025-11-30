'use server';

import { db } from '@/app/config/db';
import { jobs } from '@/drizzle/drizzle';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function createJob(jobData: {
    title: string;
    description: string;
    company: string;
    location: string;
    salary?: string;
    jobType: string;
    experience?: string;
    skills?: string;
}) {
    try {
        // Get token from cookie
        const cookieStore = await cookies();
        const token = cookieStore.get('authToken')?.value;

        if (!token) {
            console.error('❌ No token found in cookies');
            return {
                status: 'error',
                message: 'Unauthorized - No token found',
            };
        }

        // Verify token and get user ID
        const payload = verifyToken(token);

        if (!payload || !payload.userId) {
            console.error('❌ Invalid token payload:', payload);
            return {
                status: 'error',
                message: 'Unauthorized - Invalid token',
            };
        }

        // Validate required fields
        if (!jobData.title?.trim()) {
            return {
                status: 'error',
                message: 'Job title is required',
            };
        }

        if (!jobData.company?.trim()) {
            return {
                status: 'error',
                message: 'Company name is required',
            };
        }

        if (!jobData.location?.trim()) {
            return {
                status: 'error',
                message: 'Location is required',
            };
        }

        if (!jobData.jobType?.trim()) {
            return {
                status: 'error',
                message: 'Job type is required',
            };
        }

        if (!jobData.description?.trim()) {
            return {
                status: 'error',
                message: 'Job description is required',
            };
        }

        console.log('✅ Token verified for user:', payload.userId);
        console.log('📝 Creating job:', jobData.title);

        // Insert job into database
        const result = await db.insert(jobs).values({
            title: jobData.title.trim(),
            description: jobData.description.trim(),
            company: jobData.company.trim(),
            location: jobData.location.trim(),
            salary: jobData.salary?.trim() || null,
            jobType: jobData.jobType.trim(),
            experience: jobData.experience?.trim() || null,
            skills: jobData.skills?.trim() || null,
            postedBy: payload.userId,
            applicants: 0,
        });

        console.log('✅ Job created successfully');

        return {
            status: 'success',
            message: 'Job posted successfully',
            data: {
                title: jobData.title,
            },
        };
    } catch (error) {
        console.error('❌ Create job error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create job';
        console.error('Error details:', errorMessage);
        return {
            status: 'error',
            message: errorMessage,
        };
    }
}
