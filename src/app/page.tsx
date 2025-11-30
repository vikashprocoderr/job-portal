'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Briefcase, Users, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Remove auto-redirect for authenticated users on landing page

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Nav */}
      <header className="border-b border-border mt-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 ">
            <Briefcase className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold ">JobHub</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/register")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-4">Find Your Dream Job</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover amazing opportunities at top companies. Build your career with JobHub.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" onClick={() => router.push("/register")} className="gap-2">
            Browse Jobs <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/login")}>
            I'm Already Registered
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose JobHub?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Thousands of Jobs</CardTitle>
                <CardDescription>Find roles from top companies across industries</CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Direct Hiring</CardTitle>
                <CardDescription>Connect directly with recruiters and hiring teams</CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Career Growth</CardTitle>
                <CardDescription>Build your profile and advance your career</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Sign Up", desc: "Create your account in seconds" },
            { step: "2", title: "Build Profile", desc: "Add your skills and experience" },
            { step: "3", title: "Browse Jobs", desc: "Find roles that match you" },
            { step: "4", title: "Get Hired", desc: "Land your dream job" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Find Your Next Opportunity?</h3>
          <p className="text-lg mb-8 opacity-90">Join thousands of job seekers and find your perfect role today.</p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => router.push("/register")}>
              Register Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/login")} className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">JobHub</h4>
              <p className="text-sm text-muted-foreground">Your gateway to career success.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/jobs" className="hover:text-foreground">Browse Jobs</Link></li>
                <li><Link href="/register" className="hover:text-foreground">Create Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 JobHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
