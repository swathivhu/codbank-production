
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebase, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginPage() {
  const { auth, firestore } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({ variant: "destructive", title: "Required Fields", description: "Please enter your credentials." });
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const loggedUser = userCredential.user;

      // Fetch role for session
      const userDoc = await getDoc(doc(firestore, 'codusers', loggedUser.uid));
      const role = userDoc.exists() ? userDoc.data().role : 'CUSTOMER';
      const username = userDoc.exists() ? userDoc.data().username : loggedUser.email?.split('@')[0];

      // Create secure session via API
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: loggedUser.uid, username, role })
      });

      toast({ title: "Login Successful", description: "Identity verified. Opening secure vault..." });
      router.push('/dashboard');
    } catch (error: any) {
      setIsLoading(false);
      let message = "Invalid email or password.";
      if (error.code === 'auth/too-many-requests') message = "Account locked temporarily.";
      toast({ variant: "destructive", title: "Authentication Failed", description: message });
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
            <h1 className="text-2xl font-bold font-headline tracking-tight">Access CodBank Terminal</h1>
            <p className="text-muted-foreground">Secure session required</p>
          </div>

          <Card className="border-white/5 bg-card/50 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <form onSubmit={handleLogin}>
              <CardHeader className="pt-8 px-8 pb-4">
                <CardTitle className="font-headline text-2xl font-black">Sign In</CardTitle>
                <CardDescription>Enter credentials to continue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-8 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input id="email" type="email" placeholder="alex@codbank.com" className="bg-background/50 border-white/10 h-12 rounded-xl" required value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Password</Label>
                    <Link href="#" className="text-xs text-accent font-bold hover:underline">Forgot password?</Link>
                  </div>
                  <Input id="password" type="password" className="bg-background/50 border-white/10 h-12 rounded-xl" required value={formData.password} onChange={handleInputChange} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-6 p-8">
                <Button type="submit" className="w-full h-14 text-lg shadow-xl" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <><Lock className="mr-2 h-5 w-5" /> Login Securely</>}
                </Button>
                <p className="text-center text-sm text-muted-foreground font-medium">
                  New Operator? <Link href="/register" className="text-accent hover:underline font-bold">Register Identity</Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
