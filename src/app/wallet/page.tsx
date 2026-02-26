'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Minus,
  Loader2,
  Trophy,
  History,
  CreditCard,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirebase } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { MOCK_TRANSACTIONS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function WalletPage() {
  const { user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchBalance = async () => {
      if (user && firestore) {
        setIsLoadingBalance(true);
        try {
          const docRef = doc(firestore, 'codusers', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setBalance(snap.data().balance);
          }
        } catch (error) {
          toast({ variant: "destructive", title: "Sync Error", description: "Failed to fetch vault balance." });
        } finally {
          setIsLoadingBalance(false);
        }
      }
    };

    fetchBalance();
  }, [user, isUserLoading, firestore, router]);

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    if (!user || !firestore || balance === null) return;
    
    const amount = type === 'deposit' ? 500 : -500;
    const newBalance = balance + amount;

    if (newBalance < 0) {
      toast({ variant: "destructive", title: "Insufficient Funds", description: "Your vault cannot drop below $0.00." });
      return;
    }

    try {
      const docRef = doc(firestore, 'codusers', user.uid);
      await updateDoc(docRef, { balance: newBalance });
      setBalance(newBalance);
      
      if (type === 'deposit') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#5cd6c1', '#1a3a4a'] });
      }

      toast({
        title: type === 'deposit' ? "Deposit Confirmed" : "Withdrawal Successful",
        description: `Your balance has been updated to $${newBalance.toLocaleString()}.`,
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Security Alert", description: "Transaction could not be authorized." });
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

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      <DashboardNav />
      
      <main className="flex-1 overflow-auto p-6 lg:p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold font-headline mb-1 tracking-tight">Digital Wallet</h1>
          <p className="text-muted-foreground text-sm">Securely manage your fluid assets and daily transactions.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <Card className="lg:col-span-2 bg-card border-white/5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-4">
                <Badge className="bg-accent/10 text-accent border-none font-bold">Active Wallet</Badge>
                <ShieldCheck className="w-5 h-5 text-accent/50" />
              </div>
              <CardTitle className="text-6xl font-headline font-bold tracking-tight py-4">
                {balance !== null ? `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
              </CardTitle>
              <CardDescription className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-muted-foreground/60">
                Primary Secure Ledger
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-6 flex flex-wrap gap-4">
              <Button 
                onClick={() => handleTransaction('deposit')}
                className="bg-accent hover:bg-accent/90 text-background font-black h-14 px-8 shadow-[0_0_20px_rgba(92,214,193,0.2)]"
              >
                <Plus className="w-5 h-5 mr-2" /> Quick Deposit ($500)
              </Button>
              <Button 
                onClick={() => handleTransaction('withdraw')}
                variant="outline"
                className="border-white/10 hover:bg-white/5 font-black h-14 px-8"
              >
                <Minus className="w-5 h-5 mr-2" /> Withdraw ($500)
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5 p-6 flex flex-col justify-center shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Rewards Points</p>
                <p className="text-2xl font-headline font-bold">12,450 pts</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              You've earned <span className="text-accent font-bold">450 points</span> this week through digital transactions.
            </p>
            <Button variant="secondary" className="w-full bg-white/5 hover:bg-white/10 border-none font-bold">
              Redeem Rewards
            </Button>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-headline tracking-tight flex items-center gap-2">
              <History className="w-6 h-6 text-accent" /> Recent Activity
            </h2>
            <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10 rounded-full font-bold">
              Full Statement
            </Button>
          </div>
          <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-6 py-5">Source</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          tx.type === 'credit' ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                        )}>
                          {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <p className="font-bold text-sm tracking-tight">{tx.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className="text-[9px] bg-white/5 border-none h-5 px-2 font-black uppercase text-muted-foreground/80">{tx.category}</Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent"></div> COMPLETED
                      </div>
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
      </main>
    </div>
  );
}