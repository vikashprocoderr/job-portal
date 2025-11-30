'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { getJobs } from './jobs.action';
import { Briefcase, MapPin, DollarSign, Clock, Search, ArrowLeft, Plus, Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';

// Types
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary?: string | null;
  jobType: string;
  experience?: string | null;
  skills?: string | null;
  description: string;
  createdAt: Date;
  applicants: number | null;
  postedBy?: number | null;
}

type SortOption = 'newest' | 'oldest' | 'salary-high' | 'salary-low' | 'alphabetical';

export default function JobsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);


  useEffect(() => {
    if (!user) return;
    fetch('/api/jobs/saved', { credentials: 'same-origin' })
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => setSavedJobIds(d.data ?? []));
  }, [user]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await getJobs();
        if (result.status === 'success') {
          setJobs(result.data);
          setFilteredJobs(result.data);
          // fetch applied jobs for current user (if logged in)
          if (user) {
            try {
              const r = await fetch('/api/jobs/applied', { credentials: 'same-origin' });
              if (r.ok) {
                const d = await r.json();
                if (d.status === 'success') setAppliedJobIds(d.data ?? []);
              }
            } catch (err) {
              // ignore
            }
          }
        } else {
          toast.error(result.message || 'Failed to load jobs');
        }
      } catch (error) {
        toast.error('Error loading jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user]);

  const applySorting = (jobsToSort: Job[], sortOption: SortOption) => {
    const sorted = [...jobsToSort];
    switch (sortOption) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'salary-high':
        sorted.sort((a, b) => {
          const salaryA = parseSalary(a.salary);
          const salaryB = parseSalary(b.salary);
          return salaryB - salaryA;
        });
        break;
      case 'salary-low':
        sorted.sort((a, b) => {
          const salaryA = parseSalary(a.salary);
          const salaryB = parseSalary(b.salary);
          return salaryA - salaryB;
        });
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return sorted;
  };

  const parseSalary = (salary?: string | null): number => {
    if (!salary) return 0;
    const numbers = salary.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      return parseInt(numbers[0]);
    }
    return 0;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.location.toLowerCase().includes(query.toLowerCase())
    );
    const sorted = applySorting(filtered, sortBy);
    setFilteredJobs(sorted);
  };

  const handleSort = (newSort: SortOption) => {
    setSortBy(newSort);
    const sorted = applySorting(filteredJobs, newSort);
    setFilteredJobs(sorted);
  };

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
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Browse Jobs</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => router.push('/jobs/create')} className="gap-2">
              <Plus className="w-4 h-4" />
              Post Job
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search and Sort Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by job title, company, or location..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setLoading(true);
                const fetchJobs = async () => {
                  try {
                    const result = await getJobs();
                    if (result.status === 'success') {
                      setJobs(result.data);
                      setFilteredJobs(result.data);
                      toast.success('Jobs refreshed!');
                    }
                  } catch (error) {
                    toast.error('Error refreshing jobs');
                  } finally {
                    setLoading(false);
                  }
                };
                fetchJobs();
              }}
            >
              Refresh
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground flex items-center">Sort by:</span>
            <Button
              variant={sortBy === 'newest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('newest')}
            >
              Newest
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('oldest')}
            >
              Oldest
            </Button>
            <Button
              variant={sortBy === 'salary-high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('salary-high')}
            >
              Salary: High to Low
            </Button>
            <Button
              variant={sortBy === 'salary-low' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('salary-low')}
            >
              Salary: Low to High
            </Button>
            <Button
              variant={sortBy === 'alphabetical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('alphabetical')}
            >
              A - Z
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Found {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
          </p>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <div>
                <p className="text-muted-foreground mb-2">No jobs found. Try adjusting your search.</p>
                <p className="text-sm text-muted-foreground mb-4">Or check back soon as new opportunities are posted regularly.</p>
              </div>
              <Button variant="outline" onClick={() => window.location.href = '/api/seed'}>
                Load Demo Jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/jobs/${job.id}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="text-base">{job.company}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {job.jobType}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Job Details Row 1 */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{job.salary}</span>
                        </div>
                      )}
                      {job.experience && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{job.experience}</span>
                        </div>
                      )}
                    </div>

                    {/* Description Preview */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>

                    {/* Skills Tags */}
                    {job.skills && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills.split(',').slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-muted text-xs rounded">
                            {skill.trim()}
                          </span>
                        ))}
                        {job.skills.split(',').length > 3 && (
                          <span className="px-2 py-1 bg-muted text-xs rounded text-muted-foreground">
                            +{job.skills.split(',').length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {job.applicants} {job.applicants === 1 ? 'applicant' : 'applicants'}
                      </span>
                      <div className="flex gap-2 items-center">
                        {/* Save/Unsave button */}
                        {user && !(user.id === job.postedBy || user.role === 'employer') && (
                          <Button
                            size="icon"
                            variant={savedJobIds.includes(job.id) ? 'default' : 'outline'}
                            aria-label={savedJobIds.includes(job.id) ? 'Unsave job' : 'Save job'}
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!user) { router.push('/login'); return; }
                              if (savedJobIds.includes(job.id)) {
                                // Unsave
                                await fetch('/api/jobs/saved', { method: 'DELETE', body: JSON.stringify({ jobId: job.id }), credentials: 'same-origin', headers: { 'Content-Type': 'application/json' } });
                                setSavedJobIds(ids => ids.filter(id => id !== job.id));
                                toast('Job removed from saved');
                              } else {
                                // Save
                                await fetch('/api/jobs/saved', { method: 'POST', body: JSON.stringify({ jobId: job.id }), credentials: 'same-origin', headers: { 'Content-Type': 'application/json' } });
                                setSavedJobIds(ids => [...ids, job.id]);
                                toast('Job saved');
                              }
                            }}
                          >
                            {savedJobIds.includes(job.id) ? <BookmarkCheck className="w-5 h-5 text-primary" /> : <Bookmark className="w-5 h-5" />}
                          </Button>
                        )}
                        {/* Apply/Manage/Applied button */}
                        {user && (user.id === job.postedBy || user.role === 'employer') ? (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/jobs/${job.id}`); }}>
                            Manage Post
                          </Button>
                        ) : appliedJobIds.includes(job.id) ? (
                          <Button size="sm" disabled>Applied</Button>
                        ) : (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); if (!user) { router.push('/login'); return; } router.push(`/jobs/${job.id}/apply`); }}>
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
