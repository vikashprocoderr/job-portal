"use server";
import { db } from "../config/db";
import { users } from "@/drizzle/drizzle";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { generateToken } from "@/lib/jwt";

export const loginAction = async (data: {
    email: string;
    password: string;
}) => {
    try {
        const { email, password } = data;
        
        if (!email || !password) {
            return {
                status: "error",
                message: "Email and password are required"
            };
        }
        
        if (password.length < 8) {
            return {
                status: "error",
                message: "Invalid email or password"
            };
        }
        
        
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));
        
        if (!user) {
            return {
                status: "error",
                message: "Invalid email or password"
            };
        }
        
        
        const passwordMatch = await argon2.verify(user.password, password);
        
        if (!passwordMatch) {
            return {
                status: "error",
                message: "Invalid email or password"
            };
        }
        
        console.log("✅ User logged in successfully:", { email: user.email, name: user.name });
        
        
        const token = generateToken({
            userId: user.id,
            email: user.email,
            name: user.name
        });
        
        return {
            status: "success",
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token: token
        };
        
    } catch (error) {
        console.error("❌ Login error:", error);
        return {
            status: "error",
            message: "An error occurred during login"
        };
    }
};
