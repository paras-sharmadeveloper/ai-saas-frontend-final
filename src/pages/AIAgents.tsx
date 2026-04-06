import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2, Bot, HeadphonesIcon, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { aiAgentsService, type AIAgent } from "@/services/aiAgentsService";

const goalIcon = (goal: string) => {
  if (goal === "Lead Qualification") return Bot;
  if (goal === "Customer Support") return HeadphonesIcon;
  return ShoppingBag;
};

const goalLabel = (goal: string) => {
  if (goal === "Lead Qualification") return "Lead";
  if (goal === "Customer Support") return "Support";
  return "Sales";
};

const emptyForm = { name: "", goal: "Lead Qualification", tone: "Friendly" };

export default function AIAgents() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editAgent, setEditAgent] = useState<AIAgent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AIAgent | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [questions, setQuestions] = useState<string[]>([""]);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([{ q: "", a: "" }]);

  const fetchAgents = () =>
    aiAgentsService.getAll().then(setAgents).catch(() => toast.error("Failed to load agents"));

  useEffect(() => {
    fetchAgents().finally(() => setPageLoading(false));
  }, []);

  const openCreate = () => {
    setEditAgent(null);
    setForm(emptyForm);
    setQuestions([""]);
    setFaqs([{ q: "", a: "" }]);
    setDialogOpen(true);
  };

  const openEdit = (agent: AIAgent) => {
    setEditAgent(agent);
    setForm({ name: agent.name, goal: agent.goal, tone: agent.tone });
    // populate questions — ensure at least one empty row
    setQuestions(agent.questions && agent.questions.length > 0 ? [...agent.questions] : [""]);
    // populate faqs — ensure at least one empty row
    setFaqs(agent.faqs && agent.faqs.length > 0 ? [...agent.faqs] : [{ q: "", a: "" }]);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload: Omit<AIAgent, "id"> = {
      ...form,
      status: editAgent?.status ?? "Active",
      questions: questions.filter(Boolean),
      faqs: faqs.filter((f) => f.q || f.a),
    };
    try {
      if (editAgent?.id) {
        await aiAgentsService.update(String(editAgent.id), payload);
        toast.success("Agent updated");
      } else {
        await aiAgentsService.create(payload);
        toast.success("Agent created");
      }
      setDialogOpen(false);
      await fetchAgents(); // re-fetch to get exact server data
    } catch {
      toast.error("Failed to save agent");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await aiAgentsService.delete(String(deleteTarget.id));
      setAgents((prev) => prev.filter((a) => String(a.id) !== String(deleteTarget.id)));
      toast.success("Agent deleted");
    } catch {
      toast.error("Failed to delete agent");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Agents</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure your AI voice agents</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1.5" /> New Agent</Button>
      </div>

      {/* Empty state */}
      {agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bot className="w-12 h-12 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">No agents found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Create your first AI agent to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((a) => {
            const Icon = goalIcon(a.goal);
            return (
              <Card key={a.id} className="shadow-sm">
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
                  <p className="text-sm text-muted-foreground mb-4">{a.calls ?? 0} calls handled</p>
                  <div className="flex items-center justify-end gap-1.5 border-t border-border pt-3">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(a)}>
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDeleteTarget(a)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editAgent ? "Edit Agent" : "Create New Agent"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Agent Name</Label>
              <Input
                placeholder="My AI Agent"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Goal</Label>
                <Select value={form.goal} onValueChange={(v) => setForm((f) => ({ ...f, goal: v }))}>
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
                <Select value={form.tone} onValueChange={(v) => setForm((f) => ({ ...f, tone: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Questions */}
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

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editAgent ? "Update Agent" : "Create Agent"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">"{deleteTarget?.name}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
