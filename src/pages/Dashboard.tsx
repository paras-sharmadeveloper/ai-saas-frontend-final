import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, PhoneMissed, Clock, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  { label: "Total Calls", value: "2,847", change: "+12.5%", positive: true, icon: Phone },
  { label: "Total Leads", value: "1,234", change: "+8.2%", positive: true, icon: Users },
  { label: "Missed Calls", value: "45", change: "-3.1%", positive: false, icon: PhoneMissed },
  { label: "Avg Call Duration", value: "4m 32s", change: "+0.8%", positive: true, icon: Clock },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Overview of your AI voice agent platform</p>
        </div>
        <div className="flex items-center gap-2.5 bg-primary/10 border border-primary/20 px-4 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground leading-none">Assigned Number</p>
            <p className="text-sm font-bold text-primary mt-0.5 tracking-wide">+1 (555) 100-0005</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  s.positive ? "bg-success/10" : "bg-destructive/10"
                }`}>
                  <s.icon className={`w-5 h-5 ${s.positive ? "text-success" : "text-destructive"}`} />
                </div>
              </div>
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${s.positive ? "text-success" : "text-destructive"}`}>
                {s.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {s.change} vs last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}