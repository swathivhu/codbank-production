'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import { 
  Globe, 
  RefreshCw, 
  ArrowRightLeft, 
  Loader2,
  Plane,
  CreditCard,
  ShieldCheck,
  ChevronDown,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.94 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 156.40 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.37 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52 },
];

export default function GlobalAccessPage() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedValue, setConvertedValue] = useState<number | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    handleConvert();
  }, [amount, fromCurrency, toCurrency]);

  const handleConvert = () => {
    const fromRate = CURRENCIES.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = CURRENCIES.find(c => c.code === toCurrency)?.rate || 1;
    const value = (parseFloat(amount) / fromRate) * toRate;
    setConvertedValue(isNaN(value) ? 0 : value);
  };

  const handleTransfer = () => {
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      toast({
        title: "Transfer Initiated",
        description: `Successfully simulated transfer of ${amount} ${fromCurrency} to foreign vault.`,
      });
    }, 1500);
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
          <h1 className="text-3xl font-bold font-headline mb-1 tracking-tight">Global Access</h1>
          <p className="text-muted-foreground text-sm">International transfers and multi-currency management.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card border-white/5 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-white/5 bg-accent/[0.02]">
                <h3 className="font-headline font-bold text-xl mb-2">Currency Converter</h3>
                <p className="text-sm text-muted-foreground">Real-time mid-market rates for all your global assets.</p>
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">You Send</label>
                    <div className="flex gap-2">
                      <Input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-background border-white/10 h-14 font-black text-xl focus-visible:ring-accent/20"
                      />
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="w-32 bg-background border-white/10 h-14 font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                          {CURRENCIES.map(c => (
                            <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-center md:pt-6">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent rotate-90 md:rotate-0">
                      <ArrowRightLeft className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Recipient Gets</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-background border border-white/10 rounded-md h-14 px-3 flex items-center font-black text-xl text-accent">
                        {convertedValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="w-32 bg-background border-white/10 h-14 font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                          {CURRENCIES.map(c => (
                            <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-bold">Exchange Rate</span>
                    <span className="text-foreground font-black">1 {fromCurrency} = {(CURRENCIES.find(c => c.code === toCurrency)?.rate || 1) / (CURRENCIES.find(c => c.code === fromCurrency)?.rate || 1).toFixed(4)} {toCurrency}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-bold">Transfer Fee</span>
                    <span className="text-accent font-black">Waived (CodBank Platinum)</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                    <span className="text-muted-foreground font-bold">Guaranteed Delivery</span>
                    <span className="text-foreground font-black">Instant (SEPA/SWIFT Instant)</span>
                  </div>
                </div>

                <Button 
                  onClick={handleTransfer} 
                  disabled={isConverting}
                  className="w-full bg-accent hover:bg-accent/90 text-background font-black h-14 text-lg shadow-xl"
                >
                  {isConverting ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <RefreshCw className="w-6 h-6 mr-2" />}
                  Confirm International Transfer
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-card border-white/5 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                  <Plane className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="font-headline font-bold">Travel Mode</CardTitle>
                <CardDescription>Zero fees on all international card swipes while enabled.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-white/5 hover:bg-white/10 border-none font-black">
                  Enable Travel Mode
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-white/5 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" /> Global Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our international banking desk is available 24/7. Transfers to major European and Asian markets are now finalized in under 60 seconds.
                </p>
                <div className="space-y-2">
                   <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                     <span className="text-xs font-bold">Hong Kong Desk</span>
                     <Badge className="bg-accent/10 text-accent border-none text-[9px] font-black uppercase">Online</Badge>
                   </div>
                   <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                     <span className="text-xs font-bold">London Desk</span>
                     <Badge className="bg-accent/10 text-accent border-none text-[9px] font-black uppercase">Online</Badge>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}