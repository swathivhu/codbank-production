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
  Plus,
  Wallet,
  Loader2,
  LogOut,
  User,
  Settings,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Copy,
  Zap,
  Bell,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFirebase, useMemoFirebase, useCollection } from '@/firebase';
import { doc, getDoc, collection, serverTimestamp, addDoc } from 'firebase/firestore';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CHART_DATA = [
  { day: 'Mon', value: 92000 },
  { day: 'Tue', value: 95000 },
  { day: 'Wed', value: 94000 },
  { day: 'Thu', value: 98000 },
  { day: 'Fri', value: 102000 },
  { day: 'Sat', value: 105000 },
  { day: 'Sun', value: 108400 },
];

const chartConfig = {
  value: {
    label: "Net Worth",
    color: "hsl(var(--accent))",
  },
};

export default function DashboardPage() {
  const { user, isUserLoading, auth, firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [accountType, setAccountType] = useState<'Savings' | 'Current'>('Savings');
  const [initialDeposit, setInitialDeposit] = useState('1000');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [createdAccountNumber, setCreatedAccountNumber] = useState<string | null>(null);

  const accountsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'codusers', user.uid, 'accounts');
  }, [firestore, user]);

  const { data: accounts, isLoading: isAccountsLoading } = useCollection(accountsQuery);

  useEffect(() => {
    setMounted(true);
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
        } catch (error) {}
      }
    };

    fetchInitialData();
  }, [user, isUserLoading, firestore, router]);

  const handleCheckBalance = async () => {
    if (!user || !firestore) return;
    setIsFetching(true);
    try {
      const docRef = doc(firestore, 'codusers', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const newBalance = snap.data().balance;
        setBalance(newBalance);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5cd6c1', '#ffffff'],
        });
        toast({ title: "Balance Verified", description: `Vault balance refreshed: $${newBalance.toLocaleString()}.` });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Verification Failed", description: "Security service unavailable." });
    } finally {
      setIsFetching(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!user || !firestore) return;
    const deposit = parseFloat(initialDeposit);
    if (isNaN(deposit) || deposit < 1000) {
      toast({ variant: "destructive", title: "Invalid Deposit", description: "Minimum $1,000 required." });
      return;
    }
    if (!isConfirmed) {
      toast({ variant: "destructive", title: "Action Required", description: "Please confirm terms." });
      return;
    }

    setIsCreating(true);
    try {
      const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const accountsRef = collection(firestore, 'codusers', user.uid, 'accounts');
      await addDoc(accountsRef, {
        accountNumber,
        accountType,
        balance: deposit,
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
      });
      setCreatedAccountNumber(accountNumber);
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 }, colors: ['#5cd6c1', '#ffffff'] });
    } catch (error) {
      toast({ variant: "destructive", title: "Creation Failed", description: "Ledger entry failed." });
    } finally {
      setIsCreating(false);
    }
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setTimeout(() => {
      setCreatedAccountNumber(null);
      setAccountType('Savings');
      setInitialDeposit('1000');
      setIsConfirmed(false);
    }, 300);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      toast({ variant: "destructive", title: "Logout Error", description: "Session termination failed." });
    }
  };

  if (isUserLoading || !mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const firstName = profile?.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User';
  const fullName = profile?.displayName || user.email || 'CodBank User';

  return (
    <div className="flex h-screen bg-background text-foreground font-body overflow-hidden animate-page-entry">
      <DashboardNav />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-card/20 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-headline font-bold">Dashboard</h2>
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-accent/5 border-accent/20 text-accent">Active</Badge>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <Input placeholder="Search records..." className="pl-12 w-64 bg-background border-white/5 h-10 rounded-xl focus-visible:ring-accent/20" />
            </div>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent transition-transform active:scale-90">
              <Bell className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-1.5 pr-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all outline-none active:scale-95 group">
                  <div className="h-8 w-8 rounded-lg overflow-hidden border border-white/10 group-hover:border-accent/40 transition-colors">
                    <img src={`https://picsum.photos/seed/${user.uid}/200/200`} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-black leading-none mb-1">{firstName}</p>
                    <p className="text-[10px] text-muted-foreground leading-none">Platinum</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-card/95 backdrop-blur-xl border-white/10 p-2 rounded-2xl shadow-2xl">
                <DropdownMenuLabel className="px-4 py-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black font-headline">{fullName}</p>
                    <p className="text-xs text-muted-foreground font-medium">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="py-2.5 px-4 focus:bg-accent/10 focus:text-accent cursor-pointer rounded-xl font-bold text-sm">
                  <User className="w-4 h-4 mr-3" /> Profile Identity
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 px-4 focus:bg-accent/10 focus:text-accent cursor-pointer rounded-xl font-bold text-sm">
                  <Settings className="w-4 h-4 mr-3" /> System Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={handleLogout} className="py-2.5 px-4 focus:bg-destructive/10 text-destructive cursor-pointer rounded-xl font-bold text-sm">
                  <LogOut className="w-4 h-4 mr-3" /> Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card rounded-[1.5rem]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-headline font-black mb-1">
                  {balance !== null ? `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-accent">+2.4% from last week</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-accent/10 text-accent transition-transform hover:rotate-12" onClick={handleCheckBalance}>
                    <Zap className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-[1.5rem]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Accounts</CardTitle>
                <Activity className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-headline font-black mb-1">{accounts?.length || 0}</div>
                <Dialog open={isCreateDialogOpen} onOpenChange={(open) => !open ? closeCreateDialog() : setIsCreateDialogOpen(true)}>
                  <DialogTrigger asChild>
                    <button className="text-xs font-bold text-accent hover:underline flex items-center gap-1 transition-all hover:gap-2">
                      <Plus className="w-3 h-3" /> Open new vault
                    </button>
                  </DialogTrigger>
                  <DialogContent className="glass-card sm:max-w-[450px] rounded-[2rem]">
                    {!createdAccountNumber ? (
                      <>
                        <DialogHeader className="space-y-4">
                          <DialogTitle className="font-headline text-3xl font-black tracking-tight">Open Vault</DialogTitle>
                          <DialogDescription className="text-muted-foreground text-base">Initialize a new secure account on the CodBank protocol.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-8 py-6">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Tier</Label>
                            <Select value={accountType} onValueChange={(v: any) => setAccountType(v)}>
                              <SelectTrigger className="bg-background/50 border-white/10 h-14 rounded-2xl font-bold focus:ring-accent/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="glass-card rounded-2xl">
                                <SelectItem value="Savings">Savings Vault (3.5% APY)</SelectItem>
                                <SelectItem value="Current">Current Operating Account</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Initial Funding ($)</Label>
                            <div className="relative">
                               <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black">$</span>
                               <Input type="number" min="1000" value={initialDeposit} onChange={(e) => setInitialDeposit(e.target.value)} className="bg-background/50 border-white/10 h-14 pl-10 rounded-2xl font-black text-xl" />
                            </div>
                          </div>
                          <div className="flex items-start space-x-4 p-5 bg-accent/5 rounded-2xl border border-accent/10">
                            <Checkbox id="confirm" checked={isConfirmed} onCheckedChange={(v: any) => setIsConfirmed(v)} className="mt-1 border-accent/40 rounded-md" />
                            <Label htmlFor="confirm" className="text-xs text-muted-foreground leading-relaxed font-medium">I authorize the creation of this secure instance and agree to the ledger terms.</Label>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleCreateAccount} disabled={isCreating} className="w-full bg-accent hover:bg-accent/90 text-background font-black h-16 rounded-2xl text-lg shadow-2xl transition-all">
                            {isCreating ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <ShieldCheck className="w-6 h-6 mr-2" />}
                            Finalize & Deploy
                          </Button>
                        </DialogFooter>
                      </>
                    ) : (
                      <div className="py-12 flex flex-col items-center text-center space-y-8 animate-page-entry">
                        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 shadow-[0_0_50px_rgba(92,214,193,0.2)]">
                          <CheckCircle2 className="w-12 h-12 text-accent" />
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-4xl font-black font-headline tracking-tighter">Vault Deployed!</h2>
                          <p className="text-muted-foreground font-medium">Instance successfully written to the ledger.</p>
                        </div>
                        <div className="w-full bg-black/40 border border-white/5 rounded-3xl p-8 space-y-3 relative overflow-hidden">
                          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 font-black">Account Identifier</p>
                          <div className="flex items-center justify-center gap-6">
                            <span className="text-4xl font-mono font-black tracking-widest text-accent">{createdAccountNumber}</span>
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-accent/10 hover:text-accent transition-transform active:scale-90" onClick={() => { navigator.clipboard.writeText(createdAccountNumber!); toast({ title: "Copied", description: "Account ID saved." }); }}>
                              <Copy className="w-6 h-6" />
                            </Button>
                          </div>
                        </div>
                        <Button onClick={closeCreateDialog} className="w-full bg-accent hover:bg-accent/90 text-background font-black h-16 rounded-2xl text-lg">Back to Dashboard</Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card className="glass-card rounded-[1.5rem]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Portfolio Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-headline font-black mb-1">$128,400.20</div>
                <div className="text-xs font-bold text-accent flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +12.5% this month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Chart Row */}
          <Card className="glass-card rounded-[2rem] p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-headline font-black">Wealth Growth</h3>
                <p className="text-xs text-muted-foreground font-medium">Real-time consolidated asset performance</p>
              </div>
              <div className="flex items-center gap-2">
                {['D', 'W', 'M', 'Y', 'ALL'].map((p) => (
                  <Button key={p} variant="ghost" size="sm" className={cn("text-[10px] font-black h-8 w-10 p-0 rounded-lg transition-all active:scale-90", p === 'W' ? "bg-accent/10 text-accent" : "text-muted-foreground")}>
                    {p}
                  </Button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig}>
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorValueDashboard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '700'}}
                    dy={10}
                  />
                  <YAxis hide domain={['dataMin - 5000', 'dataMax + 5000']} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorValueDashboard)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </Card>

          {/* Activity Table Row */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-black">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10 rounded-full font-black text-xs px-4 transition-all active:scale-95">
                View Ledger
              </Button>
            </div>
            <Card className="glass-card rounded-[1.5rem] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-black">
                      <th className="px-8 py-5">Transaction</th>
                      <th className="px-8 py-5">Classification</th>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MOCK_TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110", tx.type === 'credit' ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive")}>
                              {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <p className="font-black text-sm tracking-tight">{tx.description}</p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <Badge variant="outline" className="text-[9px] border-white/5 bg-white/5 h-5 px-2.5 font-black uppercase tracking-widest text-muted-foreground">{tx.category}</Badge>
                        </td>
                        <td className="px-8 py-5 text-xs text-muted-foreground font-bold">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className={cn("px-8 py-5 text-right font-black text-sm tracking-tight", tx.type === 'credit' ? "text-accent" : "text-foreground")}>
                          {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}