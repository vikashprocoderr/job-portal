'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/components/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createJob } from '@/app/jobs/create.action';

interface JobForm {
    title: string;
    description: string;
    company: string;
    location: string;
    salary?: string;
    jobType: string;
    experience?: string;
    skills?: string;
}

export default function CreateJobPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState<JobForm>({
        title: '',
        description: '',
        company: '',
        location: '',
        salary: '',
        jobType: 'full-time',
        experience: '',
        skills: '',
    });
    const [creating, setCreating] = useState(false);

    const handleChange = (name: keyof JobForm, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!form.title.trim()) {
            toast.error('Job title is required');
            return;
        }

        if (!form.company.trim()) {
            toast.error('Company name is required');
            return;
        }

        if (!form.location.trim()) {
            toast.error('Location is required');
            return;
        }

        if (!form.description.trim()) {
            toast.error('Job description is required');
            return;
        }

        setCreating(true);
        const t = toast.loading('Creating job...');

        try {
            const result = await createJob(form);

            if (result.status === 'success') {
                toast.dismiss(t);
                toast.success('Job posted successfully!');
                setForm({
                    title: '',
                    description: '',
                    company: '',
                    location: '',
                    salary: '',
                    jobType: 'full-time',
                    experience: '',
                    skills: '',
                });
                setTimeout(() => {
                    router.push('/jobs');
                }, 1000);
            } else {
                toast.dismiss(t);
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error creating job:', error);
            toast.dismiss(t);
            toast.error('Failed to create job');
        } finally {
            setCreating(false);
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

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold">Post a New Job</h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Job Details</CardTitle>
                        <CardDescription>Fill in all the required information to post a job</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title *</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="e.g., Senior React Developer"
                                    value={form.title}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)}
                                    className="text-base"
                                />
                            </div>

                            {/* Company */}
                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name *</Label>
                                <Input
                                    id="company"
                                    type="text"
                                    placeholder="e.g., Tech Solutions Inc"
                                    value={form.company}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('company', e.target.value)}
                                    className="text-base"
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="e.g., New York, NY or Remote"
                                    value={form.location}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('location', e.target.value)}
                                    className="text-base"
                                />
                            </div>

                            {/* Job Type */}
                            <div className="space-y-2">
                                <Label htmlFor="jobType">Job Type *</Label>
                                <select
                                    id="jobType"
                                    value={form.jobType}
                                    onChange={(e) => handleChange('jobType', e.target.value)}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                >
                                    <option value="full-time">Full Time</option>
                                    <option value="part-time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="freelance">Freelance</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>

                            {/* Salary (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary (Optional)</Label>
                                <Input
                                    id="salary"
                                    type="text"
                                    placeholder="e.g., $80,000 - $120,000/year"
                                    value={form.salary}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('salary', e.target.value)}
                                    className="text-base"
                                />
                            </div>

                            {/* Experience (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="experience">Required Experience (Optional)</Label>
                                <Input
                                    id="experience"
                                    type="text"
                                    placeholder="e.g., 3-5 years"
                                    value={form.experience}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('experience', e.target.value)}
                                    className="text-base"
                                />
                            </div>

                            {/* Skills (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="skills">Required Skills (Optional)</Label>
                                <Input
                                    id="skills"
                                    type="text"
                                    placeholder="e.g., React, TypeScript, Node.js (comma separated)"
                                    value={form.skills}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('skills', e.target.value)}
                                    className="text-base"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Job Description *</Label>
                                <textarea
                                    id="description"
                                    placeholder="Describe the job role, responsibilities, and any other relevant details..."
                                    value={form.description}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground resize-none min-h-[200px]"
                                />
                            </div>

                            <Button type="submit" disabled={creating} className="w-full gap-2">
                                <Plus className="w-4 h-4" />
                                {creating ? 'Creating Job...' : 'Post Job'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
