import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { settingsService, type UserProfile } from "@/services/settingsService";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    company_name: "",
    phone_number: "",
    profile_pic: "",
  });
  const [picFile, setPicFile] = useState<File | null>(null);
  const [picPreview, setPicPreview] = useState<string>("");

  const [pw, setPw] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  // Load profile on mount
  useEffect(() => {
    settingsService
      .getProfile()
      .then((data) => {
        setProfile(data);
        if (data.profile_pic_url) setPicPreview(data.profile_pic_url);
        else if (data.profile_pic) setPicPreview(data.profile_pic);
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPicFile(file);
    setPicPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await settingsService.updateProfile({
        ...profile,
        ...(picFile ? { profile_pic: picFile } : {}),
      });
      setProfile(updated);
      if (updated.profile_pic_url) setPicPreview(updated.profile_pic_url);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.new_password !== pw.new_password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPw(true);
    try {
      await settingsService.changePassword(pw);
      toast.success("Password updated");
      setPw({ old_password: "", new_password: "", new_password_confirmation: "" });
    } catch {
      toast.error("Failed to update password");
    } finally {
      setChangingPw(false);
    }
  };

  const initials = profile.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Left: Profile Settings */}
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-base">Profile Settings</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                {picPreview ? (
                  <img
                    src={picPreview}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <span className="text-primary text-xl font-bold">{initials}</span>
                )}
              </div>
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG. Max 2MB.</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Company</Label>
                <Input
                  value={profile.company_name}
                  onChange={(e) => setProfile((p) => ({ ...p, company_name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={profile.phone_number}
                  onChange={(e) => setProfile((p) => ({ ...p, phone_number: e.target.value }))}
                />
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Right: Change Password */}
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={pw.old_password}
                  onChange={(e) => setPw((p) => ({ ...p, old_password: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={pw.new_password}
                  onChange={(e) => setPw((p) => ({ ...p, new_password: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={pw.new_password_confirmation}
                  onChange={(e) => setPw((p) => ({ ...p, new_password_confirmation: e.target.value }))}
                />
              </div>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={changingPw}>
                {changingPw && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
