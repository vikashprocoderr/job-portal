"use server";
import argon2 from "argon2";

export const registerAction = async (Data: {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "applicant" | "employer";
}) => {
    try {
        const [{ users }, { db }, { eq, or }] = await Promise.all([
            import("@/drizzle/drizzle"),
            import("../config/db"),
            import("drizzle-orm")
        ]);

        const { name, username, email, password, role } = Data;
        const [user] = await db
            .select()
            .from(users)
            .where(or(eq(users.email, email), eq(users.username, username)));

        if (user) {
            if (user.email === email) {
                return {
                    status: "error",
                    message: "Email already exists",
                };
            }
            if (user.username === username) {
                return {
                    status: "error",
                    message: "Username already exists",
                };
            }
        }

        const hashedPassword = await argon2.hash(password);

        try {
            await db.insert(users).values({
                name,
                username,
                email,
                password: hashedPassword,
                role,
            });
            return {
                status: "success",
                message: "User created successfully",
            };
        } catch (error) {
            console.error('Error inserting user:', error);
            return {
                status: "error",
                message: "Error creating user",
            };
        }
    } catch (err) {
        console.error('registerAction unexpected error:', err);
        return {
            status: 'error',
            message: 'Internal server error',
        };
    }
}