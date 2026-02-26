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
  Globe
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
      "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-base",
      active 
        ? "bg-accent/10 text-accent border border-accent/20 shadow-[0_0_20px_rgba(92,214,193,0.1)]" 
        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
    )}
  >
    <div className={cn("transition-colors", active ? "text-accent" : "text-muted-foreground/60")}>
      {icon}
    </div>
    <span>{label}</span>
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
    <div className="flex flex-col h-full glass-card border-r border-white/5 p-8 w-80 hidden lg:flex">
      <div className="flex items-center gap-3 mb-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-accent p-2 rounded-xl group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-background" />
          </div>
          <span className="text-2xl font-bold font-headline tracking-tighter">CodBank</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-3">
        <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" href="/dashboard" active={pathname === '/dashboard'} />
        <NavItem icon={<Wallet className="w-5 h-5" />} label="Digital Wallet" href="/wallet" active={pathname === '/wallet'} />
        <NavItem icon={<TrendingUp className="w-5 h-5" />} label="Smart Investing" href="/investing" active={pathname === '/investing'} />
        <NavItem icon={<Globe className="w-5 h-5" />} label="Global Access" href="/global" active={pathname === '/global'} />
        
        <div className="pt-10 pb-4">
          <p className="px-5 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 font-black">Management</p>
        </div>
        <NavItem icon={<History className="w-5 h-5" />} label="Activity Logs" href="/dashboard" />
        <NavItem icon={<CreditCard className="w-5 h-5" />} label="Card Services" href="/dashboard" />
        <NavItem icon={<User className="w-5 h-5" />} label="Security Profile" href="/dashboard" />
        
        <div className="pt-10 pb-4">
          <p className="px-5 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 font-black">Preferences</p>
        </div>
        <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" href="/dashboard" />
        <NavItem icon={<HelpCircle className="w-5 h-5" />} label="Support" href="/dashboard" />
      </nav>

      <div className="pt-8 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-destructive hover:bg-destructive/10 transition-all font-black text-base"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}