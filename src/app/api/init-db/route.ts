import { NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET(req: Request) {
  let SQL: ReturnType<typeof postgres> | null = null;
  try {
    console.log('Initializing database schema (using postgres client)...');

    // Create postgres client inside handler to avoid import-time connection attempts
    SQL = postgres(process.env.DATABASE_URL as string);

    await SQL`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'applicant',
        profile_pic VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `;

    await SQL`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        salary VARCHAR(100),
        job_type VARCHAR(50) NOT NULL,
        experience VARCHAR(100),
        skills TEXT,
        posted_by INTEGER NOT NULL,
        applicants INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `;

    await SQL`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        cover_letter TEXT,
        resume_path VARCHAR(1024),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `;

    await SQL`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER NOT NULL,
        user_agent TEXT NOT NULL,
        ip_address VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await SQL`
      CREATE TABLE IF NOT EXISTS saved_jobs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `;

    await SQL.end({ timeout: 5 });

    console.log('✅ Database schema initialized successfully!');
    return NextResponse.json({ status: 'success', message: 'Database schema initialized' });
  } catch (error) {
    // Log full error details for debugging (stack + cause if available)
    console.error('❌ Error initializing database:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
      // @ts-ignore
      if ((error as any).cause) console.error('Error cause:', (error as any).cause);
    }
    if (SQL) {
      try { await SQL.end({ timeout: 5 }); } catch (e) {}
    }
    return NextResponse.json({ status: 'error', message: error instanceof Error ? String(error.message) : 'Failed to initialize database' }, { status: 500 });
  }
}
