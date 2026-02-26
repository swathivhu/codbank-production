'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Loader2,
  PieChart,
  BarChart3,
  Target,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirebase } from '@/firebase';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CHART_DATA = [
  { month: 'Jan', value: 45000 },
  { month: 'Feb', value: 48000 },
  { month: 'Mar', value: 47000 },
  { month: 'Apr', value: 52000 },
  { month: 'May', value: 59000 },
  { month: 'Jun', value: 65000 },
  { month: 'Jul', value: 68000 },
];

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(var(--accent))",
  },
};

export default function InvestingPage() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

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
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-headline mb-1 tracking-tight">Smart Investing</h1>
            <p className="text-muted-foreground text-sm">AI-driven portfolio management and market insights.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-background font-black h-12 shadow-lg">
            <Plus className="w-5 h-5 mr-2" /> Invest Now
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
          <Card className="lg:col-span-1 bg-card border-white/5 shadow-xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Total Invested</CardDescription>
              <CardTitle className="text-3xl font-headline font-bold">$128,400.20</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-accent font-bold text-xs">
                <TrendingUp className="w-4 h-4" /> +12.5% this month
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-1 bg-card border-white/5 shadow-xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Net Profit/Loss</CardDescription>
              <CardTitle className="text-3xl font-headline font-bold text-accent">+$14,230.50</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs">
                <Zap className="w-4 h-4" /> Lifetime earnings
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-card border-white/5 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10">
               <Target className="w-24 h-24 text-accent" />
             </div>
             <CardHeader>
               <CardTitle className="text-lg font-bold">Investment Strategy</CardTitle>
               <CardDescription>Current Risk Profile: <Badge className="bg-accent/10 text-accent border-none font-bold">Aggressive Growth</Badge></CardDescription>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                 Your AI manager has rebalanced your assets towards emerging tech markets. Projected annual yield: <span className="text-accent font-bold">18.4%</span>.
               </p>
             </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-card border-white/5 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-xl">Portfolio Performance</h3>
              <div className="flex gap-2">
                {['1W', '1M', '3M', '1Y', 'ALL'].map((p) => (
                  <Button key={p} variant="ghost" size="sm" className={cn("text-[10px] font-black", p === '1M' ? "bg-accent/10 text-accent" : "text-muted-foreground")}>
                    {p}
                  </Button>
                ))}
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ChartContainer config={chartConfig}>
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold'}}
                  />
                  <YAxis hide />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </Card>

          <div className="space-y-6">
            <h3 className="font-headline font-bold text-xl">Top Positions</h3>
            {[
              { name: 'NVIDIA Corp', ticker: 'NVDA', value: '$24,500', change: '+5.2%', icon: <ArrowUpRight className="text-accent" /> },
              { name: 'Tesla Inc', ticker: 'TSLA', value: '$12,800', change: '-1.4%', icon: <TrendingDown className="text-destructive" /> },
              { name: 'Bitcoin', ticker: 'BTC', value: '$45,200', change: '+2.8%', icon: <ArrowUpRight className="text-accent" /> },
              { name: 'Ethereum', ticker: 'ETH', value: '$15,900', change: '+4.1%', icon: <ArrowUpRight className="text-accent" /> },
            ].map((stock, i) => (
              <Card key={i} className="bg-card border-white/5 p-4 hover:border-accent/20 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xs group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                      {stock.ticker}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{stock.name}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{stock.ticker}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm">{stock.value}</p>
                    <p className={cn("text-[10px] font-bold flex items-center justify-end gap-1", stock.change.startsWith('+') ? "text-accent" : "text-destructive")}>
                      {stock.change} {stock.icon}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="outline" className="w-full border-white/5 hover:bg-white/5 font-bold text-xs h-12">
              View All Assets
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}