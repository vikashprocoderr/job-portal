'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactPage() {
    const router = useRouter();
    const [form, setForm] = useState<ContactForm>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [sending, setSending] = useState(false);

    const handleChange = (name: keyof ContactForm, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!form.email.trim()) {
            toast.error('Email is required');
            return;
        }

        if (!form.subject.trim()) {
            toast.error('Subject is required');
            return;
        }

        if (!form.message.trim()) {
            toast.error('Message is required');
            return;
        }

        setSending(true);
        const t = toast.loading('Sending message...');

        // Simulate sending
        setTimeout(() => {
            toast.dismiss(t);
            toast.success('Message sent successfully! We will get back to you soon.');
            setForm({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
            setSending(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold">Contact Us</h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Contact Info */}
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Get in Touch</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex gap-4">
                                    <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold">Email</p>
                                        <p className="text-sm text-muted-foreground">contact@jobhub.com</p>
                                        <p className="text-sm text-muted-foreground">support@jobhub.com</p>
                                    </div>
                                </div>

                                <hr />

                                <div className="flex gap-4">
                                    <Phone className="w-5 h-5 text-green-600 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold">Phone</p>
                                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                                        <p className="text-sm text-muted-foreground">Mon-Fri 9AM-6PM EST</p>
                                    </div>
                                </div>

                                <hr />

                                <div className="flex gap-4">
                                    <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold">Address</p>
                                        <p className="text-sm text-muted-foreground">123 Tech Street</p>
                                        <p className="text-sm text-muted-foreground">San Francisco, CA 94105</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Quick Links</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => router.push('/about')}>
                                    About Us
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => router.push('/privacy')}>
                                    Privacy Policy
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => router.push('/terms')}>
                                    Terms of Service
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => router.push('/jobs')}>
                                    Browse Jobs
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Send us a Message</CardTitle>
                                <CardDescription>We'll get back to you as soon as possible</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Your name"
                                                value={form.name}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="your@email.com"
                                                value={form.email}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            placeholder="What is this about?"
                                            value={form.subject}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('subject', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message *</Label>
                                        <textarea
                                            id="message"
                                            placeholder="Please share your message, feedback, or inquiry..."
                                            value={form.message}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('message', e.target.value)}
                                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground resize-none min-h-[200px]"
                                        />
                                    </div>

                                    <Button type="submit" disabled={sending} className="w-full gap-2">
                                        <Send className="w-4 h-4" />
                                        {sending ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
