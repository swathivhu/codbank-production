'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useFirebase, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { auth } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // If already logged in, redirect to dashboard or provide a way to logout
  useEffect(() => {
    if (user) {
      // In a real banking app, we might force a logout or just redirect
      // For now, let's just let them know they are already authenticated
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Required Fields",
        description: "Please enter both your email and password.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to CodBank. Accessing your secure vault...",
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      setIsLoading(false);
      let message = "Invalid email or password. Please try again.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "The credentials provided do not match our records.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Account temporarily locked due to many failed attempts. Try again later.";
      }

      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: message,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary p-3 rounded-2xl mb-4 shadow-xl">
              <ShieldCheck className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-2xl font-bold font-headline tracking-tight">Welcome back to CodBank</h1>
            <p className="text-muted-foreground">Securely access your account</p>
          </div>

          <Card className="border-white/5 bg-card/50 backdrop-blur-xl shadow-2xl">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle className="font-headline">Sign In</CardTitle>
                <CardDescription>Enter your credentials to continue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="alex@codbank.com" 
                    className="bg-background/50 border-white/10" 
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-accent hover:underline">Forgot password?</Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    className="bg-background/50 border-white/10" 
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90 text-background font-bold h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Login Securely
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account? <Link href="/register" className="text-accent hover:underline font-medium">Create one now</Link>
                </p>
              </CardFooter>
            </form>
          </Card>
          
          <div className="mt-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-4">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-accent" /> SSL Encrypted</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-accent" /> Multi-factor Ready</span>
          </div>
        </div>
      </main>
    </div>
  );
}
