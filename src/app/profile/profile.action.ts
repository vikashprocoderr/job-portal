'use server';

import { cookies } from 'next/headers';

export async function updateProfile(name: string, profilePic?: string) {
    try {
        // Dynamic imports to avoid import-time DB/JWT loading
        const [{ db }, { users }, { eq }, { verifyToken }] = await Promise.all([
            import('@/app/config/db'),
            import('@/drizzle/drizzle'),
            import('drizzle-orm'),
            import('@/components/lib/jwt')
        ]);

        // Get token from cookie
        const cookieStore = await cookies();
        const token = cookieStore.get('authToken')?.value;

        if (!token) {
            console.error('❌ No token found in cookies');
            return {
                status: 'error',
                message: 'Unauthorized - No token found',
            };
        }

        // Verify token and get user ID
        const payload = verifyToken(token);

        if (!payload || !payload.userId) {
            console.error('❌ Invalid token payload:', payload);
            return {
                status: 'error',
                message: 'Unauthorized - Invalid token',
            };
        }

        console.log('✅ Token verified for user:', payload.userId);

        // Validate name
        if (!name || !name.trim()) {
            return {
                status: 'error',
                message: 'Name is required',
            };
        }

        // Update user in database
        const updateData: Record<string, any> = {
            name: name.trim(),
        };

        // Note: Base64 images are too large for database. Store only if it's a URL reference
        // For now, we'll skip profile pic updates - can be enhanced with proper image upload service
        // if (profilePic && !profilePic.startsWith('data:')) {
        //     updateData.profilePic = profilePic;
        // }

        console.log('📝 Updating user:', payload.userId, 'with data:', Object.keys(updateData));

        await db.update(users).set(updateData).where(eq(users.id, payload.userId));
        
        console.log('✅ User profile updated successfully');

        return {
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                name: name.trim(),
                profilePic: null, // Will use client-side display for now
            },
        };
    } catch (error) {
        console.error('❌ Update profile error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
        console.error('Error details:', errorMessage);
        return {
            status: 'error',
            message: errorMessage,
        };
    }
}
