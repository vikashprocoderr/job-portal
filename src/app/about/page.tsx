'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, Target, Users, Zap, Award } from 'lucide-react';

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold">About JobHub</h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <Card className="mb-12 bg-linear-to-br from-blue-500/10 to-purple-500/10 border-0">
                    <CardContent className="pt-12 pb-12">
                        <h2 className="text-4xl font-bold mb-4">Welcome to JobHub</h2>
                        <p className="text-xl text-muted-foreground mb-6">
                            Your gateway to amazing career opportunities. JobHub connects talented professionals with companies looking for their next great team members.
                        </p>
                        <p className="text-lg text-muted-foreground">
                            Founded in 2024, we're committed to making job search simple, transparent, and effective for everyone.
                        </p>
                    </CardContent>
                </Card>

                {/* Mission Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Card>
                        <CardHeader>
                            <Target className="w-8 h-8 text-blue-600 mb-2" />
                            <CardTitle>Our Mission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                To revolutionize the job search experience by providing a platform where opportunities meet talent. We believe everyone deserves to find their dream job easily.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Zap className="w-8 h-8 text-purple-600 mb-2" />
                            <CardTitle>Our Vision</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                To become the most trusted job portal globally, enabling millions of people to make career decisions with confidence and connect with their ideal employers.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Values Section */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-6">Our Values</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <Users className="w-6 h-6 text-green-600 mb-2" />
                                <CardTitle className="text-lg">Community First</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    We prioritize our community's needs and continuously improve based on your feedback.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Award className="w-6 h-6 text-orange-600 mb-2" />
                                <CardTitle className="text-lg">Excellence</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    We maintain high standards in everything we do, from platform features to customer support.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Zap className="w-6 h-6 text-blue-600 mb-2" />
                                <CardTitle className="text-lg">Innovation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    We constantly innovate to bring new features and improvements to enhance your experience.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Target className="w-6 h-6 text-red-600 mb-2" />
                                <CardTitle className="text-lg">Transparency</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    We believe in honest communication and transparent practices with all our users.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Team Section */}
                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle>Our Team</CardTitle>
                        <CardDescription>Passionate professionals dedicated to your success</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            JobHub is built by a team of experienced software engineers, designers, and product managers who are passionate about making the job search experience better for everyone.
                        </p>
                        <p className="text-muted-foreground">
                            We work 24/7 to ensure our platform is reliable, secure, and user-friendly. Your success is our success.
                        </p>
                    </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border-0">
                    <CardContent className="pt-12 pb-12 text-center">
                        <h3 className="text-2xl font-bold mb-4">Ready to Find Your Dream Job?</h3>
                        <p className="text-muted-foreground mb-6">
                            Join thousands of professionals who have found their perfect role on JobHub.
                        </p>
                        <Button size="lg" onClick={() => window.location.href = '/jobs'} className="gap-2">
                            Browse Jobs Now
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
