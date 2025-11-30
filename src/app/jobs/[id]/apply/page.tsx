"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function JobApplyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const jobId = Number(params.id);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please upload your resume.');
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('jobId', String(jobId));
      if (coverLetter) form.append('coverLetter', coverLetter);
      form.append('resume', resumeFile);

      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        body: form,
        credentials: 'same-origin',
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        toast.success(data.message || 'Application submitted');
        router.push('/jobs');
      } else {
        toast.error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Apply submit error:', error);
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Apply to Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Resume (PDF, DOC, DOCX) <span className="text-xs text-muted-foreground">(max 5MB)</span></Label>
              <div className="mt-1 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-muted/5 hover:bg-muted/10 px-3 py-2 rounded text-sm border border-input">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  <span className="text-sm text-foreground">{resumeFile ? resumeFile.name : 'Choose file'}</span>
                </label>
                <Button variant="outline" type="button" onClick={e => { e.preventDefault(); setResumeFile(null); }}>Remove</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Letter (optional)</Label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={8}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50"
                placeholder="Write a short cover letter to stand out..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={submitting || !resumeFile}>{submitting ? 'Submitting...' : 'Submit Application'}</Button>
              <Button variant="outline" onClick={() => router.push('/jobs')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
