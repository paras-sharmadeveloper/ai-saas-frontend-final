import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { callsService, type Call } from "@/services/callsService";

const formatDuration = (d?: number | string) => {
  if (!d) return "—";
  const secs = typeof d === "string" ? parseInt(d) : d;
  if (isNaN(secs)) return String(d);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const formatDate = (s?: string) => {
  if (!s) return "—";
  return new Date(s).toLocaleString();
};

export default function CallDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    callsService
      .getById(id)
      .then(setCall)
      .catch(() => toast.error("Failed to load call details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-muted-foreground">Call not found</p>
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigate("/admin/calls")}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Calls
        </Button>
      </div>
    );
  }

  const customerName = call.customer?.name ?? "Unknown";
  const customerEmail = call.customer?.email ?? "—";
  const customerPhone = call.customer?.phone ?? call.to ?? "—";
  const transcript = call.messages ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/calls")} className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Calls
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Call Details</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Call with {customerName}</p>
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
                  <p className="font-semibold text-foreground text-sm">{customerName}</p>
                  <p className="text-xs text-muted-foreground">{customerEmail}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium text-foreground">{customerPhone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Call Type</p>
                  <Badge variant="secondary" className="mt-0.5">{call.call_type ?? call.type ?? "—"}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Duration</p>
                  <p className="font-medium text-foreground">{formatDuration(call.duration)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge className={
                    call.status === "completed"
                      ? "bg-success/10 text-success border-0 mt-0.5"
                      : call.status === "missed"
                      ? "bg-destructive/10 text-destructive border-0 mt-0.5"
                      : "bg-accent text-accent-foreground border-0 mt-0.5"
                  }>{call.status ?? "—"}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="font-medium text-foreground">{formatDate(call.created_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Intent</p>
                  <p className="font-medium text-foreground capitalize">{call.intent ?? "—"}</p>
                </div>
                {call.agent && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs">Agent</p>
                    <p className="font-medium text-foreground">{call.agent.name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recording */}
          {call.recording_url && (
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
                  <span className="text-sm text-muted-foreground tabular-nums">{formatDuration(call.duration)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Summary */}
          {call.summary && (
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-base">AI Summary</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{call.summary}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Transcript */}
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-base">Call Transcript</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {transcript.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No transcript available</p>
            ) : (
              transcript.map((m, i) => {
                const isUser = m.speaker === "user";
                const msgText = m.text ?? m.message ?? "";
                return (
                  <div key={i} className={`flex items-start gap-2 ${isUser ? "justify-start" : "justify-end"}`}>
                    {isUser && (
                      <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          <User className="w-3.5 h-3.5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      isUser ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                    }`}>
                      <p className="text-[10px] font-semibold opacity-70 mb-1">{m.author ?? (isUser ? "User" : "AI")}</p>
                      <p>{msgText}</p>
                    </div>
                    {!isUser && (
                      <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">AI</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
