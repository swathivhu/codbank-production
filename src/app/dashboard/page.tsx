import { DashboardNav } from '@/components/dashboard-nav';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, MOCK_USER } from '@/lib/mock-data';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  TrendingUp, 
  Search, 
  Bell,
  Plus,
  MoreVertical,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-body">
      <DashboardNav />
      
      <main className="flex-1 overflow-auto p-6 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-headline mb-1">Good morning, {MOCK_USER.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">Manage your finances and transactions effortlessly.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-10 w-64 bg-card border-white/5" />
            </div>
            <Button variant="outline" size="icon" className="bg-card border-white/5 text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="h-10 w-10 rounded-full overflow-hidden border border-accent/20">
              <img src="https://picsum.photos/seed/codbank-avatar/100/100" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Account Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {MOCK_ACCOUNTS.map((acc) => (
            <Card key={acc.id} className="bg-card border-white/5 hover:border-accent/10 transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary" className="bg-primary/20 text-accent border-none">{acc.type}</Badge>
                  <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </div>
                <CardTitle className="text-3xl font-headline font-bold">
                  ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </CardTitle>
                <CardDescription className="font-mono text-xs">{acc.accountNumber}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1 bg-accent hover:bg-accent/90 text-background font-semibold">
                    Send
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                    Deposit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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

          {/* Quick Insights / Profile Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-headline">Quick Actions</h2>
            <Card className="bg-primary/10 border-accent/10">
              <CardHeader>
                <CardTitle className="text-lg font-headline">Safe Spending</CardTitle>
                <CardDescription>Your current spending limit is $5,000/mo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span>Used</span>
                    <span className="text-accent">$3,240.00</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[65%] rounded-full shadow-[0_0_10px_rgba(92,214,193,0.5)]"></div>
                  </div>
                </div>
                <Button className="w-full border border-accent/20 bg-accent/10 text-accent hover:bg-accent/20">
                  Adjust Limit
                </Button>
              </CardContent>
            </Card>

            <div className="bg-card border border-white/5 p-6 rounded-2xl">
              <h3 className="font-headline font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Savings Insight
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                You've saved <span className="text-accent font-bold">$450.00</span> more this month compared to February. Great progress!
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