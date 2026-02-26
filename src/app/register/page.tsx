
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
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

    try {
      // 1. Hash the password with bcrypt (10 rounds) as requested
      // Using bcryptjs for client-side compatibility
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);

      // 2. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 3. Create the profile document in Firestore
      // Document ID matches the Auth UID as per security requirements in firestore.rules
      await setDoc(doc(firestore, 'codusers', user.uid), {
        id: user.uid, // Required for 'create' rule validation
        userId: user.uid,
        username: formData.username,
        email: formData.email,
        password: hashedPassword, // Storing hashed version for profile record
        phone: formData.phone || '',
        role: 'CUSTOMER', // Role is always CUSTOMER during registration
        balance: 100000, // Default balance as requested
        createdAt: serverTimestamp(),
        displayName: `${formData.firstName} ${formData.lastName}`.trim(),
      });

      toast({
        title: "Registration Successful",
        description: "Your secure account has been created. Please log in to continue.",
      });

      // 4. Sign out the user (Firebase auto-logs in after creation)
      // and redirect to login page as requested
      await signOut(auth);
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      let message = "An unexpected error occurred. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please try logging in.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Please enter a valid email address.";
      } else if (error.code === 'permission-denied') {
        message = "You do not have permission to create this profile.";
      }

      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
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
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="hidden lg:block space-y-8">
            <h1 className="text-4xl font-bold font-headline tracking-tight leading-tight">
              Join <span className="text-accent">CodBank</span> today and take control of your wealth.
            </h1>
            <div className="space-y-6">
              {[
                { title: "No Hidden Fees", desc: "We believe in transparency. What you see is what you get." },
                { title: "Enterprise Security", desc: "Bank-grade encryption and real-time monitoring." },
                { title: "Instant Setup", desc: "Open an account in under 3 minutes with digital verification." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-accent/10 p-1 h-fit rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-white/5 bg-card/50 backdrop-blur-xl">
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle className="font-headline">Create Your Account</CardTitle>
                <CardDescription>Start your financial journey with us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Alex" 
                      className="bg-background/50 border-white/10" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Pierce" 
                      className="bg-background/50 border-white/10" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      placeholder="alexpierce" 
                      className="bg-background/50 border-white/10" 
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="+1 (555) 000-0000" 
                      className="bg-background/50 border-white/10" 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    className="bg-background/50 border-white/10" 
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-start gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-background/50 cursor-pointer accent-accent" 
                    required 
                  />
                  <Label htmlFor="terms" className="text-xs text-muted-foreground font-normal leading-tight">
                    I agree to the <Link href="#" className="text-accent hover:underline">Terms of Service</Link> and <Link href="#" className="text-accent hover:underline">Privacy Policy</Link>.
                  </Label>
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Secure Account"
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account? <Link href="/login" className="text-accent hover:underline font-medium">Log in</Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
