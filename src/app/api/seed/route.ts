import { seedJobs } from '@/components/lib/seed';

export async function GET() {
    try {
        await seedJobs();
        return Response.json({ message: 'Jobs seeded successfully' });
    } catch (error) {
        return Response.json({ error: 'Failed to seed jobs' }, { status: 500 });
    }
}
