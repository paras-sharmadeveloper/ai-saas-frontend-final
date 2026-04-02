import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload, Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success("Settings saved"); }, 1200);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPw(true);
    setTimeout(() => { setChangingPw(false); toast.success("Password updated"); }, 1200);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">Profile Settings</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">AH</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG. Max 2MB.</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Full Name</Label><Input defaultValue="Anwar Hassan" /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input defaultValue="anwar@vernal.ai" type="email" /></div>
            <div className="space-y-1.5"><Label>Company</Label><Input defaultValue="Vernal Inc." /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+1 (555) 000-0000" /></div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            <div className="space-y-1.5"><Label>Current Password</Label><Input type="password" placeholder="••••••••" required /></div>
            <div className="space-y-1.5"><Label>New Password</Label><Input type="password" placeholder="••••••••" required /></div>
            <div className="space-y-1.5"><Label>Confirm New Password</Label><Input type="password" placeholder="••••••••" required /></div>
            <Button type="submit" variant="outline" disabled={changingPw}>
              {changingPw && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">API Keys</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={showApiKey ? "sk_live_vernal_abc123xyz789def456" : "sk_live_••••••••••••••••••••"}
              readOnly
              className="font-mono text-sm"
            />
            <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText("sk_live_vernal_abc123xyz789def456"); toast.success("Copied!"); }}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => toast.success("API key regenerated")}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Use this key to authenticate API requests. Keep it secret.</p>
        </CardContent>
      </Card>
    </div>
  );
}
