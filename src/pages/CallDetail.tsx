import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, Target, MessageCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

const callData: Record<string, any> = {
  "1": {
    customer: "Sarah Johnson", email: "sarah@example.com", phone: "+1 (555) 123-4567",
    type: "Lead", date: "Apr 1, 2026 10:30 AM", duration: "5:23",
    summary: {
      keyPoints: ["Customer inquired about enterprise plan", "Has 50 agents in call center", "Budget: $5,000/mo"],
      intent: "Purchasing enterprise AI voice agent solution",
      outcome: "Follow-up scheduled for next week",
    },
    transcript: [
      { role: "ai", text: "Hi Sarah, thank you for calling Vernal! How can I help you today?", time: "0:00" },
      { role: "user", text: "Hi! I'm interested in your AI voice agents for our call center.", time: "0:12" },
      { role: "ai", text: "That's great! We have several options for call centers. How many agents are you currently using?", time: "0:18" },
      { role: "user", text: "We have about 50 agents handling inbound calls.", time: "0:28" },
      { role: "ai", text: "Perfect. Our enterprise plan would be a great fit for your team size. It includes unlimited AI agents and priority support.", time: "0:35" },
      { role: "user", text: "That sounds interesting. Can we schedule a demo next week?", time: "0:50" },
      { role: "ai", text: "Absolutely! I'll have our sales team reach out to you. Is Tuesday at 2 PM good?", time: "0:58" },
    ],
  },
};

export default function CallDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const call = callData[id || "1"] || callData["1"];

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => navigate("/calls")}>
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Calls
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Customer Info */}
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-base">Customer Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[["Name", call.customer], ["Email", call.email], ["Phone", call.phone], ["Type", call.type], ["Date", call.date], ["Duration", call.duration]].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span className="text-muted-foreground">{l}</span>
                <span className="font-medium text-foreground">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recording */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Call Recording</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 bg-muted rounded-xl p-4">
              <Button size="icon" variant="outline" className="rounded-full shrink-0" onClick={() => setPlaying(!playing)}>
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="flex-1">
                <Progress value={playing ? 45 : 0} className="h-1.5" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>{playing ? "2:24" : "0:00"}</span><span>5:23</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">AI Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <MessageCircle className="w-4 h-4 text-primary" /> Key Points
              </div>
              <ul className="space-y-1">
                {call.summary.keyPoints.map((p: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Target className="w-4 h-4 text-primary" /> Intent
              </div>
              <p className="text-sm text-muted-foreground">{call.summary.intent}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle className="w-4 h-4 text-success" /> Outcome
              </div>
              <Badge className="bg-success/10 text-success border-0">{call.summary.outcome}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transcript */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">Call Transcript</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {call.transcript.map((m: any, i: number) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}>
                <p>{m.text}</p>
                <p className={`text-xs mt-1 ${m.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
