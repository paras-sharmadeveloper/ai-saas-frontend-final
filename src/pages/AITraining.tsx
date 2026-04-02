import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

const initialMessages: { role: "ai" | "user"; text: string }[] = [
  { role: "ai", text: "Hi there! Welcome to Vernal. How can I help you today?" },
];

export default function AITraining() {
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState(["What is your budget?", "When do you need this?"]);
  const [faqs, setFaqs] = useState([{ q: "What are your hours?", a: "We're available 24/7." }]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success("Configuration saved"); }, 1300);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: "user" as const, text: input }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "ai" as const, text: "Thanks for that! Based on our services, I'd recommend scheduling a quick call to discuss your needs further." }]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Training</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure how your AI agent behaves and responds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Config */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Basic Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5"><Label>AI Name</Label><Input defaultValue="Vernal Assistant" /></div>
              <div className="space-y-1.5"><Label>Greeting Message</Label><Input defaultValue="Hi there! Welcome to Vernal. How can I help you today?" /></div>
              <div className="space-y-1.5"><Label>Closing Message</Label><Input defaultValue="Thanks for chatting! Have a great day." /></div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Company Context</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5"><Label>Company Description</Label><Textarea defaultValue="Vernal is an AI-powered voice agent platform." /></div>
              <div className="space-y-1.5"><Label>Services Offered</Label><Textarea defaultValue="AI voice agents, lead qualification, customer support automation" /></div>
              <div className="space-y-1.5"><Label>Target Audience</Label><Input defaultValue="Small to medium businesses" /></div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">AI Behavior</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Tone</Label>
                <Select defaultValue="friendly"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="friendly">Friendly</SelectItem><SelectItem value="professional">Professional</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Goal</Label>
                <Select defaultValue="lead"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="lead">Lead Qualification</SelectItem><SelectItem value="support">Support</SelectItem><SelectItem value="sales">Sales</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Response Style</Label>
                <Select defaultValue="concise"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="concise">Short & Concise</SelectItem><SelectItem value="detailed">Detailed & Thorough</SelectItem></SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Qualifying Questions</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setQuestions((q) => [...q, ""])}><Plus className="w-3 h-3 mr-1" /> Add</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {questions.map((q, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={q} onChange={(e) => { const nq = [...questions]; nq[i] = e.target.value; setQuestions(nq); }} />
                  <Button size="icon" variant="outline" onClick={() => setQuestions((qs) => qs.filter((_, j) => j !== i))}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">FAQ / Knowledge Base</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setFaqs((f) => [...f, { q: "", a: "" }])}><Plus className="w-3 h-3 mr-1" /> Add</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <Input placeholder="Question" value={f.q} onChange={(e) => { const nf = [...faqs]; nf[i] = { ...nf[i], q: e.target.value }; setFaqs(nf); }} />
                  <Input placeholder="Answer" value={f.a} onChange={(e) => { const nf = [...faqs]; nf[i] = { ...nf[i], a: e.target.value }; setFaqs(nf); }} />
                  <Button size="icon" variant="outline" onClick={() => setFaqs((fs) => fs.filter((_, j) => j !== i))}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Advanced</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <Label>Custom AI Instructions</Label>
                <Textarea className="min-h-[100px]" placeholder="Add any custom instructions for your AI agent..." />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Configuration
          </Button>
        </div>

        {/* Right: Chat Preview */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm sticky top-20 h-[600px] flex flex-col">
            <CardHeader className="border-b shrink-0"><CardTitle className="text-base">Chat Preview</CardTitle></CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground rounded-2xl px-3.5 py-2 text-sm italic">AI is typing...</div>
                </div>
              )}
            </CardContent>
            <div className="border-t p-3 flex gap-2 shrink-0">
              <Input placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="h-9" />
              <Button size="icon" onClick={sendMessage} className="shrink-0 h-9 w-9"><Send className="w-4 h-4" /></Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
