import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Axios from "@/utils/Axios";
import { useSelector } from "react-redux";
import LyraaHeroPanel from "@/components/auth/LyraaHeroPanel";

export default function VerifyEmail() {
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const navigate = useNavigate();
    const token = useSelector((state: any) => state.auth.token);

    // Agar token nahi hai toh signup pe bhejo
    useEffect(() => {
        if (!token) navigate("/signup");
    }, []);

    // Cooldown timer
    useEffect(() => {
        if (cooldown === 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleResend = async () => {
        setLoading(true);
        try {
            await Axios.post("/email/resend");
            toast.success("Verification email sent!");
            setCooldown(60); // 60 second cooldown
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to resend email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <LyraaHeroPanel />

            <div className="flex-1 flex items-center justify-center p-6 bg-background">
                <div className="w-full max-w-md space-y-8 text-center">

                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail className="w-10 h-10 text-primary" />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="space-y-3">
                        <h1 className="text-2xl font-bold text-foreground">Check your inbox</h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            We've sent a verification link to your email address.
                            <br />
                            Click the link to activate your account.
                        </p>
                    </div>

                    {/* Resend Button */}
                    <Button
                        onClick={handleResend}
                        disabled={loading || cooldown > 0}
                        className="w-full h-12 rounded-xl text-base font-semibold"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
                    </Button>

                    {/* Back to login */}
                    <p className="text-sm text-muted-foreground">
                        Already verified?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-primary font-medium hover:underline cursor-pointer"
                        >
                            Login
                        </span>
                    </p>

                </div>
            </div>
        </div>
    );
}