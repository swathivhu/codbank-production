import Link from 'next/link';
import { ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function RegisterPage() {
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
            <CardHeader>
              <CardTitle className="font-headline">Create Your Account</CardTitle>
              <CardDescription>Start your financial journey with us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Alex" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Pierce" className="bg-background/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="alex@codbank.com" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" className="bg-background/50" />
              </div>
              <div className="flex items-start gap-2 pt-2">
                <div className="mt-1 h-4 w-4 rounded border border-white/20 bg-background/50"></div>
                <p className="text-xs text-muted-foreground">
                  I agree to the <Link href="#" className="text-accent hover:underline">Terms of Service</Link> and <Link href="#" className="text-accent hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-background font-bold h-11">
                <Link href="/dashboard">Create Secure Account</Link>
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account? <Link href="/login" className="text-accent hover:underline font-medium">Log in</Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}