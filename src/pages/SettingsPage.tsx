import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success("Settings saved"); }, 1200);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 bg-warning text-warning-foreground">
              <AvatarFallback className="text-xl bg-warning text-warning-foreground">AH</AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={() => { setAvatarLoading(true); setTimeout(() => { setAvatarLoading(false); toast.success("Avatar updated"); }, 1200); }} disabled={avatarLoading}>
              {avatarLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Change Avatar
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input defaultValue="Anwar Hassan" /></div>
            <div><Label>Email</Label><Input defaultValue="anwar@vernal.ai" type="email" /></div>
            <div><Label>Company</Label><Input defaultValue="Vernal Inc." /></div>
            <div><Label>Phone</Label><Input defaultValue="+1 (555) 000-0000" /></div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Subscription & Billing</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pro Plan</p>
              <p className="text-sm text-muted-foreground">$49/month</p>
            </div>
            <Button variant="outline" onClick={() => toast.success("Plan change initiated")}>Change Plan</Button>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium">Payment Method</p>
              <p className="text-sm text-muted-foreground">Visa ending in 4242 · Exp 12/2025</p>
            </div>
            <Button variant="outline" onClick={() => toast.success("Payment update initiated")}>Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
