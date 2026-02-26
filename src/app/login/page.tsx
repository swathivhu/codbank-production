import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function LoginPage() {
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

          <Card className="border-white/5 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-headline">Sign In</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="alex@codbank.com" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-accent hover:underline">Forgot password?</Link>
                </div>
                <Input id="password" type="password" className="bg-background/50" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-background font-bold h-11">
                <Link href="/dashboard">Login Securely</Link>
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account? <Link href="/register" className="text-accent hover:underline font-medium">Create one now</Link>
              </p>
            </CardFooter>
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