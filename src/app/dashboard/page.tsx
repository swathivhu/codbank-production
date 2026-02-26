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
  Wallet,
  Loader2,
  RefreshCw,
  Trophy,
  LogOut,
  User,
  Settings,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Copy,
  Zap
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

export default function DashboardPage() {
  const { user, isUserLoading, auth, firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Create Account State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [accountType, setAccountType] = useState<'Savings' | 'Current'>('Savings');
  const [initialDeposit, setInitialDeposit] = useState('1000');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [createdAccountNumber, setCreatedAccountNumber] = useState<string | null>(null);

  // Fetch accounts collection
  const accountsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'codusers', user.uid, 'accounts');
  }, [firestore, user]);

  const { data: accounts, isLoading: isAccountsLoading } = useCollection(accountsQuery);

  // Initial fetch of profile and balance
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
          // Handled centrally
        }
      }
    };

    fetchInitialData();
  }, [user, isUserLoading, firestore, router]);

  const handleCheckBalance = async () => {
    if (!user || !firestore) return;
    
    setIsFetching(true);
    try {
      // Direct Firestore access for high-security balance checking
      const docRef = doc(firestore, 'codusers', user.uid);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        const newBalance = snap.data().balance;
        setBalance(newBalance);
        
        // Celebration animation
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5cd6c1', '#1a3a4a', '#ffffff'],
        });

        toast({
          title: "Balance Verified",
          description: `Your vault balance is currently $${newBalance.toLocaleString()}.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Security Verification Failed",
        description: "Could not refresh vault balance. Please try again.",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!user || !firestore) return;

    const deposit = parseFloat(initialDeposit);
    if (isNaN(deposit) || deposit < 1000) {
      toast({
        variant: "destructive",
        title: "Invalid Deposit",
        description: "Initial deposit must be at least $1,000.",
      });
      return;
    }

    if (!isConfirmed) {
      toast({
        variant: "destructive",
        title: "Action Required",
        description: "Please confirm you agree to the terms.",
      });
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
      
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#5cd6c1', '#1a3a4a', '#ffffff']
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Could not open new account. Please try again.",
      });
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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <h1 className="text-3xl font-bold font-headline mb-1 tracking-tight">Welcome back, {firstName}</h1>
            <p className="text-muted-foreground text-sm">Securely managing your assets at CodBank.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <Input placeholder="Search accounts..." className="pl-10 w-64 bg-card border-white/5 focus-visible:ring-accent/20" />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full overflow-hidden border border-accent/20 hover:border-accent/50 transition-all focus:outline-none focus:ring-4 focus:ring-accent/10">
                  <img src={`https://picsum.photos/seed/${user.uid}/100/100`} alt="Avatar" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-card border-white/10 shadow-2xl p-2">
                <DropdownMenuLabel className="font-headline font-bold px-3 py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none">{fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground font-normal">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="py-2 focus:bg-accent/10 focus:text-accent cursor-pointer rounded-lg">
                  <User className="w-4 h-4 mr-2" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 focus:bg-accent/10 focus:text-accent cursor-pointer rounded-lg">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Security Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="py-2 focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer rounded-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <Card className="bg-card border-white/5 hover:border-accent/10 transition-all overflow-hidden relative lg:col-span-1 shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full -mr-24 -mt-24 blur-[80px]"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary" className="bg-accent/10 text-accent border-none font-bold px-2 py-0.5">Total Net Worth</Badge>
                <Wallet className="w-5 h-5 text-accent opacity-80" />
              </div>
              <CardTitle className="text-5xl font-headline font-bold tracking-tight py-2">
                {balance !== null ? `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
              </CardTitle>
              <CardDescription className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-muted-foreground/60">
                Aggregated Multi-Vault Balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mt-6">
                <Button 
                  onClick={handleCheckBalance} 
                  disabled={isFetching}
                  className="flex-1 bg-accent hover:bg-accent/90 text-background font-black h-12 shadow-[0_0_20px_rgba(92,214,193,0.3)] group"
                >
                  {isFetching ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2 group-hover:scale-125 transition-transform" />}
                  Check Balance
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => !open ? closeCreateDialog() : setIsCreateDialogOpen(true)}>
              <DialogTrigger asChild>
                <Card className="border-2 border-dashed border-white/10 hover:border-accent/40 hover:bg-accent/[0.02] transition-all cursor-pointer group flex items-center justify-center text-center p-6 h-full shadow-lg">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300 shadow-inner">
                      <Plus className="w-7 h-7 text-accent" />
                    </div>
                    <CardTitle className="text-xl font-headline font-bold mb-1">Create New Account</CardTitle>
                    <CardDescription className="text-xs">Expand your financial portfolio today</CardDescription>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-foreground sm:max-w-[425px] overflow-hidden shadow-2xl">
                {!createdAccountNumber ? (
                  <>
                    <DialogHeader>
                      <DialogTitle className="font-headline text-2xl font-bold">Open Secure Account</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Select account parameters to initialize your new secure vault.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Category</Label>
                        <Select value={accountType} onValueChange={(v: any) => setAccountType(v)}>
                          <SelectTrigger className="bg-background border-white/5 h-12 focus:ring-accent/20">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="Savings">Savings Vault (3.5% APY)</SelectItem>
                            <SelectItem value="Current">Current Account (Fluid Use)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deposit" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Initial Funding ($)</Label>
                        <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                           <Input 
                            id="deposit" 
                            type="number" 
                            min="1000"
                            value={initialDeposit} 
                            onChange={(e) => setInitialDeposit(e.target.value)}
                            className="bg-background border-white/5 h-12 pl-8 focus-visible:ring-accent/20 font-bold"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-accent" /> Minimum mandatory funding: $1,000.00
                        </p>
                      </div>
                      <div className="flex items-start space-x-3 pt-2 bg-accent/5 p-3 rounded-xl border border-accent/10">
                        <Checkbox 
                          id="confirm" 
                          checked={isConfirmed} 
                          onCheckedChange={(v: any) => setIsConfirmed(v)}
                          className="border-accent/40 data-[state=checked]:bg-accent data-[state=checked]:text-background mt-1"
                        />
                        <Label htmlFor="confirm" className="text-[10px] text-muted-foreground leading-snug cursor-pointer select-none">
                          I acknowledge the legal terms and authorize CodBank to initialize this new secure account instance.
                        </Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleCreateAccount} 
                        disabled={isCreating}
                        className="w-full bg-accent hover:bg-accent/90 text-background font-black h-12 shadow-lg transition-all"
                      >
                        {isCreating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                        Finalize & Create
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <div className="py-8 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center scale-110 shadow-[0_0_50px_rgba(92,214,193,0.15)] border border-accent/20">
                      <CheckCircle2 className="w-12 h-12 text-accent" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black font-headline tracking-tight">Vault Initialized!</h2>
                      <p className="text-sm text-muted-foreground">Your {accountType} account is now active on the ledger.</p>
                    </div>
                    
                    <div className="w-full bg-background/80 border border-white/5 rounded-2xl p-6 space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-black">Account Identifier</p>
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-3xl font-mono font-bold tracking-widest text-accent">{createdAccountNumber}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl"
                          onClick={() => {
                            navigator.clipboard.writeText(createdAccountNumber);
                            toast({ title: "Copied", description: "Account number saved to clipboard." });
                          }}
                        >
                          <Copy className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <Button 
                      onClick={closeCreateDialog}
                      className="w-full bg-accent hover:bg-accent/90 text-background font-black h-12 rounded-xl"
                    >
                      Return to Dashboard
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Card className="bg-card border-white/5 flex flex-col justify-center p-6 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-16 h-16 text-accent" />
              </div>
              <div className="flex items-center justify-between mb-4 relative">
                <h3 className="font-headline font-bold text-lg">Financial Insight</h3>
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed relative">
                You currently have <span className="text-accent font-bold">{accounts?.length || 0}</span> active supplemental accounts. Multi-vault diversification reduces counterparty risk.
              </p>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-headline tracking-tight">Recent Activity</h2>
              <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10 rounded-full font-bold">
                View Ledger <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
            <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black">
                    <th className="px-6 py-5">Origin / Destination</th>
                    <th className="px-6 py-5">Timestamp</th>
                    <th className="px-6 py-5 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_TRANSACTIONS.map((tx) => (
                    <tr key={tx.id} className="hover:bg-accent/[0.02] transition-colors group cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner",
                            tx.type === 'credit' ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                          )}>
                            {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-sm tracking-tight">{tx.description}</p>
                            <Badge variant="outline" className="text-[9px] bg-white/5 border-none h-4 px-2 font-black uppercase text-muted-foreground/80">{tx.category}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-muted-foreground font-medium">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className={cn(
                        "px-6 py-5 text-right font-black text-sm tracking-tight",
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

          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline tracking-tight">Secure Accounts</h2>
            <div className="space-y-4">
              {isAccountsLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-card/50 rounded-2xl border border-white/5">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                </div>
              ) : accounts && accounts.length > 0 ? (
                accounts.map(acc => (
                  <Card key={acc.id} className="bg-card border-white/5 hover:border-accent/30 transition-all p-5 group shadow-lg cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge className="bg-accent/10 text-accent border-none mb-2 font-bold">{acc.accountType}</Badge>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">ID: {acc.accountNumber}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <ChevronRight className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black font-headline tracking-tight">${acc.balance.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Available</span>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center p-12 bg-card/50 rounded-2xl border border-dashed border-white/10 shadow-inner">
                  <Wallet className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-10" />
                  <p className="text-sm font-bold text-muted-foreground/60 mb-1 tracking-tight">No supplemental accounts found</p>
                  <Button 
                    variant="link" 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="text-accent text-xs h-auto p-0 font-black"
                  >
                    Open one now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
