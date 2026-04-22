import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import LyraaHeroPanel from "@/components/auth/LyraaHeroPanel";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to send reset link";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — Lyraa hero */}
      <LyraaHeroPanel />

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              We'll send you a link to reset your password
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4 py-8">
              <CheckCircle className="w-14 h-14 text-primary mx-auto" />
              <h3 className="font-semibold text-lg text-foreground">Check your email</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                We've sent a password reset link to your email address. Click the link to set a new password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your email"
                    className="pl-10 h-12 rounded-xl"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link to="/login" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
