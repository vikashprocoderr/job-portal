"use server";
import { clearAuthCookie } from "@/app/auth.cookies";

export const logoutAction = async () => {
    try {
        // Clear the auth cookie
        await clearAuthCookie();
        
        console.log("✅ User logged out successfully");
        
        return {
            status: "success",
            message: "Logged out successfully!"
        };
    } catch (error) {
        console.error("❌ Logout error:", error);
        return {
            status: "error",
            message: "An error occurred during logout"
        };
    }
};
