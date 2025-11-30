import { timestamp, text, int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';


export const users = mysqlTable('users', {
    id:int().autoincrement().primaryKey(),
    name:varchar("name", { length: 255 }).notNull(),
    username:varchar("username", { length: 255 }).notNull().unique(),
    email:varchar("email", { length: 255 }).notNull().unique(),
    password:varchar("password", { length: 255 }).notNull(),
    role:varchar("role", { length: 50 }).notNull().default("applicant"),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at')

});


export const sessions = mysqlTable('sessions', { 
    id: varchar('id', {length: 255}).primaryKey(),
    userId: int().notNull().references(() => users.id, { onDelete: 'cascade' }),
    userAgent:text('user_agent').notNull(),
    ipAddress:varchar('ip_address', { length: 255 }).notNull(),
    expiresAt:timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),

}) 