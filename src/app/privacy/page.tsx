'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
                        <h1 className="text-2xl font-bold">Privacy Policy</h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <Card>
                    <CardContent className="pt-8 pb-8 prose prose-sm dark:prose-invert max-w-none">
                        <div className="space-y-6 text-sm">
                            <div>
                                <h3 className="text-lg font-bold mb-2">1. Introduction</h3>
                                <p className="text-muted-foreground">
                                    JobHub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">2. Information We Collect</h3>
                                <p className="text-muted-foreground mb-2">We collect information you provide directly, such as:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                    <li>Account registration information (name, email, password)</li>
                                    <li>Profile information (profile picture, bio, experience)</li>
                                    <li>Job applications and related data</li>
                                    <li>Communications you send to us</li>
                                    <li>Payment information (if applicable)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">3. How We Use Your Information</h3>
                                <p className="text-muted-foreground mb-2">We use the information we collect to:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Send you updates, newsletters, and promotional content</li>
                                    <li>Respond to your inquiries and support requests</li>
                                    <li>Comply with legal obligations</li>
                                    <li>Prevent fraud and ensure security</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">4. Data Security</h3>
                                <p className="text-muted-foreground">
                                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">5. Your Rights</h3>
                                <p className="text-muted-foreground mb-2">You have the right to:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                    <li>Access your personal information</li>
                                    <li>Correct inaccurate data</li>
                                    <li>Request deletion of your data</li>
                                    <li>Opt-out of marketing communications</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">6. Contact Us</h3>
                                <p className="text-muted-foreground">
                                    If you have any questions about this Privacy Policy, please contact us at privacy@jobhub.com
                                </p>
                            </div>

                            <p className="text-xs text-muted-foreground pt-4 border-t">
                                Last updated: November 27, 2024
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
