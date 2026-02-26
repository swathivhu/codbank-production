'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useFirebase, setDocumentNonBlocking } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

export default function RegisterPage() {
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.username) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields (Email, Password, Username).",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    setIsLoading(true);

    bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(formData.password, salt))
      .then(hashedPassword => {
        return createUserWithEmailAndPassword(auth, formData.email, formData.password)
          .then(userCredential => {
            const user = userCredential.user;
            const profileData = {
              id: user.uid,
              userId: user.uid,
              username: formData.username,
              email: formData.email,
              password: hashedPassword,
              phone: formData.phone || '',
              role: 'CUSTOMER',
              balance: 100000,
              createdAt: serverTimestamp(),
              displayName: `${formData.firstName} ${formData.lastName}`.trim(),
            };

            setDocumentNonBlocking(doc(firestore, 'codusers', user.uid), profileData, { merge: true });
            toast({ title: "Registration Successful", description: "Your secure account has been created." });
            return signOut(auth).then(() => {
              router.push('/login');
            });
          });
      })
      .catch((error: any) => {
        setIsLoading(false);
        let message = "An unexpected error occurred.";
        if (error.code === 'auth/email-already-in-use') message = "This email is already registered.";
        toast({ variant: "destructive", title: "Registration Failed", description: message });
      });
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
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="hidden lg:block space-y-10">
            <h1 className="text-5xl font-black font-headline tracking-tighter leading-tight">
              Join <span className="text-accent">CodBank</span> today and take control of your wealth.
            </h1>
            <div className="space-y-8">
              {[
                { title: "No Hidden Fees", desc: "Transparency is our protocol. No unexpected charges." },
                { title: "Enterprise Security", desc: "Hardware-level encryption for your digital assets." },
                { title: "Instant Deployment", desc: "Activate your global vault in under 3 minutes." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="bg-accent/10 p-2 h-fit rounded-2xl">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-headline font-black text-xl mb-1">{item.title}</h3>
                    <p className="text-muted-foreground font-medium text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-white/5 bg-card/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <form onSubmit={handleRegister}>
              <CardHeader className="p-10 pb-6">
                <CardTitle className="font-headline text-3xl font-black tracking-tight">Create Account</CardTitle>
                <CardDescription className="text-base">Join the future of institutional-grade banking.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-10 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">First Name</Label>
                    <Input id="firstName" placeholder="Alex" className="bg-background/50 border-white/10 h-12 rounded-xl" value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Last Name</Label>
                    <Input id="lastName" placeholder="Pierce" className="bg-background/50 border-white/10 h-12 rounded-xl" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Username</Label>
                  <Input id="username" placeholder="alexpierce" className="bg-background/50 border-white/10 h-12 rounded-xl" required value={formData.username} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input id="email" type="email" placeholder="alex@codbank.com" className="bg-background/50 border-white/10 h-12 rounded-xl" required value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Secure Password</Label>
                  <Input id="password" type="password" className="bg-background/50 border-white/10 h-12 rounded-xl" required value={formData.password} onChange={handleInputChange} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-6 p-10">
                <Button type="submit" className="w-full h-16 text-xl shadow-2xl" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Deploy Secure Account"}
                </Button>
                <p className="text-center text-sm text-muted-foreground font-medium">
                  Already a member? <Link href="/login" className="text-accent hover:underline font-bold">Log in to vault</Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
