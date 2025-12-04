import { serial, pgTable, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
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

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  salary: varchar('salary', { length: 100 }),
  jobType: varchar('job_type', { length: 50 }).notNull(),
  experience: varchar('experience', { length: 100 }),
  skills: text('skills'),
  postedBy: integer('posted_by').notNull(),
  applicants: integer('applicants').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull(),
  userId: integer('user_id').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
  coverLetter: text('cover_letter'),
  resumePath: varchar('resume_path', { length: 1024 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: integer('user_id').notNull(),
  userAgent: text('user_agent').notNull(),
  ipAddress: varchar('ip_address', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const savedJobs = pgTable('saved_jobs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  jobId: integer('job_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
