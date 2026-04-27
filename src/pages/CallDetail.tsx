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


  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  // Waveform bars (fake amplitude — real waveform ke liye Web Audio API chahiye)
  const BARS = 60;
  const waveHeights = useRef(
    Array.from({ length: BARS }, () => 20 + Math.random() * 80)
  );

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const handleWaveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * audioDuration;
  };

  const skip = (secs: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      Math.max(0, audioRef.current.currentTime + secs),
      audioDuration
    );
  };




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
    ? `${call.recording_url}`
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
          {/* Recording Card */}
          {recordingUrl && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Recording</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <audio
                  ref={audioRef}
                  src={recordingUrl}
                  onEnded={() => setPlaying(false)}
                  onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
                  onLoadedMetadata={() => setAudioDuration(audioRef.current?.duration ?? 0)}
                  className="hidden"
                />

                {/* Controls Row */}
                <div className="flex items-center justify-between">
                  {/* Left: Skip back + Play + Skip forward */}
                  <div className="flex items-center gap-3">
                    {/* Skip Back 10s */}
                    <button
                      onClick={() => skip(-10)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                        <text x="7" y="15" fontSize="5" fill="currentColor">10</text>
                      </svg>
                    </button>

                    {/* Play / Pause */}
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors shrink-0"
                    >
                      {playing
                        ? <Pause className="w-5 h-5 text-primary-foreground" />
                        : <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                      }
                    </button>

                    {/* Skip Forward 10s */}
                    <button
                      onClick={() => skip(10)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
                        <text x="7" y="15" fontSize="5" fill="currentColor">10</text>
                      </svg>
                    </button>
                  </div>

                  {/* Right: Time */}
                  <p className="text-sm font-medium tabular-nums text-foreground">
                    {formatTime(currentTime)}
                    <span className="text-muted-foreground"> / {formatTime(audioDuration)}</span>
                  </p>
                </div>

                {/* Waveform */}
                <div
                  className="flex items-center gap-[2px] h-16 cursor-pointer group"
                  onClick={handleWaveClick}
                >
                  {waveHeights.current.map((h, i) => {
                    const progress = audioDuration ? currentTime / audioDuration : 0;
                    const played = i / BARS < progress;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-colors ${played
                            ? "bg-primary"
                            : "bg-primary/20 group-hover:bg-primary/30"
                          }`}
                        style={{ height: `${h}%` }}
                      />
                    );
                  })}
                </div>

                {/* Time labels */}
                <div className="flex justify-between text-[11px] text-muted-foreground -mt-2">
                  <span>0:00</span>
                  <span>{formatTime(audioDuration)}</span>
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
                    <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${isUser ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
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
