import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const initialAgents = [
  { name: "Lead Qualifier Bot", type: "Lead", status: "Active" },
  { name: "Customer Support Agent", type: "Support", status: "Active" },
  { name: "Sales Assistant", type: "Sales", status: "Inactive" },
];

export default function AIAgents() {
  const [agents, setAgents] = useState(initialAgents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    setTimeout(() => {
      setAgents((prev) => [...prev, { name: fd.get("name") as string, type: fd.get("type") as string, status: "Active" }]);
      setLoading(false);
      setDialogOpen(false);
      toast.success("Agent created");
    }, 1200);
  };

  const handleDelete = (idx: number) => {
    setAgents((prev) => prev.filter((_, i) => i !== idx));
    toast.success("Agent deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Agents</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Agent</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Agent</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Agent Name</Label>
                <Input name="name" placeholder="My AI Agent" required />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select name="type" defaultValue="Lead Qualification">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead Qualification</SelectItem>
                    <SelectItem value="Support">Customer Support</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Agent
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((a, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell><Badge variant="secondary">{a.type}</Badge></TableCell>
                  <TableCell>
                    <Badge className={a.status === "Active" ? "bg-success/10 text-success border-0" : "bg-muted text-muted-foreground border-0"}>
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline"><Pencil className="w-3 h-3" /></Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(i)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
