
'use client';

import { useState, useEffect, useCallback } from 'react';
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
  ShieldCheck,
  Copy,
  Zap,
  Bell,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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

  const { data: accounts } = useCollection(accountsQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isUserLoading && !user && mounted) {
      router.push('/login');
    }

    const fetchInitialData = async () => {
      if (user && firestore) {
        try {
          const docRef = doc(firestore, 'codusers', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            setProfile(data);
            setBalance(data.balance ?? 0);
          }
        } catch (error) {
          console.error("Dashboard init error:", error);
        }
      }
    };

    if (user && firestore && mounted) {
      fetchInitialData();
    }
  }, [user, isUserLoading, firestore, router, mounted]);

  const handleCheckBalance = async () => {
    if (!user) return;
    setIsFetching(true);
    try {
      const response = await fetch('/api/dashboard/balance');
      const data = await response.json();
      
      if (response.ok && data.balance !== undefined) {
        setBalance(data.balance);
        confetti({
          particleCount: 200,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#5cd6c1', '#ffffff', '#10b981'],
        });
        toast({ title: "Vault Synced", description: `Available liquidity: $${data.balance.toLocaleString()}.` });
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sync Failed", description: error.message || "Security service heartbeat lost." });
    } finally {
      setIsFetching(false);
    }
  };

  const resetDialog = useCallback(() => {
    setCreatedAccountNumber(null);
    setAccountType('Savings');
    setInitialDeposit('1000');
    setIsConfirmed(false);
    setIsCreating(false);
  }, []);

  const handleCreateAccount = async () => {
    if (!user || !firestore) return;
    const deposit = parseFloat(initialDeposit);
    if (isNaN(deposit) || deposit < 1000) {
      toast({ variant: "destructive", title: "Invalid Deposit", description: "Minimum $1,000 required for ledger initialization." });
      return;
    }
    if (!isConfirmed) {
      toast({ variant: "destructive", title: "Action Required", description: "Please acknowledge technical terms." });
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
      confetti({ particleCount: 250, spread: 100, origin: { y: 0.5 }, colors: ['#5cd6c1', '#ffffff'] });
    } catch (error) {
      toast({ variant: "destructive", title: "Execution Failed", description: "Blockchain write operation rejected." });
    } finally {
      setIsCreating(false);
    }
  };

  const onDialogChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setTimeout(resetDialog, 300);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'POST', body: JSON.stringify({ action: 'logout' }) });
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      toast({ variant: "destructive", title: "Logout Error", description: "Session termination failed." });
    }
  };

  if (isUserLoading || !mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const firstName = profile?.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Operator';
  const fullName = profile?.displayName || user.email || 'CodBank User';

  return (
    <div className="flex h-screen bg-background text-foreground font-body overflow-hidden animate-page-entry">
      <DashboardNav />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 border-b border-white/[0.03] flex items-center justify-between px-10 bg-card/10 backdrop-blur-3xl z-20">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-headline font-black tracking-tight">System Overview</h2>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-accent">Node Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden xl:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <Input placeholder="Search global ledger..." className="pl-12 w-80 bg-white/5 border-white/5 h-12 rounded-2xl focus-visible:ring-accent/20 transition-all focus-visible:w-96" />
            </div>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent transition-all active:scale-90">
              <Bell className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-4 p-2 pr-5 rounded-2xl border border-white/5 hover:bg-white/5 transition-all outline-none active:scale-95 group">
                  <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10 group-hover:border-accent/40 transition-colors">
                    <img src={`https://picsum.photos/seed/${user.uid}/200/200`} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-black uppercase tracking-tight leading-none mb-1">{firstName}</p>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Platinum Tier</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 bg-card/90 backdrop-blur-2xl border border-white/10 p-3 rounded-3xl shadow-2xl">
                <DropdownMenuLabel className="px-5 py-5">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black font-headline tracking-tight">{fullName}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5 mx-2" />
                <div className="p-1 space-y-1">
                  <DropdownMenuItem className="py-3 px-5 focus:bg-accent/10 focus:text-accent cursor-pointer rounded-2xl font-black text-xs uppercase tracking-widest">
                    <User className="w-4 h-4 mr-3" /> Identity Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-3 px-5 focus:bg-accent/10 focus:text-accent cursor-pointer rounded-2xl font-black text-xs uppercase tracking-widest">
                    <Settings className="w-4 h-4 mr-3" /> Security Settings
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-white/5 mx-2" />
                <div className="p-1">
                  <DropdownMenuItem onClick={handleLogout} className="py-3 px-5 focus:bg-destructive/10 text-destructive cursor-pointer rounded-2xl font-black text-xs uppercase tracking-widest">
                    <LogOut className="w-4 h-4 mr-3" /> Terminate Session
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card rounded-[2rem] relative overflow-hidden group">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Total Liquidity</p>
                  <Wallet className="h-5 w-5 text-accent" />
                </div>
                <div className="text-4xl font-headline font-black mb-3 tracking-tighter">
                  {balance !== null ? `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-accent/10 text-accent border-none font-black text-[9px] uppercase">+2.4% Vol</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-accent/10 text-accent transition-transform hover:rotate-45" onClick={handleCheckBalance} disabled={isFetching}>
                    {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="glass-card rounded-[2rem] group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Active Instances</p>
                  <Activity className="h-5 w-5 text-accent" />
                </div>
                <div className="text-4xl font-headline font-black mb-3 tracking-tighter">{accounts?.length || 0}</div>
                <Dialog open={isCreateDialogOpen} onOpenChange={onDialogChange}>
                  <DialogTrigger asChild>
                    <button className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline flex items-center gap-2 transition-all hover:gap-3">
                      <Plus className="w-3.5 h-3.5" /> Initialize New Vault
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-card/95 backdrop-blur-3xl sm:max-w-[480px] rounded-[2.5rem] border-white/10 p-8 shadow-2xl">
                    {!createdAccountNumber ? (
                      <>
                        <DialogHeader className="space-y-4">
                          <DialogTitle className="font-headline text-4xl font-black tracking-tight">Deploy Vault</DialogTitle>
                          <DialogDescription className="text-muted-foreground text-sm font-medium leading-relaxed">Initialize a new secure cryptographic account on the CodBank enterprise ledger.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-8 py-8">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Account Class</Label>
                            <Select value={accountType} onValueChange={(v: any) => setAccountType(v)}>
                              <SelectTrigger className="bg-white/5 border-white/5 h-16 rounded-2xl font-black text-xs uppercase tracking-widest focus:ring-accent/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card/95 backdrop-blur-2xl rounded-2xl p-2 border-white/10 shadow-2xl z-[100]">
                                <SelectItem value="Savings" className="rounded-xl py-3 px-4 focus:bg-accent/10 focus:text-accent font-black text-xs uppercase tracking-widest">Savings Vault (3.5% APY)</SelectItem>
                                <SelectItem value="Current" className="rounded-xl py-3 px-4 focus:bg-accent/10 focus:text-accent font-black text-xs uppercase tracking-widest">Operating Account</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Initial Deposit ($)</Label>
                            <div className="relative">
                               <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black">$</span>
                               <Input type="number" min="1000" value={initialDeposit} onChange={(e) => setInitialDeposit(e.target.value)} className="bg-white/5 border-white/5 h-16 pl-12 rounded-2xl font-black text-2xl tracking-tight focus-visible:ring-accent/20" />
                            </div>
                          </div>
                          <div className="flex items-start space-x-4 p-6 bg-accent/5 rounded-2xl border border-accent/10">
                            <Checkbox id="confirm" checked={isConfirmed} onCheckedChange={(v: any) => setIsConfirmed(v)} className="mt-1 border-accent/40 rounded-md" />
                            <Label htmlFor="confirm" className="text-[10px] text-muted-foreground leading-relaxed font-bold uppercase tracking-widest">I authorize the deployment of this instance and acknowledge all transaction fee protocols.</Label>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleCreateAccount} disabled={isCreating} className="w-full h-18 text-lg rounded-3xl shadow-2xl">
                            {isCreating ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <ShieldCheck className="w-6 h-6 mr-3" />}
                            Deploy & Verify
                          </Button>
                        </DialogFooter>
                      </>
                    ) : (
                      <div className="py-10 flex flex-col items-center text-center space-y-8 animate-page-entry">
                        <div className="w-28 h-28 rounded-[2.5rem] bg-accent/10 flex items-center justify-center border border-accent/20 shadow-[0_0_60px_rgba(92,214,193,0.15)]">
                          <Activity className="w-14 h-14 text-accent" />
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-4xl font-black font-headline tracking-tighter">Vault Initialized</h2>
                          <p className="text-muted-foreground font-medium text-sm">Deployment successful. Instance recorded on global ledger.</p>
                        </div>
                        <div className="w-full bg-black/60 border border-white/5 rounded-3xl p-10 space-y-4 relative overflow-hidden">
                          <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60 font-black">Ledger Identifier</p>
                          <div className="flex items-center justify-center gap-6">
                            <span className="text-4xl font-mono font-black tracking-widest text-accent">{createdAccountNumber}</span>
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-accent/10 hover:text-accent transition-transform active:scale-90" onClick={() => { navigator.clipboard.writeText(createdAccountNumber!); toast({ title: "Copied", description: "Ledger ID saved to clipboard." }); }}>
                              <Copy className="w-6 h-6" />
                            </Button>
                          </div>
                        </div>
                        <Button onClick={() => onDialogChange(false)} className="w-full h-18 text-lg rounded-3xl">Return to System</Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            <Card className="glass-card rounded-[2rem]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Portfolio Performance</p>
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div className="text-4xl font-headline font-black mb-3 tracking-tighter">$128,400.20</div>
                <div className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +12.5% Month-over-Month
                </div>
              </div>
            </Card>
          </div>

          <Card className="glass-card rounded-[2.5rem] p-10 border-white/[0.03]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div className="space-y-2">
                <h3 className="text-3xl font-headline font-black tracking-tight">Growth Analytics</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">Real-time consolidated asset performance</p>
              </div>
              <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                {['D', 'W', 'M', 'Y', 'ALL'].map((p) => (
                  <Button key={p} variant="ghost" size="sm" className={cn("text-[10px] font-black h-10 w-12 p-0 rounded-xl transition-all active:scale-90", p === 'W' ? "bg-accent/10 text-accent border border-accent/20" : "text-muted-foreground hover:bg-white/5")}>
                    {p}
                  </Button>
                ))}
              </div>
            </div>
            <div className="h-[350px] w-full">
              {mounted && (
                <ChartContainer config={chartConfig}>
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorValueDashboard" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em'}}
                      dy={20}
                    />
                    <YAxis hide domain={['dataMin - 5000', 'dataMax + 5000']} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={5}
                      fillOpacity={1} 
                      fill="url(#colorValueDashboard)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-headline font-black tracking-tight">Recent Activity Ledger</h3>
              <Button variant="ghost" className="text-accent hover:bg-accent/10 rounded-full font-black text-[10px] uppercase tracking-widest px-6 transition-all active:scale-95">
                Export Data
              </Button>
            </div>
            <Card className="glass-card rounded-[2.5rem] overflow-hidden border-white/[0.03]">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.03] text-muted-foreground text-[10px] uppercase tracking-[0.4em] font-black">
                      <th className="px-10 py-7">Transaction Type</th>
                      <th className="px-10 py-7">Classification</th>
                      <th className="px-10 py-7">Execution Date</th>
                      <th className="px-10 py-7 text-right">Value (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {MOCK_TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                        <td className="px-10 py-7">
                          <div className="flex items-center gap-6">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-all group-hover:scale-110", tx.type === 'credit' ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive")}>
                              {tx.type === 'credit' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                            </div>
                            <p className="font-black text-sm tracking-tight group-hover:text-accent transition-colors">{tx.description}</p>
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <Badge variant="outline" className="text-[9px] border-white/5 bg-white/5 h-6 px-3 font-black uppercase tracking-widest text-muted-foreground">{tx.category}</Badge>
                        </td>
                        <td className="px-10 py-7 text-xs text-muted-foreground font-black uppercase tracking-widest">{new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td className={cn("px-10 py-7 text-right font-black text-sm tracking-tight", tx.type === 'credit' ? "text-accent" : "text-foreground")}>
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
