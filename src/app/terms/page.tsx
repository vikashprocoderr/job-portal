'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
                        <h1 className="text-2xl font-bold">Terms of Service</h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <Card>
                    <CardContent className="pt-8 pb-8 prose prose-sm dark:prose-invert max-w-none">
                        <div className="space-y-6 text-sm">
                            <div>
                                <h3 className="text-lg font-bold mb-2">1. Agreement to Terms</h3>
                                <p className="text-muted-foreground">
                                    By accessing and using JobHub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">2. Use License</h3>
                                <p className="text-muted-foreground mb-2">Permission is granted to temporarily download one copy of the materials (information or software) on JobHub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title. Under this license you may not:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                    <li>Modify or copy the materials</li>
                                    <li>Use the materials for any commercial purpose or for any public display</li>
                                    <li>Attempt to reverse engineer any software contained on JobHub</li>
                                    <li>Remove any copyright or other proprietary notations from the materials</li>
                                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">3. User Responsibilities</h3>
                                <p className="text-muted-foreground mb-2">As a user of JobHub, you agree to:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                    <li>Provide accurate and complete information during registration</li>
                                    <li>Maintain the confidentiality of your account credentials</li>
                                    <li>Not engage in any form of harassment or abuse</li>
                                    <li>Not post offensive, defamatory, or illegal content</li>
                                    <li>Not attempt to disrupt the normal functioning of the platform</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">4. Job Postings</h3>
                                <p className="text-muted-foreground">
                                    Employers are responsible for the accuracy and legality of job postings. JobHub does not endorse or verify any job listings. Users should exercise caution and conduct their own due diligence before applying for jobs.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">5. Limitation of Liability</h3>
                                <p className="text-muted-foreground">
                                    In no event shall JobHub, or its suppliers, be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on JobHub.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">6. Modifications to Terms</h3>
                                <p className="text-muted-foreground">
                                    JobHub may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">7. Governing Law</h3>
                                <p className="text-muted-foreground">
                                    These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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
