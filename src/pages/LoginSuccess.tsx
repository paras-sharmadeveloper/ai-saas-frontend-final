import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";

/**
 * Landing page for Google OAuth callback.
 * Backend redirects to: /login-success?token=xxx
 * This page saves the token, fetches the user, then redirects to dashboard.
 */
export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Save token first so the API interceptor picks it up
    localStorage.setItem("token", token);

    // Fetch user profile with the token
    api
      .get("/user", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        dispatch(loginSuccess({ token, user: res.data }));
        navigate("/admin/dashboard", { replace: true });
      })
      .catch(() => {
        // If user fetch fails, still log in with token only
        dispatch(loginSuccess({ token, user: null }));
        navigate("/admin/dashboard", { replace: true });
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
