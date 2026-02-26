'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  History, 
  CreditCard, 
  User, 
  ShieldCheck,
  Settings,
  HelpCircle,
  LogOut,
  Wallet,
  TrendingUp,
  Globe,
  PieChart,
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
      "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm relative overflow-hidden",
      active 
        ? "bg-accent/10 text-accent border border-accent/20 shadow-[0_0_20px_rgba(92,214,193,0.05)]" 
        : "text-muted-foreground hover:bg-white/5 hover:text-foreground active:scale-95"
    )}
  >
    <div className={cn("transition-all duration-300", active ? "text-accent" : "text-muted-foreground/60 group-hover:scale-110 group-hover:text-accent")}>
      {icon}
    </div>
    <span>{label}</span>
    {!active && (
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent/40 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
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
        description: "You have been securely logged out.",
      });
      router.push('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Security Alert",
        description: "Failed to terminate session properly.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-3xl border-r border-white/5 p-6 w-72 hidden lg:flex">
      <div className="flex items-center gap-3 mb-10 px-2">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-accent p-2 rounded-xl group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(92,214,193,0.3)] group-hover:shadow-[0_0_30px_rgba(92,214,193,0.5)]">
            <ShieldCheck className="w-5 h-5 text-background" />
          </div>
          <span className="text-xl font-black font-headline tracking-tighter">CodBank</span>
        </Link>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        <div>
          <p className="px-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/40 font-black mb-4">Core</p>
          <nav className="space-y-1.5">
            <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" href="/dashboard" active={pathname === '/dashboard'} />
            <NavItem icon={<Wallet className="w-4 h-4" />} label="Digital Wallet" href="/wallet" active={pathname === '/wallet'} />
            <NavItem icon={<TrendingUp className="w-4 h-4" />} label="Smart Investing" href="/investing" active={pathname === '/investing'} />
            <NavItem icon={<Globe className="w-4 h-4" />} label="Global Access" href="/global" active={pathname === '/global'} />
          </nav>
        </div>
        
        <div>
          <p className="px-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/40 font-black mb-4">Management</p>
          <nav className="space-y-1.5">
            <NavItem icon={<CreditCard className="w-4 h-4" />} label="Card Services" href="/dashboard" />
            <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Market Trends" href="/investing" />
            <NavItem icon={<History className="w-4 h-4" />} label="Security Logs" href="/dashboard" />
          </nav>
        </div>

        <div>
          <p className="px-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/40 font-black mb-4">Personal</p>
          <nav className="space-y-1.5">
            <NavItem icon={<User className="w-4 h-4" />} label="Profile" href="/dashboard" />
            <NavItem icon={<Settings className="w-4 h-4" />} label="Preferences" href="/dashboard" />
          </nav>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all font-black text-sm active:scale-95"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          <span>Terminate Session</span>
        </button>
      </div>
    </div>
  );
}