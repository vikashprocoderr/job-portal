"use client"

import React, { useState, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { loginAction } from './login.action'
import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { setAuthCookie } from '@/app/auth.cookies'

interface LoginForm {
    email: string
    password: string
}

export default function Login() {
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()

    const handleChange = (name: keyof LoginForm, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        
        if (!form.email || !form.password) {
            return toast.error("Email and password are required!");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            return toast.error("Invalid email format!");
        }
        
        
        if (form.password.length < 8) {
            return toast.error("Password must be at least 8 characters!");
        }
        
        setLoading(true);
        const toastId = toast.loading("Signing in...");
        
        try {
            const loginData = {
                email: form.email.trim(),
                password: form.password
            };
            
            const result = await loginAction(loginData);
            
            
            toast.dismiss(toastId);
            
            if (result.status === "success" && result.token && result.user) {
                // Cookie mein token set karo
                const cookieResult = await setAuthCookie(result.token);
                
                if (!cookieResult.success) {
                    toast.error("Failed to set session. Please try again.");
                    setLoading(false);
                    return;
                }
                
                // AuthContext mein save karo
                login(result.user, result.token);
                
                toast.success(result.message);
                
                // Delay taaki middleware bhi token ko verify kar sake
                setTimeout(() => {
                    router.push('/dashboard');
                }, 800);
            } else {
                toast.error(result.message);
            }
            
        } catch (error) {
            console.error("❌ Login error:", error);
            toast.dismiss(toastId);
            toast.error("Login failed! Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-full mb-4 flex items-center justify-center text-white text-2xl font-bold">
                        <User className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Sign in to continue to the job portal</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    className="pl-10"
                                    value={form.email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Your password"
                                    required
                                    className="pl-10"
                                    value={form.password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                            <Link href="/register" className="text-sm text-muted-foreground">Create account</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}