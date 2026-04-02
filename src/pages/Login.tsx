import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Headphones, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function WaveformVisual() {
  const bars = Array.from({ length: 60 }, (_, i) => {
    const height = Math.sin(i * 0.3) * 40 + Math.random() * 30 + 20;
    const delay = i * 0.05;
    return (
      <div
        key={i}
        className="w-[3px] rounded-full bg-primary/60"
        style={{
          height: `${height}%`,
          animation: `waveform ${1.5 + Math.random()}s ease-in-out ${delay}s infinite`,
        }}
      />
    );
  });

  return (
    <div className="flex items-center justify-center gap-[2px] h-32 px-6">
      {bars}
    </div>
  );
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Signed in successfully");
      navigate("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Welcome */}
      <div className="hidden lg:flex lg:w-1/2 bg-[hsl(var(--auth-panel))] flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Headphones className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">Vernal</span>
          <span className="ml-auto text-sm text-muted-foreground font-medium">2026</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <h2 className="text-3xl font-bold text-foreground leading-tight">
            Welcome Back To Your Creative Workspace
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Access your projects, saved voices, and productivity tools in one secure and elegant platform.
          </p>

          {/* Audio card */}
          <div className="mt-8 bg-card rounded-2xl p-5 shadow-sm border border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground text-sm">Product Design Speech Recording Test</p>
                <p className="text-xs text-muted-foreground mt-1">12:54 &nbsp; 00:43 Original</p>
              </div>
            </div>
            <WaveformVisual />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-1">
              {["00:00", "00:01", "00:02", "00:03", "00:04", "00:05", "00:06", "00:07"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div />
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back
              <br />
              <span className="text-foreground">to vernal</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Register
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="paras@gmail.com"
                  className="pl-10 h-12 rounded-xl border-border bg-background"
                  type="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="••••••••"
                  className="pl-10 pr-12 h-12 rounded-xl border-border bg-background"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sign In
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-12 rounded-xl" type="button">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
