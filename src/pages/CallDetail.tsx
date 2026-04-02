import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, User } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const callData: Record<string, any> = {
  "1": {
    customer: "Sarah Johnson", email: "sarah@example.com", phone: "+1 (555) 123-4567",
    type: "Lead", date: "Apr 2, 2026", duration: "5:23",
    summary: "Customer inquired about enterprise pricing plans. Showed strong interest in the Pro plan with annual billing. Follow-up scheduled for next week.",
    transcript: [
      { role: "ai", text: "Hello! Thank you for calling Vernal. How can I help you today?", time: "0:00" },
      { role: "user", text: "Hi, I'm interested in your enterprise pricing plans.", time: "0:12" },
      { role: "ai", text: "Great! I'd be happy to help you with that. We have several plans tailored for businesses of all sizes. Could you tell me a bit about your company and what features you're looking for?", time: "0:18" },
      { role: "user", text: "We're a mid-size tech company with about 200 employees. We need voice AI for customer support.", time: "0:35" },
      { role: "ai", text: "Perfect! For a company your size, I'd recommend our Pro plan which includes unlimited AI agents, priority support, and advanced analytics. It starts at $499/month with annual billing.", time: "0:50" },
      { role: "user", text: "That sounds interesting. Can you send me more details?", time: "1:10" },
      { role: "ai", text: "Absolutely! I'll have our team send you a detailed proposal. Is sarah@example.com the best email to reach you?", time: "1:18" },
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
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/calls")} className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Calls
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Call Details</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Call with {call.customer}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Customer Info */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Customer Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground text-sm">{call.customer}</p>
                  <p className="text-xs text-muted-foreground">{call.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium text-foreground">{call.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Type</p>
                  <Badge variant="secondary" className="mt-0.5">{call.type}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Duration</p>
                  <p className="font-medium text-foreground">{call.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="font-medium text-foreground">{call.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recording */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Recording</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button size="icon" variant="ghost" className="rounded-full shrink-0 h-10 w-10" onClick={() => setPlaying(!playing)}>
                  {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <div className="flex-1">
                  <Progress value={playing ? 45 : 0} className="h-1.5" />
                </div>
                <span className="text-sm text-muted-foreground tabular-nums">{call.duration}</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Summary */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">AI Summary</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{call.summary}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Transcript */}
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-base">Call Transcript</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {call.transcript.map((m: any, i: number) => (
              <div key={i} className={`flex items-start gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "ai" && (
                  <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">AI</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}>
                  <p>{m.text}</p>
                </div>
                {m.role === "user" && (
                  <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
