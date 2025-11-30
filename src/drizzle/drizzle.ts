export const savedJobs = mysqlTable('saved_jobs', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(),
  jobId: int('job_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
import { serial, mysqlTable, varchar, timestamp, text, int, decimal } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('applicant'),
  profilePic: varchar('profile_pic', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const jobs = mysqlTable('jobs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  salary: varchar('salary', { length: 100 }),
  jobType: varchar('job_type', { length: 50 }).notNull(), // full-time, part-time, contract, etc.
  experience: varchar('experience', { length: 100 }), // e.g. "2-5 years"
  skills: text('skills'), // comma separated or JSON
  postedBy: int('posted_by').notNull(), // user ID who posted
  applicants: int('applicants').default(0), // count of applications
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const applications = mysqlTable('applications', {
  id: serial('id').primaryKey(),
  jobId: int('job_id').notNull(),
  userId: int('user_id').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, accepted, rejected
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
  coverLetter: text('cover_letter'),
  resumePath: varchar('resume_path', { length: 1024 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: int('user_id').notNull(),
  userAgent: text('user_agent').notNull(),
  ipAddress: varchar('ip_address', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
