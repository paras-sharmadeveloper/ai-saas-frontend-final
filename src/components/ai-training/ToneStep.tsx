import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Pause, Loader2 } from "lucide-react";
import type { AITrainingState } from "./types";

const TONE_OPTIONS = [
  { id: "friendly", label: "Friendly", desc: "Warm and approachable" },
  { id: "professional", label: "Professional", desc: "Formal and business-like" },
  { id: "casual", label: "Casual", desc: "Relaxed and conversational" },
];

const LANGUAGES = [
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
  { id: "hinglish", label: "Hinglish" },
];

type VoiceInfo = { voice_id: string; name: string; gender: string; accent: string; preview_url?: string };

const MOCK_VOICES: VoiceInfo[] = [
  { voice_id: "v1", name: "Sarah", gender: "female", accent: "American, warm", preview_url: "" },
  { voice_id: "v2", name: "Emily", gender: "female", accent: "British, professional", preview_url: "" },
  { voice_id: "v3", name: "Priya", gender: "female", accent: "Indian, friendly", preview_url: "" },
  { voice_id: "v4", name: "James", gender: "male", accent: "American, confident", preview_url: "" },
  { voice_id: "v5", name: "Oliver", gender: "male", accent: "British, calm", preview_url: "" },
  { voice_id: "v6", name: "Raj", gender: "male", accent: "Indian, energetic", preview_url: "" },
];

type Props = {
  state: AITrainingState;
  update: <K extends keyof AITrainingState>(key: K, value: AITrainingState[K]) => void;
};

export function ToneStep({ state, update }: Props) {
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(true);
  const [voiceError, setVoiceError] = useState(false);
  const [voiceTab, setVoiceTab] = useState<"female" | "male">("female");
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to GET /api/elevenlabs/voices
    const timer = setTimeout(() => {
      setVoices(MOCK_VOICES);
      setLoadingVoices(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredVoices = voices.filter((v) => v.gender === voiceTab);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Tone */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Tone</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TONE_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => update("tone", t.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                state.tone === t.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="font-semibold text-sm">{t.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Language</p>
        <div className="flex gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => update("language", l.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                state.language === l.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/40 text-muted-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Name */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Agent Name</p>
        <Input
          placeholder="What should the agent call itself? (e.g. Aria, Max)"
          value={state.agentName}
          onChange={(e) => update("agentName", e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>

      {/* Voice Selection */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Voice</p>
        <div className="flex gap-2 mb-3">
          {(["female", "male"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setVoiceTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                voiceTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab === "female" ? "Female Voices" : "Male Voices"}
            </button>
          ))}
        </div>

        {loadingVoices ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : voiceError ? (
          <div className="p-4 border border-destructive/30 rounded-xl text-sm text-destructive text-center">
            Unable to load voices, please try again
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredVoices.map((v) => (
              <button
                key={v.voice_id}
                onClick={() => update("selectedVoiceId", v.voice_id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  state.selectedVoiceId === v.voice_id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{v.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePlay(v.voice_id); }}
                    className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                  >
                    {playingId === v.voice_id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">{v.accent}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
