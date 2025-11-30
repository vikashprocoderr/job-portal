"use server";

import { cookies } from "next/headers";

export const setAuthCookie = async (token: string) => {
    try {
        const cookieStore = await cookies();
        
        cookieStore.set("authToken", token, {
            httpOnly: true, // HttpOnly for security (not accessible from JS)
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/"
        });
        
        return { success: true };
    } catch (error) {
        console.error("Error setting cookie:", error);
        return { success: false };
    }
};

export const clearAuthCookie = async () => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("authToken");
        return { success: true };
    } catch (error) {
        console.error("Error clearing cookie:", error);
        return { success: false };
    }
};
