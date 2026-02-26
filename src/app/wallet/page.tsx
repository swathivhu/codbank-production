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
          toast({ variant: "destructive", title: "Sync Error", description: "Ledger access failed." });
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
      toast({ variant: "destructive", title: "Insufficient Funds", description: "Vault floor is $0.00." });
      return;
    }

    try {
      const docRef = doc(firestore, 'codusers', user.uid);
      await updateDoc(docRef, { balance: newBalance });
      setBalance(newBalance);
      
      if (type === 'deposit') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#5cd6c1', '#ffffff'] });
      }

      toast({
        title: type === 'deposit' ? "Deposit Confirmed" : "Withdrawal Success",
        description: `Ledger updated: $${newBalance.toLocaleString()}.`,
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Security Alert", description: "Operation unauthorized." });
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      <DashboardNav />
      
      <main className="flex-1 overflow-auto p-6 lg:p-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black font-headline mb-2 tracking-tight">Digital Wallet</h1>
          <p className="text-muted-foreground font-medium">Real-time liquidity and transaction management.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          <Card className="glass-card lg:col-span-2 relative overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full -mr-40 -mt-40 blur-[120px]"></div>
            <CardHeader className="p-10">
              <div className="flex justify-between items-center mb-6">
                <Badge className="bg-accent/10 text-accent border-none font-black tracking-widest px-4 uppercase text-[10px]">Primary Asset</Badge>
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-7xl font-headline font-black tracking-tighter py-6">
                {balance !== null ? `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
              </CardTitle>
              <CardDescription className="font-mono text-[10px] tracking-[0.4em] uppercase font-black text-muted-foreground/60">
                Active Secure Ledger
              </CardDescription>
            </CardHeader>
            <CardContent className="px-10 pb-10 flex flex-wrap gap-6">
              <Button 
                onClick={() => handleTransaction('deposit')}
                className="bg-accent hover:bg-accent/90 text-background font-black h-16 px-10 rounded-2xl shadow-2xl text-lg"
              >
                <Plus className="w-6 h-6 mr-3" /> Quick Deposit ($500)
              </Button>
              <Button 
                onClick={() => handleTransaction('withdraw')}
                variant="outline"
                className="border-white/10 hover:bg-white/5 font-black h-16 px-10 rounded-2xl text-lg"
              >
                <Minus className="w-6 h-6 mr-3" /> Instant Withdraw ($500)
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card p-10 flex flex-col justify-center rounded-[2.5rem]">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[1.5rem] bg-accent/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Loyalty Tier</p>
                <p className="text-3xl font-headline font-black">Platinum</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-medium">
              You've generated <span className="text-accent font-black">450 points</span> from card-not-present transactions this cycle.
            </p>
            <Button variant="secondary" className="w-full bg-white/5 hover:bg-white/10 border-none font-black h-14 rounded-2xl">
              Redeem Rewards
            </Button>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-black font-headline tracking-tight flex items-center gap-4">
              <History className="w-8 h-8 text-accent" /> Ledger Activity
            </h2>
            <Button variant="ghost" className="text-accent hover:bg-accent/10 rounded-full font-black px-6">Export CSV</Button>
          </div>
          <div className="glass-card rounded-[2.5rem] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-black">
                  <th className="px-10 py-8">Origin / Entity</th>
                  <th className="px-10 py-8">Classification</th>
                  <th className="px-10 py-8">Status</th>
                  <th className="px-10 py-8 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                          tx.type === 'credit' ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                        )}>
                          {tx.type === 'credit' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                        </div>
                        <p className="font-black text-base tracking-tight">{tx.description}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <Badge variant="outline" className="text-[10px] border-white/5 bg-white/5 h-6 px-3 font-black uppercase tracking-widest text-muted-foreground">{tx.category}</Badge>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2.5 text-[10px] font-black text-accent tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(92,214,193,0.5)]"></div> SETTLED
                      </div>
                    </td>
                    <td className={cn(
                      "px-10 py-8 text-right font-black text-lg tracking-tight",
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