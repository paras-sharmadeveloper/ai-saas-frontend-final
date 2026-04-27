import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AudioPlayerProps {
    src: string;
    className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BARS = 60;

function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
}

function generateWaveHeights(): number[] {
    return Array.from({ length: BARS }, () => 20 + Math.random() * 80);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AudioPlayer({ src, className = "" }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const waveHeights = useRef<number[]>(generateWaveHeights());

    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Reset when src changes
    useEffect(() => {
        setPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        waveHeights.current = generateWaveHeights();
    }, [src]);

    // ── Controls ──────────────────────────────────────────────────────────────

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            audioRef.current.play();
            setPlaying(true);
        }
    };

    const skip = (secs: number) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = Math.min(
            Math.max(0, audioRef.current.currentTime + secs),
            duration
        );
    };

    const handleWaveClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = ratio * duration;
    };

    // ── Render ────────────────────────────────────────────────────────────────

    const progress = duration ? currentTime / duration : 0;

    return (
        <div className={`space-y-3 ${className}`}>
            <audio
                ref={audioRef}
                src={src}
                onEnded={() => setPlaying(false)}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                className="hidden"
            />

            {/* Controls + Time */}
            <div className="flex items-center justify-between">
                {/* Skip Back + Play + Skip Forward */}
                <div className="flex items-center gap-3">
                    {/* Skip Back 10s */}
                    <button
                        onClick={() => skip(-10)}
                        title="Back 10s"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <SkipBackIcon />
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
                        title="Forward 10s"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <SkipForwardIcon />
                    </button>
                </div>

                {/* Time */}
                <p className="text-sm font-medium tabular-nums text-foreground">
                    {formatTime(currentTime)}
                    <span className="text-muted-foreground"> / {formatTime(duration)}</span>
                </p>
            </div>

            {/* Waveform */}
            <div
                className="flex items-center gap-[2px] h-14 cursor-pointer group"
                onClick={handleWaveClick}
            >
                {waveHeights.current.map((h, i) => (
                    <div
                        key={i}
                        className={`flex-1 rounded-full transition-colors duration-75 ${i / BARS < progress
                                ? "bg-primary"
                                : "bg-primary/20 group-hover:bg-primary/30"
                            }`}
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>

            {/* Time Labels */}
            <div className="flex justify-between text-[11px] text-muted-foreground -mt-1">
                <span>0:00</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
}

// ─── Skip Icons ──────────────────────────────────────────────────────────────

function SkipBackIcon() {
    return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
            <text x="7.5" y="14" fontSize="5.5" fill="currentColor" stroke="none" fontWeight="600">10</text>
        </svg>
    );
}

function SkipForwardIcon() {
    return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-.49-3.51" />
            <text x="7.5" y="14" fontSize="5.5" fill="currentColor" stroke="none" fontWeight="600">10</text>
        </svg>
    );
}
