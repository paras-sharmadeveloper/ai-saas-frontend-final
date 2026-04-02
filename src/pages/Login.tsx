import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, Lock, Loader2, Eye, EyeOff, Bot, PhoneIncoming, FileText, Send } from "lucide-react";
import { toast } from "sonner";
import Axios from "@/utils/Axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";
function CallWaveVisual() {
  const bars = Array.from({ length: 50 }, (_, i) => {
    const height = Math.sin(i * 0.25) * 35 + Math.random() * 25 + 20;
    const delay = i * 0.06;
    return (
      <div
        key={i}
        className="w-[3px] rounded-full bg-primary/60"
        style={{
          height: `${height}%`,
          animation: `waveform ${1.8 + Math.random()}s ease-in-out ${delay}s infinite`,
        }}
      />
    );
  });

  return (
    <div className="flex items-center justify-center gap-[2px] h-20 px-4">
      {bars}
    </div>
  );
}

export default function Login() {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await Axios.post("/login", {
        email: form.email,
        password: form.password,
      });

      const result = res.data;

      if (!result.token) {
        setMessage(result.message || "Invalid login response");
        setLoading(false);
        return;
      }

      // ✅ Redux store
      dispatch(
        loginSuccess({
          token: result.token,
          user: result.user,
        })
      );
      // ✅ direct redirect
      //navigate("/admin/dashboard");

    } catch (error) {
      const msg = error.response?.data?.message || "Login failed.";

      toast.error(msg);
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[hsl(var(--auth-panel))] flex-col justify-between p-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Vernal</span>
          </div>
          <span className="text-sm text-muted-foreground font-medium">AI Agent</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <h2 className="text-3xl font-bold text-foreground leading-tight">
            Your AI Agent That Never Misses A Call
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Vernal's AI agent picks up every call, answers intelligently, and sends you the transcript & recording via email — so you never miss a lead.
          </p>

          {/* Live call simulation card */}
          <div className="mt-8 bg-card rounded-2xl p-5 shadow-sm border border-border space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <PhoneIncoming className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Incoming Call — AI Answering</p>
                <p className="text-xs text-muted-foreground">+1 (555) 842-1923 • 00:47</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-primary">Live</span>
              </div>
            </div>

            <CallWaveVisual />

            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Bot, label: "AI Answers", desc: "24/7 availability" },
                { icon: FileText, label: "Transcript", desc: "Auto-generated" },
                { icon: Send, label: "Email", desc: "Instant delivery" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-accent rounded-xl p-3 text-center">
                  <Icon className="w-5 h-5 text-accent-foreground mx-auto mb-1.5" />
                  <p className="text-[11px] font-semibold text-foreground">{label}</p>
                  <p className="text-[9px] text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back
              <br />
              <span className="text-foreground">to Vernal</span>
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
                  placeholder="you@company.com"
                  className="pl-10 h-12 rounded-xl border-border bg-background"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sign In
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-3 text-muted-foreground">or</span></div>
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

            <Button variant="outline" className="w-full h-12 rounded-xl" type="button">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
