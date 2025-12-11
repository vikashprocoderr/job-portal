'use client';

import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { useAuth } from '@/components/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { updateProfile } from '@/app/profile/profile.action';

interface ProfileForm {
    name: string;
    email: string;
}

export default function ProfilePage() {
    const { user, logout, login } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState<ProfileForm>({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [tempProfilePic, setTempProfilePic] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Load profile picture from localStorage on mount
    useEffect(() => {
        const savedProfilePic = localStorage.getItem('userProfilePic');
        if (savedProfilePic) {
            setProfilePic(savedProfilePic);
        }
    }, []);

    const handleChange = (name: keyof ProfileForm, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image must be less than 2MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }

            // For now, just show preview
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                setTempProfilePic(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveProfilePic = () => {
        setTempProfilePic(null);
        setProfilePic(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error('Name is required');
            return;
        }

        setSaving(true);
        const t = toast.loading('Saving profile...');

        try {
            // Only send name to backend (profile pic is stored locally)
            const result = await updateProfile(form.name);

            if (result.status === 'success') {
                // Save profile pic to localStorage if it was changed
                if (tempProfilePic) {
                    localStorage.setItem('userProfilePic', tempProfilePic);
                    setProfilePic(tempProfilePic);
                    setTempProfilePic(null);
                }

                // Update context
                if (user) {
                    login(
                        {
                            ...user,
                            name: form.name.trim(),
                            profilePic: profilePic || tempProfilePic || null,
                        },
                        localStorage.getItem('authToken') || ''
                    );
                }
                toast.dismiss(t);
                toast.success('Profile updated successfully!');
            } else {
                toast.dismiss(t);
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.dismiss(t);
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Not authenticated</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const displayPic = tempProfilePic || profilePic;
    const avatarLetter = form.name?.[0]?.toUpperCase() || '?';

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold">Profile Settings</h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-12">
                {/* Profile Info Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                        <CardDescription>Manage your account information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Picture Section */}
                            <div className="space-y-4">
                                <Label>Profile Picture</Label>
                                <div className="flex items-center gap-6">
                                    {/* Avatar Display */}
                                    <div className="relative">
                                        {displayPic ? (
                                            <img
                                                src={displayPic}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                                                {avatarLetter}
                                            </div>
                                        )}
                                        {displayPic && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveProfilePic}
                                                className="absolute top-0 right-0 bg-destructive rounded-full p-1 text-white hover:bg-destructive/90"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Upload Button */}
                                    <div className="flex-1">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfilePicChange}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full gap-2"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="w-4 h-4" />
                                            Upload Picture
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            PNG, JPG or GIF (max. 2MB)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Your full name"
                                    value={form.name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
                                    className="text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={form.email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                                    disabled
                                    className="text-base opacity-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>

                            <Button type="submit" disabled={saving} className="w-full gap-2">
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Account Settings */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div>
                                <p className="font-medium">Theme</p>
                                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                            </div>
                            <ThemeToggle />
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>Irreversible actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                const t = toast.loading('Logging out...');
                                try {
                                    logout();
                                    toast.dismiss(t);
                                    toast.success('Logged out successfully');
                                    router.push('/login');
                                } catch (error) {
                                    toast.error('Failed to logout');
                                }
                            }}
                            className="w-full"
                        >
                            Logout
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
