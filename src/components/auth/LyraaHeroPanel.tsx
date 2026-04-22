function LyraaWordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <g transform="translate(4, 14)">
          <rect x="0" y="-3" width="2.5" height="6" rx="1.25" fill="hsl(var(--primary))" />
          <rect x="5" y="-7" width="2.5" height="14" rx="1.25" fill="hsl(var(--primary-glow))" />
          <rect x="10" y="-10" width="2.5" height="20" rx="1.25" fill="hsl(var(--primary))" />
          <rect x="15" y="-5" width="2.5" height="10" rx="1.25" fill="hsl(var(--primary-glow))" />
          <rect x="20" y="-8" width="2.5" height="16" rx="1.25" fill="hsl(var(--primary))" />
        </g>
      </svg>
      <span className="font-bold text-[20px] text-foreground tracking-tight lowercase">lyraa</span>
    </div>
  );
}

function LiveCallCard() {
  const bars = [18, 32, 48, 28, 42, 54, 30, 20, 38, 50, 26, 40, 58, 32, 22, 36, 48, 28, 18, 34, 44, 52, 30, 20, 38, 42, 26, 16, 32, 48, 36, 24, 14, 20];
  return (
    <div className="bg-card rounded-2xl border border-[hsl(var(--primary)/0.15)] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center relative">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="absolute inset-[-4px] rounded-full border-2 border-primary/40 animate-ping" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-tight">Lyraa</p>
            <p className="text-[11px] text-muted-foreground">Answering for Elite Electrical</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-destructive/10 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-[10px] font-medium text-destructive font-mono tracking-wider">LIVE 00:34</span>
        </div>
      </div>

      <div className="flex items-end justify-center gap-[2px] h-16 mb-5">
        {bars.map((h, i) => {
          const colorClass =
            h >= 44 ? "bg-primary" : h >= 28 ? "bg-primary/70" : "bg-primary/40";
          return (
            <div
              key={i}
              className={`w-[3px] rounded-sm ${colorClass}`}
              style={{
                height: `${h}px`,
                animation: `waveform ${1.4 + (i % 5) * 0.15}s ease-in-out ${i * 0.04}s infinite`,
                transformOrigin: "bottom",
              }}
            />
          );
        })}
      </div>

      <div className="bg-accent rounded-xl px-4 py-3 mb-2.5">
        <p className="text-[10px] uppercase tracking-[1px] font-medium text-primary mb-1">Lyraa</p>
        <p className="text-sm text-foreground leading-relaxed">
          "No worries at all, Tom. I've got you booked for Tuesday at 2pm. Dave will give you a call when he's 20 minutes out."
        </p>
      </div>

      <div className="bg-muted rounded-xl px-4 py-3">
        <p className="text-[10px] uppercase tracking-[1px] font-medium text-muted-foreground mb-1">Tom (caller)</p>
        <p className="text-sm text-foreground/90 leading-relaxed">"That's perfect, thanks mate."</p>
      </div>
    </div>
  );
}

export default function LyraaHeroPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-[hsl(var(--auth-panel))] flex-col justify-between p-10">
      <div className="flex items-center justify-between">
        <LyraaWordmark />
        <div className="inline-flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-[hsl(var(--primary)/0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-[10px] font-medium text-foreground tracking-[0.5px] font-mono">BUILT IN MELBOURNE</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-lg py-10">
        <h2 className="text-[40px] font-bold text-foreground leading-[1.05] tracking-[-0.04em]">
          The AI receptionist
          <br />
          that actually{" "}
          <span className="text-primary italic font-bold">sounds human.</span>
        </h2>
        <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed max-w-md">
          Lyraa answers every call, books every job, and follows up on every lead — in a voice your customers won't know is AI.
        </p>

        <div className="mt-8">
          <LiveCallCard />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="font-mono tracking-wider">LYRAA · A HYPERION TECH PRODUCT</span>
        <span>© 2026</span>
      </div>
    </div>
  );
}
