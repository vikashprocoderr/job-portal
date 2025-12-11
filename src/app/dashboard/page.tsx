'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logoutAction } from '@/app/logout.action';
import { toast } from 'sonner';
import { LogOut, Briefcase, Heart, FileText, TrendingUp, ArrowRight, Settings, Search, MapPin, CheckCircle2, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { getJobs } from '@/app/jobs/jobs.action';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary?: string | null;
  jobType: string;
}

export default function Dashboard() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const [recentJobs, setRecentJobs] = useState<Job[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [profilePic, setProfilePic] = useState<string | null>(null);

    useEffect(() => {
        // Load profile picture from localStorage
        const savedProfilePic = localStorage.getItem('userProfilePic');
        if (savedProfilePic) {
            setProfilePic(savedProfilePic);
        }

        // Fetch recent jobs
        const fetchRecentJobs = async () => {
            try {
                const result = await getJobs();
                if (result.status === 'success') {
                    setRecentJobs(result.data.slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoadingJobs(false);
            }
        };
        fetchRecentJobs();
    }, []);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            const t = toast.loading('Logging out...');
            const result = await logoutAction();

            if (result.status === 'success') {
                logout();
                toast.dismiss(t);
                toast.success(result.message);
                router.push('/login');
            } else {
                toast.dismiss(t);
                toast.error(result.message);
            }
        } catch (error) {
            console.error('❌ Logout error:', error);
            toast.error('Failed to logout. Please try again.');
        } finally {
            setLoggingOut(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-background to-muted flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-linear-to-br from-background to-muted flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground mb-4">Not authenticated. Redirecting to login...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const avatarLetter = user?.name?.[0]?.toUpperCase() || '?';

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Welcome, {user?.name?.split(' ')[0]}!
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push('/profile')}
                                className="hover:bg-accent"
                                title="Settings"
                            >
                                <Settings className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleLogout}
                                disabled={loggingOut}
                                size="sm"
                                className="gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Welcome Card with Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="lg:col-span-2 bg-linear-to-br from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 border-0 text-white shadow-lg">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm mb-2">Your Job Search</p>
                                    <h3 className="text-4xl font-bold mb-1">Let's Find Your</h3>
                                    <h3 className="text-4xl font-bold">Dream Job</h3>
                                </div>
                                <div className="hidden sm:flex w-24 h-24 rounded-full bg-white/20 items-center justify-center">
                                    <Briefcase className="w-12 h-12 text-white/80" />
                                </div>
                            </div>
                            <p className="text-blue-100 text-sm mt-4">You have 0 pending applications</p>
                        </CardContent>
                    </Card>

                    {/* Stat Cards */}
                    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                                <Briefcase className="w-4 h-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">0</p>
                            <p className="text-xs text-muted-foreground mt-1">This month</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
                                <Heart className="w-4 h-4 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">0</p>
                            <p className="text-xs text-muted-foreground mt-1">For later</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Access */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-0 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer" onClick={() => router.push('/jobs')}>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <div className="p-3 bg-blue-500/10 rounded-lg">
                                            <Search className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <p className="font-semibold text-sm">Browse Jobs</p>
                                        <p className="text-xs text-muted-foreground">Find your next role</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-0 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <div className="p-3 bg-purple-500/10 rounded-lg">
                                            <FileText className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <p className="font-semibold text-sm">My Applications</p>
                                        <p className="text-xs text-muted-foreground">0 pending</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-0 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer" onClick={() => router.push('/profile')}>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <div className="p-3 bg-green-500/10 rounded-lg">
                                            <Settings className="w-6 h-6 text-green-600" />
                                        </div>
                                        <p className="font-semibold text-sm">Profile Settings</p>
                                        <p className="text-xs text-muted-foreground">Update info</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-0 shadow-sm hover:shadow-md transition-all hover:scale-105">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <div className="p-3 bg-orange-500/10 rounded-lg">
                                            <TrendingUp className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <p className="font-semibold text-sm">Profile Score</p>
                                        <p className="text-xs text-muted-foreground">50% complete</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Jobs */}
                        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-0 shadow-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recently Posted Jobs</CardTitle>
                                        <CardDescription>Exciting opportunities just added</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => router.push('/jobs')} className="gap-1">
                                        View All <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loadingJobs ? (
                                    <div className="text-center py-6">
                                        <div className="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary"></div>
                                    </div>
                                ) : recentJobs.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentJobs.map((job) => (
                                            <div key={job.id} className="p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm truncate">{job.title}</h4>
                                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                            <span>{job.company}</span>
                                                            <span>•</span>
                                                            <MapPin className="w-3 h-3" />
                                                            <span>{job.location}</span>
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="inline-block px-2 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs rounded">
                                                                {job.jobType}
                                                            </span>
                                                            {job.salary && (
                                                                <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                                                                    {job.salary}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button size="sm" variant="outline">Apply</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <p>No jobs available yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Your Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col items-center gap-3">
                                    {profilePic ? (
                                        <img
                                            src={profilePic}
                                            alt="Profile"
                                            className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                            {avatarLetter}
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <p className="font-bold">{user?.name}</p>
                                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full" onClick={() => router.push('/profile')}>
                                    Edit Profile
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Tips & Suggestions */}
                        <Card className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-orange-600" />
                                    Pro Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="space-y-2">
                                    <p className="font-semibold text-amber-900 dark:text-amber-200">Complete Your Profile</p>
                                    <p className="text-amber-800 dark:text-amber-300 text-xs">Add a photo and description to attract more employers</p>
                                </div>
                                <hr className="border-amber-200 dark:border-amber-800" />
                                <div className="space-y-2">
                                    <p className="font-semibold text-amber-900 dark:text-amber-200">Check Daily</p>
                                    <p className="text-amber-800 dark:text-amber-300 text-xs">New jobs are posted every day - be the first to apply</p>
                                </div>
                                <hr className="border-amber-200 dark:border-amber-800" />
                                <div className="space-y-2">
                                    <p className="font-semibold text-amber-900 dark:text-amber-200">Save Favorites</p>
                                    <p className="text-amber-800 dark:text-amber-300 text-xs">Bookmark jobs to review later and apply quickly</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">This Month</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Jobs Viewed</span>
                                    <span className="font-bold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Applied</span>
                                    <span className="font-bold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Saved</span>
                                    <span className="font-bold">0</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
