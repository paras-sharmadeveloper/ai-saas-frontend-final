import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Play, Pause } from "lucide-react";
import { api } from "@/services/api";
import { API_ROUTES } from "@/services/apiRoutes";
import type { AITrainingState } from "./types";

type ToneItem = { id: number; name: string; description?: string };
type LanguageItem = { id: number; name: string };
type VoiceType = { id: number; name: string };
type VoiceItem = {
  id: number;
  name: string;
  style?: string;
  audio_url?: string;
  voice_type?: VoiceType;
  voice_type_id?: number;
  elevenlabs_voice_id?: string;
};
type Props = {
  state: AITrainingState;
  update: <K extends keyof AITrainingState>(key: K, value: AITrainingState[K]) => void;
};

export function ToneStep({ state, update }: Props) {
  const [tones, setTones] = useState<ToneItem[]>([
    { id: 1, name: "Friendly", description: "Warm and approachable" },
    { id: 2, name: "Professional", description: "Formal and business-like" },
    { id: 3, name: "Casual", description: "Relaxed and conversational" },
  ]);
  const [languages, setLanguages] = useState<LanguageItem[]>([
    { id: 1, name: "en" },
    { id: 2, name: "hi" },
  ]);
  const [voiceTypes, setVoiceTypes] = useState<VoiceType[]>([
    { id: 1, name: "Female" },
    { id: 2, name: "Male" },
  ]);
  const [voices, setVoices] = useState<VoiceItem[]>([
    { id: 1, name: "Sarah", style: "American, warm", voice_type_id: 1 },
    { id: 2, name: "Emily", style: "British, professional", voice_type_id: 1 },
    { id: 3, name: "Priya", style: "Indian, friendly", voice_type_id: 1 },
    { id: 4, name: "James", style: "American, confident", voice_type_id: 2 },
    { id: 5, name: "Oliver", style: "British, calm", voice_type_id: 2 },
    { id: 6, name: "Raj", style: "Indian, energetic", voice_type_id: 2 },
  ]);
  const [selectedTypeId, setSelectedTypeId] = useState<number>(1);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    Promise.all([
      api.get(API_ROUTES.tones.base).then(r => r.data),
      api.get(API_ROUTES.languages.base).then(r => r.data),
      api.get(API_ROUTES.voiceTypes.base).then(r => r.data),
      api.get(API_ROUTES.voices.base).then(r => r.data),
    ]).then(([t, l, vt, v]) => {
      const tonesArr = Array.isArray(t) ? t : t?.data ?? [];
      const langsArr = Array.isArray(l) ? l : l?.data ?? [];
      const typesArr = Array.isArray(vt) ? vt : vt?.data ?? [];

      if (tonesArr.length) setTones(tonesArr);
      if (langsArr.length) setLanguages(langsArr);
      if (typesArr.length) {
        setVoiceTypes(typesArr);
        setSelectedTypeId(typesArr[0].id);
      }

      const raw = v?.voices ?? v?.data?.voices ?? {};
      const allVoices = [
        ...(raw.female ?? []),
        ...(raw.male ?? []),
      ].map(voice => ({
        ...voice,
        name: voice.name?.split(" - ")[0] ?? voice.name,
        style: voice.name?.split(" - ")[1] ?? voice.style ?? "",
      }));

      if (allVoices.length) setVoices(allVoices);

    }).catch(() => { });
  }, []);


  const filteredVoices = voices.filter(v =>
    (v.voice_type?.id ?? v.voice_type_id) === selectedTypeId
  );

  const togglePlay = (v: VoiceItem) => {
    if (playingId === v.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (v.audio_url) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(v.audio_url);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingId(null);
      setPlayingId(v.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tone */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Tone</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {tones.map(t => (
            <button
              key={t.id}
              onClick={() => update("tone", t.name.toLowerCase())}
              className={`p-4 rounded-xl border-2 text-left transition-all ${state.tone === t.name.toLowerCase()   //  both lowercase = safe compare
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40"
                }`}
            >
              <div className="font-semibold text-sm">{t.name}</div>
              {t.description && (
                <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Language</p>
        <div className="flex gap-2 flex-wrap">
          {languages.map(l => (
            <button
              key={l.id}
              onClick={() => update("language", l.name.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${state.language === l.name.toLowerCase()
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/40 text-muted-foreground"
                }`}
            >
              {l.name}
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
          onChange={e => update("agentName", e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>

      {/* Voice Selection */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Voice</p>
        <div className="flex gap-2 mb-3 flex-wrap">
          {voiceTypes.map(vt => (
            <button
              key={vt.id}
              onClick={() => setSelectedTypeId(vt.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedTypeId === vt.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {vt.name} Voices
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredVoices.map(v => (
            <button
              key={v.id}
              onClick={() => update("selectedVoiceId", v.elevenlabs_voice_id!)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${state.selectedVoiceId === v.elevenlabs_voice_id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40"
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{v.name}</span>
                {v.audio_url && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={e => { e.stopPropagation(); togglePlay(v); }}
                    onKeyDown={e => e.key === "Enter" && togglePlay(v)}
                    className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors cursor-pointer"
                  >
                    {playingId === v.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </div>
                )}
              </div>
              {v.style && <span className="text-xs text-muted-foreground">{v.style}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
