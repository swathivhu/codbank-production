'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import { MOCK_TRANSACTIONS } from '@/lib/mock-data';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Search, 
  Bell,
  Plus,
  Filter,
  Wallet,
  Loader2,
  RefreshCw,
  Trophy,
  LogOut,
  User,
  Settings,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const { user, isUserLoading, auth, firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Initial fetch of profile
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchInitialData = async () => {
      if (user && firestore) {
        try {
          const docRef = doc(firestore, 'codusers', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setProfile(snap.data());
            setBalance(snap.data().balance);
          }
        } catch (error) {
          // Error handled by Firebase Error Listener
        }
      }
    };

    fetchInitialData();
  }, [user, isUserLoading, firestore, router]);

  const handleCheckBalance = async () => {
    if (!user || !firestore) return;
    
    setIsFetching(true);
    try {
      // Simulate API call delay for "modern" feel
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const docRef = doc(firestore, 'codusers', user.uid);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        const newBalance = snap.data().balance;
        setBalance(newBalance);
        
        // Celebration!
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5cd6c1', '#1a3a4a', '#ffffff'],
          ticks: 200,
          zIndex: 1000
        });

        toast({
          title: "Balance Updated",
          description: `Your current balance is $${newBalance.toLocaleString()}.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch balance. Please try again.",
      });
    } finally {
      setIsFetching(false);
    }
  };

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
        description: "There was a problem signing you out.",
      });
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const firstName = profile?.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User';
  const fullName = profile?.displayName || user.email || 'CodBank User';

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      <DashboardNav />
      
      <main className="flex-1 overflow-auto p-6 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-headline mb-1">Welcome back, {firstName}</h1>
            <p className="text-muted-foreground">Your financial overview is looking solid today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-10 w-64 bg-card border-white/5" />
            </div>
            <Button variant="outline" size="icon" className="bg-card border-white/5 text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full overflow-hidden border border-accent/20 hover:border-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20">
                  <img src={`https://picsum.photos/seed/${user.uid}/100/100`} alt="Avatar" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-white/5 shadow-2xl">
                <DropdownMenuLabel className="font-headline font-bold px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none">{fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground font-normal">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="py-2 focus:bg-accent/10 focus:text-accent cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 focus:bg-accent/10 focus:text-accent cursor-pointer">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>My Accounts</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 focus:bg-accent/10 focus:text-accent cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="py-2 focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Account Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="bg-card border-white/5 hover:border-accent/10 transition-all overflow-hidden relative col-span-1 md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary" className="bg-primary/20 text-accent border-none">Main Account</Badge>
                <Wallet className="w-4 h-4 text-accent" />
              </div>
              <CardTitle className="text-4xl font-headline font-bold flex items-baseline gap-2">
                {balance !== null ? (
                  `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                ) : (
                  <span className="text-muted-foreground/30">••••••</span>
                )}
              </CardTitle>
              <CardDescription className="font-mono text-xs tracking-widest uppercase">
                Active Balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={handleCheckBalance} 
                  disabled={isFetching}
                  className="flex-1 bg-accent hover:bg-accent/90 text-background font-bold shadow-[0_0_15px_rgba(92,214,193,0.3)]"
                >
                  {isFetching ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Trophy className="w-4 h-4 mr-2" />
                  )}
                  Check Balance
                </Button>
                <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                  Transfer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-headline">Monthly Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">$3,240.00</div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  <span>Limit: $5,000.00</span>
                  <span className="text-accent">65%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[65%] rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-white/5 hover:border-accent/20 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-accent" />
            </div>
            <span className="font-headline font-semibold">Open New Account</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Transactions List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-headline">Recent Transactions</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">View All</Button>
              </div>
            </div>
            <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-muted-foreground text-xs uppercase tracking-widest font-bold">
                      <th className="px-6 py-4">Transaction</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MOCK_TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              tx.type === 'credit' ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                            )}>
                              {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-medium">{tx.description}</p>
                              <p className="text-xs text-muted-foreground">ID: {tx.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-[10px] bg-white/5 border-white/5">{tx.category}</Badge>
                        </td>
                        <td className={cn(
                          "px-6 py-4 text-right font-bold",
                          tx.type === 'credit' ? "text-accent" : "text-foreground"
                        )}>
                          {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Insights */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-headline">Insights</h2>
            <div className="bg-card border border-white/5 p-6 rounded-2xl">
              <h3 className="font-headline font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Savings Progress
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                You've saved <span className="text-accent font-bold">$450.00</span> more this month compared to February. You're in the top 5% of savers!
              </p>
              <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-tighter">Projected Balance (Dec)</p>
                <p className="text-2xl font-bold font-headline">$62,400.00</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
