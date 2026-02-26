import Link from 'next/link';
import { ShieldCheck, ArrowRight, Wallet, Lock, TrendingUp, Globe, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const features = [
    { 
      icon: <Wallet className="w-10 h-10 text-accent" />, 
      title: "Digital Wallet", 
      desc: "Instant payments and seamless transfers with zero hidden fees.",
      href: "/wallet"
    },
    { 
      icon: <TrendingUp className="w-10 h-10 text-accent" />, 
      title: "Smart Investing", 
      desc: "Automated portfolios built by industry leading AI and financial experts.",
      href: "/investing"
    },
    { 
      icon: <Globe className="w-10 h-10 text-accent" />, 
      title: "Global Access", 
      desc: "Spend and withdraw in any currency with real-time mid-market rates.",
      href: "/global"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-12 h-24 flex items-center border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-accent p-2 rounded-xl">
            <ShieldCheck className="w-7 h-7 text-background" />
          </div>
          <span className="text-2xl font-bold font-headline tracking-tight">CodBank</span>
        </Link>
        <nav className="ml-auto flex items-center gap-8">
          <Link className="text-sm font-semibold text-muted-foreground hover:text-accent transition-all" href="#features">Features</Link>
          <Link className="text-sm font-semibold text-muted-foreground hover:text-accent transition-all" href="#security">Security</Link>
          <Link className="text-sm font-semibold text-muted-foreground hover:text-accent transition-all" href="/login">Login</Link>
          <Button asChild variant="default" className="px-6">
            <Link href="/register">Join Now</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative py-32 px-6 lg:px-12 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_50%_0%,rgba(92,214,193,0.1),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              TRUSTED BY 2M+ USERS GLOBALLY
            </div>
            
            <h1 className="text-6xl md:text-8xl font-headline font-bold mb-8 tracking-tighter leading-[1] max-w-5xl">
              Future of <span className="text-accent italic">Secure</span> Digital Banking
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl font-body leading-relaxed">
              CodBank integrates institutional-grade security with an intuitive interface, giving you absolute control over your global assets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center max-w-xl">
              <Button asChild size="lg" variant="default" className="text-xl h-16 px-10">
                <Link href="/register">Get Started Now <ArrowRight className="ml-2 w-6 h-6" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-16 px-10 text-lg">
                <Link href="/dashboard">View Live Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-6 lg:px-12 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">Built for Modern Wealth</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Comprehensive tools designed to help you manage, scale, and secure your financial portfolio.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {features.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.href}
                  className="p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg hover:scale-105 hover:shadow-[0_20px_50px_rgba(92,214,193,0.2)] transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="mb-8 p-5 bg-accent/10 rounded-2xl w-fit group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-4 flex items-center justify-between">
                    {item.title}
                    <ChevronRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="py-32 px-6 lg:px-12 relative">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 space-y-10">
              <div className="inline-block p-4 bg-accent/10 rounded-3xl">
                <Lock className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-5xl md:text-6xl font-headline font-bold tracking-tight">Zero-Trust Architecture</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We leverage hardware-level encryption and real-time biometric verification to ensure your identity and assets remain untouchable.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Biometric Multi-Factor Auth",
                  "256-bit AES Vault Encryption",
                  "AI-Powered Fraud Detection",
                  "Instant Asset Freeze Capability"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg font-bold">
                    <div className="bg-accent/20 p-1.5 rounded-full">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-accent/10 blur-[120px] rounded-full group-hover:bg-accent/20 transition-all duration-700"></div>
              <div className="relative p-2 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/codbank-security-ui/1000/800" 
                  alt="Secure Dashboard" 
                  className="rounded-[2rem] w-full object-cover"
                  data-ai-hint="security dashboard"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 lg:px-12 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-background" />
            </div>
            <span className="text-2xl font-bold font-headline tracking-tight">CodBank</span>
          </div>
          <p className="text-muted-foreground font-medium text-sm">© 2024 CodBank Financial. All rights reserved.</p>
          <div className="flex gap-10">
            <Link href="#" className="text-sm font-bold text-muted-foreground hover:text-accent transition-colors">Privacy</Link>
            <Link href="#" className="text-sm font-bold text-muted-foreground hover:text-accent transition-colors">Security</Link>
            <Link href="#" className="text-sm font-bold text-muted-foreground hover:text-accent transition-colors">Legal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
