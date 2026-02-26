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
      <header className="px-10 lg:px-16 h-24 flex items-center border-b border-white/[0.03] bg-background/50 backdrop-blur-3xl sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-4">
          <div className="bg-accent p-2.5 rounded-2xl shadow-[0_0_30px_rgba(92,214,193,0.3)]">
            <ShieldCheck className="w-7 h-7 text-background" />
          </div>
          <span className="text-3xl font-black font-headline tracking-tighter">CodBank</span>
        </Link>
        <nav className="ml-auto flex items-center gap-10">
          <Link className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-all" href="#features">Features</Link>
          <Link className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-all" href="#security">Protocol</Link>
          <Link className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-all" href="/login">Sign In</Link>
          <Button asChild className="px-10">
            <Link href="/register">Join Platform</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative py-40 px-10 lg:px-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_50%_0%,rgba(92,214,193,0.15),transparent_60%)]"></div>
          
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black tracking-[0.3em] mb-14 animate-in fade-in slide-in-from-bottom-4 duration-1000 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Securing $12B+ in Institutional Assets
            </div>
            
            <h1 className="text-7xl md:text-9xl font-headline font-black mb-10 tracking-tighter leading-[0.9] max-w-6xl">
              The Architecture of <span className="text-accent italic">Wealth</span>
            </h1>
            
            <p className="text-xl md:text-3xl text-muted-foreground/80 mb-16 max-w-4xl font-body leading-relaxed tracking-tight">
              Institutional-grade security meets an intuitive interface. Take absolute control over your global digital assets with CodBank.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 w-full justify-center max-w-2xl">
              <Button asChild size="lg" className="h-20 px-14 text-xl rounded-[2.5rem]">
                <Link href="/register">Initialize Account <ArrowRight className="ml-3 w-7 h-7" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-20 px-14 text-xl rounded-[2.5rem]">
                <Link href="/dashboard">View Live Node</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-32 px-10 lg:px-20 bg-black/40 border-y border-white/[0.03]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-headline font-black mb-8 tracking-tighter">Engineered for Performance</h2>
              <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">Advanced liquidity management and AI-driven growth tools for the modern high-net-worth individual.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.href}
                  className="p-12 rounded-[3rem] glass-card group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full -mr-24 -mt-24 blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="mb-10 p-6 bg-accent/10 rounded-3xl w-fit group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 shadow-[0_0_30px_rgba(92,214,193,0.1)]">
                    {item.icon}
                  </div>
                  <h3 className="text-3xl font-headline font-black mb-6 flex items-center justify-between tracking-tight">
                    {item.title}
                    <ChevronRight className="w-8 h-8 opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-accent" />
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-xl font-medium">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="py-40 px-10 lg:px-20 relative">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-32">
            <div className="flex-1 space-y-12">
              <div className="inline-block p-5 bg-accent/10 rounded-3xl">
                <Lock className="w-12 h-12 text-accent" />
              </div>
              <h2 className="text-6xl md:text-8xl font-headline font-black tracking-tighter leading-[0.9]">Zero-Trust <br/>Protocol</h2>
              <p className="text-2xl text-muted-foreground/80 leading-relaxed font-medium">
                Hardware-level encryption and real-time biometric verification ensure your assets remain untouchable.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  "Biometric Multi-Factor Auth",
                  "AES-256 Vault Encryption",
                  "AI Fraud Monitoring",
                  "Instant Asset Freeze"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-6 text-xl font-black uppercase tracking-widest text-[10px]">
                    <div className="bg-accent/20 p-2 rounded-full shadow-[0_0_20px_rgba(92,214,193,0.2)]">
                      <ShieldCheck className="w-6 h-6 text-accent" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-accent/10 blur-[150px] rounded-full group-hover:bg-accent/20 transition-all duration-1000"></div>
              <div className="relative p-2 bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/[0.05] overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/codbank-security-ui/1000/800" 
                  alt="Secure Terminal" 
                  className="rounded-[2.5rem] w-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                  data-ai-hint="security terminal"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 px-10 lg:px-20 border-t border-white/[0.03] bg-black/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4">
            <div className="bg-accent p-2 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-background" />
            </div>
            <span className="text-3xl font-black font-headline tracking-tighter">CodBank</span>
          </div>
          <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.5em]">© 2024 CodBank Financial Protocol. All rights reserved.</p>
          <div className="flex gap-12">
            <Link href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-accent transition-all">Privacy</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-accent transition-all">Security</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-accent transition-all">Legal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}