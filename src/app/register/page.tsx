"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, UserCheck } from 'lucide-react';
import { registerAction } from './register.action';
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';


interface RegisterInterface {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "applicant" | "employer";
}

const Register: React.FC = () => {
  const [FormData, setFormData] = useState<RegisterInterface>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "applicant"
  })

  const handleInputChange = (name: string, values: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: values,
    }));
  }


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    

    if (FormData.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }
    
    if (FormData.password !== FormData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    
    const registerData = {
      name: FormData.name.trim(),
      username: FormData.username.trim(),
      email: FormData.email.trim(),
      password: FormData.password,
      confirmPassword: FormData.confirmPassword,
      role: FormData.role
    };
    
    const result = await registerAction(registerData);
    if(result.status === "success"){
      toast.success(result.message);
    }else{
      toast.error(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 ">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full mb-4 flex items-center justify-center text-white text-2xl font-bold">
            <UserCheck className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Join Our Job Portal</CardTitle>
          <CardDescription>Create your account to apply for jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" method="post">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full Name"
                  required
                  className="pl-10"
                  value={FormData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}


                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a username"
                required
                value={FormData.username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("username", e.target.value)}

              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={FormData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                  value={FormData.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("password", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  required
                  value={FormData.confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("confirmPassword", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                className="w-full rounded-md border bg-transparent px-3 py-2"
                value={FormData.role}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange("role", e.target.value)}
              >
                <option value="applicant">Applicant</option>
                <option value="employer">Employer</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <Button  type="submit">Create account</Button>
              <Link href="/login" className="text-sm text-muted-foreground">Already have an account?</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
