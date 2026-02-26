'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  History, 
  CreditCard, 
  User, 
  ShieldCheck,
  Settings,
  HelpCircle,
  LogOut
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
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
      active 
        ? "bg-accent/10 text-accent border border-accent/20" 
        : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export function DashboardNav() {
  const { auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "Your secure session has been terminated.",
      });
      router.push('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "There was a problem signing you out. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-white/5 p-6 w-72 hidden lg:flex">
      <div className="flex items-center gap-2 mb-10">
        <div className="bg-primary p-1.5 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-accent" />
        </div>
        <span className="text-xl font-bold font-headline tracking-tight">CodBank</span>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" href="/dashboard" active />
        <NavItem icon={<ArrowUpRight className="w-5 h-5" />} label="Transfers" href="/dashboard" />
        <NavItem icon={<History className="w-5 h-5" />} label="History" href="/dashboard" />
        <NavItem icon={<CreditCard className="w-5 h-5" />} label="Accounts" href="/dashboard" />
        <NavItem icon={<User className="w-5 h-5" />} label="Profile" href="/dashboard" />
        <div className="pt-6 pb-2">
          <p className="px-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Preferences</p>
        </div>
        <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" href="/dashboard" />
        <NavItem icon={<HelpCircle className="w-5 h-5" />} label="Support" href="/dashboard" />
      </nav>

      <div className="pt-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
