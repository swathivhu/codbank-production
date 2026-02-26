
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
  CreditCard,
  CheckCircle2,
  AlertCircle
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

  // Fetch accounts collection
  const accountsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'codusers', user.uid, 'accounts');
  }, [firestore, user]);

  const { data: accounts, isLoading: isAccountsLoading } = useCollection(accountsQuery);

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
      await new Promise(resolve => setTimeout(resolve, 800));
      const docRef = doc(firestore, 'codusers', user.uid);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        const newBalance = snap.data().balance;
        setBalance(newBalance);
        
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

  const handleCreateAccount = async () => {
    if (!user || !firestore) return;
    if (parseInt(initialDeposit) < 1000) {
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
        description: "Please confirm the terms to open a new account.",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Generate a 10-digit account number
      const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      
      const accountsRef = collection(firestore, 'codusers', user.uid, 'accounts');
      await addDoc(accountsRef, {
        accountNumber,
        accountType,
        balance: parseFloat(initialDeposit),
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Account Created Successfully",
        description: `Your new ${accountType} account (${accountNumber}) is ready.`,
      });
      
      setIsCreateDialogOpen(false);
      // Reset form
      setAccountType('Savings');
      setInitialDeposit('1000');
      setIsConfirmed(false);
      
      confetti({
        particleCount: 100,
        spread: 60,
        colors: ['#5cd6c1', '#ffffff']
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Could not create account. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
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
          {/* Main Balance Card */}
          <Card className="bg-card border-white/5 hover:border-accent/10 transition-all overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary" className="bg-primary/20 text-accent border-none">Total Wealth</Badge>
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
                Aggregated Balance
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
                  Refresh
                </Button>
                <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                  Transfer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Accounts List */}
          {accounts && accounts.length > 0 ? (
            accounts.slice(0, 1).map((acc) => (
              <Card key={acc.id} className="bg-card border-white/5">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="text-accent border-accent/20">{acc.accountType} Account</Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">#{acc.accountNumber}</span>
                  </div>
                  <CardTitle className="text-2xl font-bold font-headline">
                    ${acc.balance.toLocaleString()}
                  </CardTitle>
                  <CardDescription>Available Balance</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-center gap-2 text-xs text-accent">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active & Verified</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : isAccountsLoading ? (
            <Card className="bg-card border-white/5 flex items-center justify-center h-full min-h-[180px]">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </Card>
          ) : (
            <Card className="bg-card border-white/5 border-dashed flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No secondary accounts</p>
              <p className="text-xs text-muted-foreground">Open one to manage your savings.</p>
            </Card>
          )}

          {/* Create New Account Button/Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <div className="border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-white/5 hover:border-accent/20 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-accent" />
                </div>
                <span className="font-headline font-semibold">Create New Account</span>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-foreground">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Open New Account</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Expand your financial reach with a new secure account.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Account Type</Label>
                  <Select value={accountType} onValueChange={(v: any) => setAccountType(v)}>
                    <SelectTrigger className="bg-background border-white/10">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      <SelectItem value="Savings">Savings Account</SelectItem>
                      <SelectItem value="Current">Current Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Initial Deposit ($)</Label>
                  <Input 
                    id="deposit" 
                    type="number" 
                    min="1000"
                    value={initialDeposit} 
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    className="bg-background border-white/10"
                  />
                  <p className="text-[10px] text-muted-foreground">Minimum deposit: $1,000.00</p>
                </div>
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox 
                    id="confirm" 
                    checked={isConfirmed} 
                    onCheckedChange={(v: any) => setIsConfirmed(v)}
                    className="border-white/20 mt-1"
                  />
                  <Label htmlFor="confirm" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                    I confirm that I have read and agree to the CodBank Terms of Service and Electronic Funds Transfer Agreement.
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCreateAccount} 
                  disabled={isCreating}
                  className="w-full bg-accent hover:bg-accent/90 text-background font-bold h-11"
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Secure Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

          {/* Sidebar - Accounts Summary List */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-headline">Your Accounts</h2>
            <div className="bg-card border border-white/5 p-6 rounded-2xl space-y-4">
              {accounts && accounts.length > 0 ? (
                accounts.map(acc => (
                  <div key={acc.id} className="flex justify-between items-center p-3 rounded-xl bg-background/50 border border-white/5">
                    <div>
                      <p className="text-sm font-bold font-headline">{acc.accountType}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">**** {acc.accountNumber.slice(-4)}</p>
                    </div>
                    <p className="font-bold text-accent">${acc.balance.toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No accounts found.</p>
              )}
              
              <div className="pt-4 mt-4 border-t border-white/5">
                <h3 className="font-headline font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Savings Insights
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  You've opened <span className="text-accent font-bold">{accounts?.length || 0}</span> accounts this session. You're building a diverse portfolio!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
