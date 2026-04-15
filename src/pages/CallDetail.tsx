import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, User, Bot, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { callsService, type Call } from "@/services/callsService";

export default function CallDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!id) return;
    callsService
      .getById(id)
      .then(setCall)
      .catch(() => toast.error("Failed to load call details"))
      .finally(() => setLoading(false));
  }, [id]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

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
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigate("/calls")}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Calls
        </Button>
      </div>
    );
  }

  const customerName = call.customer?.name ?? call.customer_name ?? "Unknown";
  const customerPhone = call.customer?.phone ?? call.phone ?? "—";
  const transcript = call.transcript ?? call.messages ?? [];
  const recordingUrl = call.recording_url
    ? `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "")}${call.recording_url}`
    : null;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/calls")} className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Calls
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Call Details</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Call with {customerName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
        {/* Left: Info */}
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Call Info</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-muted"><User className="w-5 h-5 text-muted-foreground" /></AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{customerName}</p>
                  <p className="text-xs text-muted-foreground">{customerPhone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm pt-1">
                <div><p className="text-xs text-muted-foreground">Intent</p>
                  <Badge className={
                    call.intent === "lead" ? "bg-green-100 text-green-700 border-0 mt-0.5 capitalize" :
                    call.intent === "complaint" ? "bg-red-100 text-red-700 border-0 mt-0.5 capitalize" :
                    "bg-blue-100 text-blue-700 border-0 mt-0.5 capitalize"
                  }>{call.intent ?? "—"}</Badge>
                </div>
                <div><p className="text-xs text-muted-foreground">Status</p>
                  <Badge className="bg-success/10 text-success border-0 mt-0.5 capitalize">{call.status ?? "—"}</Badge>
                </div>
                <div><p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium">{call.duration ?? "—"}</p>
                </div>
                <div><p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{call.date ?? call.created_at ?? "—"}</p>
                </div>
                <div><p className="text-xs text-muted-foreground">Language</p>
                  <p className="font-medium uppercase">{call.language ?? "—"}</p>
                </div>
                {/* <div><p className="text-xs text-muted-foreground">Cost</p>
                  <p className="font-medium">{call.cost ? `$${call.cost}` : "—"}</p>
                </div> */}
                {call.agent && (
                  <div className="col-span-2"><p className="text-xs text-muted-foreground">Agent</p>
                    <p className="font-medium">{call.agent.name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recording */}
          {recordingUrl && (
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-base">Recording</CardTitle></CardHeader>
              <CardContent>
                <audio ref={audioRef} src={recordingUrl} onEnded={() => setPlaying(false)} className="hidden" />
                <div className="flex items-center gap-3">
                  <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 shrink-0" onClick={togglePlay}>
                    {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <p className="text-sm text-muted-foreground">{call.duration ?? ""}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {call.summary && (
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-base">AI Summary</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{call.summary}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Transcript — user LEFT, agent RIGHT */}
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-base">Call Transcript</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {transcript.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No transcript available</p>
            ) : (
              transcript.map((m, i) => {
                const role = m.role ?? (m.speaker === "ai" ? "agent" : m.speaker);
                const isUser = role === "user";
                const text = m.message ?? m.text ?? "";
                const timeLabel = typeof m.time === "number"
                  ? `${Math.floor(m.time / 60)}:${String(m.time % 60).padStart(2, "0")}`
                  : "";

                return (
                  <div key={i} className={`flex items-end gap-2 ${isUser ? "justify-start" : "justify-end"}`}>
                    {isUser && (
                      <Avatar className="w-7 h-7 shrink-0">
                        <AvatarFallback className="bg-muted"><User className="w-3.5 h-3.5 text-muted-foreground" /></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${
                      isUser ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                    }`}>
                      <p className="text-[10px] font-semibold opacity-60 mb-0.5">{isUser ? "User" : "Agent"}{timeLabel && ` · ${timeLabel}`}</p>
                      <p className="leading-relaxed">{text}</p>
                    </div>
                    {!isUser && (
                      <Avatar className="w-7 h-7 shrink-0">
                        <AvatarFallback className="bg-primary/10"><Bot className="w-3.5 h-3.5 text-primary" /></AvatarFallback>
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
