'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  History, 
  CreditCard, 
  User, 
  ShieldCheck,
  Settings,
  LogOut,
  Wallet,
  TrendingUp,
  Globe,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
};

const NavItem = ({ icon, label, href, active }: NavItemProps) => (
  <Link 
    href={href} 
    className={cn(
      "group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 font-black text-[10px] uppercase tracking-widest relative overflow-hidden",
      active 
        ? "bg-accent/10 text-accent border border-accent/20 shadow-[0_0_30px_rgba(92,214,193,0.05)]" 
        : "text-muted-foreground/60 hover:bg-white/5 hover:text-foreground active:scale-95"
    )}
  >
    <div className={cn("transition-all duration-500", active ? "text-accent" : "group-hover:scale-110 group-hover:text-accent")}>
      {icon}
    </div>
    <span>{label}</span>
    {active && (
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-full" />
    )}
  </Link>
);

export function DashboardNav() {
  const { auth } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Session Terminated",
        description: "Your secure session has been finalized and cleared.",
      });
      router.push('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Security Alert",
        description: "Failed to finalize session properly.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-3xl border-r border-white/[0.03] p-8 w-80 hidden lg:flex">
      <div className="flex items-center gap-4 mb-14 px-2">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="bg-accent p-2.5 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[0_0_40px_rgba(92,214,193,0.35)]">
            <ShieldCheck className="w-6 h-6 text-background" />
          </div>
          <span className="text-2xl font-black font-headline tracking-tighter">CodBank</span>
        </Link>
      </div>

      <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div>
          <p className="px-5 text-[9px] uppercase tracking-[0.5em] text-muted-foreground/30 font-black mb-6">Master Ledger</p>
          <nav className="space-y-2">
            <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="System Overview" href="/dashboard" active={pathname === '/dashboard'} />
            <NavItem icon={<Wallet className="w-5 h-5" />} label="Digital Wallet" href="/wallet" active={pathname === '/wallet'} />
            <NavItem icon={<TrendingUp className="w-5 h-5" />} label="Smart Investing" href="/investing" active={pathname === '/investing'} />
            <NavItem icon={<Globe className="w-5 h-5" />} label="Global Access" href="/global" active={pathname === '/global'} />
          </nav>
        </div>
        
        <div>
          <p className="px-5 text-[9px] uppercase tracking-[0.5em] text-muted-foreground/30 font-black mb-6">Management</p>
          <nav className="space-y-2">
            <NavItem icon={<CreditCard className="w-5 h-5" />} label="Card Services" href="/dashboard" />
            <NavItem icon={<BarChart3 className="w-5 h-5" />} label="Market Intelligence" href="/investing" />
            <NavItem icon={<History className="w-5 h-5" />} label="Security Logs" href="/dashboard" />
          </nav>
        </div>

        <div>
          <p className="px-5 text-[9px] uppercase tracking-[0.5em] text-muted-foreground/30 font-black mb-6">Operator</p>
          <nav className="space-y-2">
            <NavItem icon={<User className="w-5 h-5" />} label="Account Profile" href="/dashboard" />
            <NavItem icon={<Settings className="w-5 h-5" />} label="System Config" href="/dashboard" />
          </nav>
        </div>
      </div>

      <div className="pt-8 border-t border-white/[0.03]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl text-destructive hover:bg-destructive/10 transition-all font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span>Finalize Session</span>
        </button>
      </div>
    </div>
  );
}