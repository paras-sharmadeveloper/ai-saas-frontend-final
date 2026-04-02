import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

const callData: Record<string, any> = {
  "1": {
    customer: "Sarah Johnson", email: "sarah@example.com", phone: "+1 (555) 123-4567",
    type: "Lead", date: "Apr 1, 2026 10:30 AM", duration: "5:23",
    summary: "Customer inquired about our enterprise plan. Expressed interest in the AI voice agents for their call center. Budget is $5,000/mo. Follow-up scheduled for next week.",
    transcript: [
      { role: "ai", text: "Hi Sarah, thank you for calling Vernal! How can I help you today?", time: "0:00" },
      { role: "user", text: "Hi! I'm interested in your AI voice agents for our call center.", time: "0:12" },
      { role: "ai", text: "That's great! We have several options for call centers. How many agents are you currently using?", time: "0:18" },
      { role: "user", text: "We have about 50 agents handling inbound calls.", time: "0:28" },
      { role: "ai", text: "Perfect. Our enterprise plan would be a great fit for your team size. It includes unlimited AI agents and priority support.", time: "0:35" },
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
      <Button variant="outline" onClick={() => navigate("/calls")}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Calls</Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Customer Info</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[["Name", call.customer], ["Email", call.email], ["Phone", call.phone], ["Type", call.type], ["Date", call.date], ["Duration", call.duration]].map(([l, v]) => (
              <div key={l} className="flex justify-between"><span className="text-muted-foreground">{l}</span><span className="font-medium">{v}</span></div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Call Recording</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button size="icon" variant="outline" onClick={() => setPlaying(!playing)}>
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="flex-1">
                <Progress value={playing ? 45 : 0} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{playing ? "2:24" : "0:00"}</span><span>5:23</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>AI Summary</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{call.summary}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Call Transcript</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {call.transcript.map((m: any, i: number) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}>
                <p>{m.text}</p>
                <p className={`text-xs mt-1 ${m.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
