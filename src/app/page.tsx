import Link from 'next/link';
import { ShieldCheck, ArrowRight, Wallet, Lock, TrendingUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const features = [
    { 
      icon: <Wallet className="w-8 h-8 text-accent" />, 
      title: "Digital Wallet", 
      desc: "Instant payments and seamless transfers with zero hidden fees.",
      href: "/register"
    },
    { 
      icon: <TrendingUp className="w-8 h-8 text-accent" />, 
      title: "Smart Investing", 
      desc: "Automated portfolios built by industry leading AI and financial experts.",
      href: "/register"
    },
    { 
      icon: <Globe className="w-8 h-8 text-accent" />, 
      title: "Global Access", 
      desc: "Spend and withdraw in any currency with real-time mid-market rates.",
      href: "/register"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-12 h-20 flex items-center border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-accent" />
          </div>
          <span className="text-xl font-bold font-headline tracking-tight">CodBank</span>
        </Link>
        <nav className="ml-auto flex gap-6 sm:gap-10">
          <Link className="text-sm font-medium hover:text-accent transition-colors" href="#features">Features</Link>
          <Link className="text-sm font-medium hover:text-accent transition-colors" href="#security">Security</Link>
          <Link className="text-sm font-medium hover:text-accent transition-colors" href="/login">Login</Link>
          <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-background font-semibold">
            <Link href="/register">Open Account</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="py-24 px-6 lg:px-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Now serving over 2M+ customers globally
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 tracking-tight max-w-4xl">
              The Digital Era of <span className="text-accent">Secure Banking</span> is Here
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl font-body leading-relaxed">
              CodBank combines enterprise-grade security with a modern interface to give you total control over your financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-background font-bold text-lg h-14">
                <Link href="/register">Get Started <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/50 text-primary-foreground hover:bg-primary/10 h-14 cursor-pointer">
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-6 lg:px-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Smarter Financial Tools</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to manage, save, and grow your wealth in one place.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.href}
                  className="p-8 rounded-2xl bg-card border border-white/5 hover:border-accent/20 transition-all group cursor-pointer hover:shadow-2xl hover:shadow-accent/5"
                >
                  <div className="mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="text-xl font-headline font-bold mb-3 flex items-center gap-2">
                    {item.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="py-24 px-6 lg:px-12 bg-primary/5 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <Lock className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">Security is Not an Afterthought</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We use bank-grade 256-bit AES encryption, biometric authentication, and multi-factor authorization to ensure your funds and data are always protected.
              </p>
              <ul className="space-y-4">
                {[
                  "Biometric Login (FaceID & TouchID)",
                  "Instant Fraud Protection Alerts",
                  "Secure Multi-Signer Approvals",
                  "24/7 Priority Security Support"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-primary-foreground font-medium">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] -z-10 rounded-full"></div>
              <div className="bg-card border border-white/10 p-4 rounded-3xl shadow-2xl overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/codbank-security-ui/800/600" 
                  alt="Secure Dashboard Interface" 
                  className="rounded-2xl"
                  data-ai-hint="security dashboard"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-12 px-6 lg:px-12 border-t border-white/5 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-accent" />
            <span className="text-lg font-bold font-headline tracking-tight">CodBank</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2024 CodBank Financial Services. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-accent">Terms</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-accent">Privacy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-accent">Compliance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
