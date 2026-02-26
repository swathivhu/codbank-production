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
  AlertCircle,
  ChevronRight
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
          // Handled by global listener
        }
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
          colors: ['#5cd6c1', '#1a3a4a', '#ffffff'],
        });

        toast({
          title: "Balance Updated",
          description: `Your total aggregated balance is $${newBalance.toLocaleString()}.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch balance.",
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
      // Generate a 10-digit account number
      const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      
      const accountsRef = collection(firestore, 'codusers', user.uid, 'accounts');
      await addDoc(accountsRef, {
        accountNumber,
        accountType,
        balance: deposit,
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
      });

      toast({
        title: "New Account Created Successfully",
        description: `Your ${accountType} account (${accountNumber}) is now active.`,
      });
      
      setIsCreateDialogOpen(false);
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
        description: "Could not open new account. Please try again.",
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
            <p className="text-muted-foreground">Manage your secure accounts and track your growth.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search accounts..." className="pl-10 w-64 bg-card border-white/5" />
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
              <DropdownMenuContent align="end" className="w-56 bg-card border-white/10 shadow-2xl">
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
                  <span>Manage Accounts</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 focus:bg-accent/10 focus:text-accent cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Security Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="py-2 focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <Card className="bg-card border-white/5 hover:border-accent/10 transition-all overflow-hidden relative lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary" className="bg-primary/20 text-accent border-none">Total Net Worth</Badge>
                <Wallet className="w-4 h-4 text-accent" />
              </div>
              <CardTitle className="text-4xl font-headline font-bold">
                {balance !== null ? `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
              </CardTitle>
              <CardDescription className="font-mono text-[10px] tracking-widest uppercase">
                Aggregated Vault Balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={handleCheckBalance} 
                  disabled={isFetching}
                  className="flex-1 bg-accent hover:bg-accent/90 text-background font-bold shadow-[0_0_15px_rgba(92,214,193,0.3)]"
                >
                  {isFetching ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Trophy className="w-4 h-4 mr-2" />}
                  Refresh Vault
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action Buttons */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-2 border-dashed border-white/10 hover:border-accent/30 hover:bg-white/5 transition-all cursor-pointer group flex items-center justify-center text-center p-6 h-full">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg font-headline">Create New Account</CardTitle>
                    <CardDescription>Expand your portfolio</CardDescription>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-foreground sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl">Open New Secure Account</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Select your account type and make your initial deposit to get started.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Account Category</Label>
                    <Select value={accountType} onValueChange={(v: any) => setAccountType(v)}>
                      <SelectTrigger className="bg-background border-white/10">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        <SelectItem value="Savings">Savings Account (3.5% APY)</SelectItem>
                        <SelectItem value="Current">Current Account (Daily use)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deposit">Initial Funding ($)</Label>
                    <Input 
                      id="deposit" 
                      type="number" 
                      min="1000"
                      value={initialDeposit} 
                      onChange={(e) => setInitialDeposit(e.target.value)}
                      className="bg-background border-white/10"
                    />
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Minimum required deposit: $1,000.00
                    </p>
                  </div>
                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox 
                      id="confirm" 
                      checked={isConfirmed} 
                      onCheckedChange={(v: any) => setIsConfirmed(v)}
                      className="border-white/20 mt-1"
                    />
                    <Label htmlFor="confirm" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                      I verify that I have read the terms and authorize CodBank to create this new secure account.
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateAccount} 
                    disabled={isCreating}
                    className="w-full bg-accent hover:bg-accent/90 text-background font-bold h-11"
                  >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                    Confirm & Create Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Card className="bg-card border-white/5 flex flex-col justify-center p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-bold text-lg">Financial Insight</h3>
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You've successfully opened <span className="text-accent font-bold">{accounts?.length || 0}</span> supplemental accounts. diversifying your assets improves long-term stability.
              </p>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-headline">Recent Activity</h2>
              <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">View All History <ChevronRight className="ml-1 w-4 h-4" /></Button>
            </div>
            <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">Date</th>
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
                            <p className="font-medium text-sm">{tx.description}</p>
                            <Badge variant="outline" className="text-[9px] bg-white/5 border-none h-4 px-1">{tx.category}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-right font-bold text-sm",
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
            <h2 className="text-2xl font-bold font-headline">Your Accounts</h2>
            <div className="space-y-4">
              {isAccountsLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-card/50 rounded-2xl border border-white/5">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                </div>
              ) : accounts && accounts.length > 0 ? (
                accounts.map(acc => (
                  <Card key={acc.id} className="bg-card border-white/5 hover:border-accent/20 transition-all p-5 group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge className="bg-primary/20 text-accent border-none mb-1">{acc.accountType}</Badge>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Account ID: {acc.accountNumber}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold font-headline">${acc.balance.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground">Available</span>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center p-12 bg-card/50 rounded-2xl border border-dashed border-white/10">
                  <Wallet className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium text-muted-foreground">No secondary accounts</p>
                  <Button 
                    variant="link" 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="text-accent text-xs h-auto p-0"
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
