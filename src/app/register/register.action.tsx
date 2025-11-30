"use server";
import { users } from "@/drizzle/drizzle";
import { db } from "../config/db";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";

export const registerAction = async (Data: {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "applicant" | "employer";
}) => {
    const { name, username, email, password,role } = Data;
    const [user] = await db
    .select().from(users)
    .where(or(eq(users .email, email), eq(users.username, username)));

    if(user){
        if(user.email === email){
            return {
                status: "error",
                message: "Email already exists"
            }
        }
        if(user.username === username){
            return {
                status: "error",
                message: "Username already exists"
            }
        }
    }



    const hashedPassword = await argon2.hash(password);



    try {
        await db.insert(users).values({
            name,
            username,
            email,
            password: hashedPassword,
            role
        });
        return {
            status: "success",
            message: "User created successfully"
        }
    }
    catch (error) {
        return {
            status: "error",
            message: "Error creating user"
        }

    }
}