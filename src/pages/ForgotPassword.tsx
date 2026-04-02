import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Headphones, Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Reset link sent");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <Headphones className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
          <p className="text-muted-foreground">We'll send you a reset link</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            {sent ? (
              <div className="text-center space-y-3 py-4">
                <CheckCircle className="w-12 h-12 text-primary mx-auto" />
                <p className="font-medium">Check your email</p>
                <p className="text-sm text-muted-foreground">We've sent a password reset link to your email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="you@example.com" className="pl-9" type="email" required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send Reset Link
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        <div className="text-center">
          <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
