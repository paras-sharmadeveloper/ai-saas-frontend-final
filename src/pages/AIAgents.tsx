import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Bot, HeadphonesIcon, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface Agent {
  name: string;
  goal: string;
  tone: string;
  status: string;
  calls: number;
  questions: string[];
  faqs: { q: string; a: string }[];
}

const goalIcon = (goal: string) => {
  if (goal === "Lead Qualification") return Bot;
  if (goal === "Customer Support") return HeadphonesIcon;
  return ShoppingBag;
};

const initialAgents: Agent[] = [
  { name: "Sales Bot", goal: "Lead Qualification", tone: "Friendly", status: "Active", calls: 342, questions: ["What is your budget?"], faqs: [{ q: "Hours?", a: "24/7" }] },
  { name: "Support Agent", goal: "Customer Support", tone: "Professional", status: "Active", calls: 189, questions: ["What issue are you facing?"], faqs: [{ q: "Refund policy?", a: "30-day refund." }] },
  { name: "Booking Assistant", goal: "Sales", tone: "Friendly", status: "Draft", calls: 0, questions: [], faqs: [] },
];

export default function AIAgents() {
  const [agents, setAgents] = useState(initialAgents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([""]);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([{ q: "", a: "" }]);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    setTimeout(() => {
      setAgents((prev) => [...prev, {
        name: fd.get("name") as string,
        goal: fd.get("goal") as string || "Lead Qualification",
        tone: fd.get("tone") as string || "Friendly",
        status: "Active",
        calls: 0,
        questions: questions.filter(Boolean),
        faqs: faqs.filter((f) => f.q && f.a),
      }]);
      setLoading(false);
      setDialogOpen(false);
      setQuestions([""]);
      setFaqs([{ q: "", a: "" }]);
      toast.success("Agent created");
    }, 1200);
  };

  const handleDelete = (idx: number) => {
    setAgents((prev) => prev.filter((_, i) => i !== idx));
    toast.success("Agent deleted");
  };

  const goalLabel = (goal: string) => {
    if (goal === "Lead Qualification") return "Lead";
    if (goal === "Customer Support") return "Support";
    return "Sales";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Agents</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure your AI voice agents</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-1.5" /> New Agent</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create New Agent</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label>Agent Name</Label>
                <Input name="name" placeholder="My AI Agent" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Goal</Label>
                  <Select name="goal" defaultValue="Lead Qualification">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lead Qualification">Lead Qualification</SelectItem>
                      <SelectItem value="Customer Support">Customer Support</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Tone</Label>
                  <Select name="tone" defaultValue="Friendly">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dynamic Questions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Qualifying Questions</Label>
                  <Button type="button" size="sm" variant="outline" onClick={() => setQuestions((q) => [...q, ""])}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                {questions.map((q, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder={`Question ${i + 1}`}
                      value={q}
                      onChange={(e) => { const nq = [...questions]; nq[i] = e.target.value; setQuestions(nq); }}
                    />
                    {questions.length > 1 && (
                      <Button type="button" size="icon" variant="outline" onClick={() => setQuestions((qs) => qs.filter((_, j) => j !== i))}>
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* FAQs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>FAQs</Label>
                  <Button type="button" size="sm" variant="outline" onClick={() => setFaqs((f) => [...f, { q: "", a: "" }])}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                {faqs.map((f, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <Input placeholder="Question" value={f.q} onChange={(e) => { const nf = [...faqs]; nf[i] = { ...nf[i], q: e.target.value }; setFaqs(nf); }} />
                    <Input placeholder="Answer" value={f.a} onChange={(e) => { const nf = [...faqs]; nf[i] = { ...nf[i], a: e.target.value }; setFaqs(nf); }} />
                    {faqs.length > 1 && (
                      <Button type="button" size="icon" variant="outline" onClick={() => setFaqs((fs) => fs.filter((_, j) => j !== i))}>
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Agent
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((a, i) => {
          const Icon = goalIcon(a.goal);
          return (
            <Card key={i} className="shadow-sm">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{a.name}</h3>
                      <p className="text-xs text-muted-foreground">{goalLabel(a.goal)} · {a.tone}</p>
                    </div>
                  </div>
                  <Badge className={
                    a.status === "Active"
                      ? "bg-success/10 text-success border-0"
                      : "bg-muted text-muted-foreground border-0"
                  }>
                    {a.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{a.calls} calls handled</p>
                <div className="flex items-center justify-end gap-1.5 border-t border-border pt-3">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(i)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
