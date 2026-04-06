import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Phone, Mail, Plus, Pencil, Trash2, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { customersService, type Customer } from "@/services/customersService";

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const emptyForm = { name: "", email: "", phone: "" };

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchCustomers = () =>
    customersService.getAll().then(setCustomers).catch(() => toast.error("Failed to load customers"));

  useEffect(() => {
    fetchCustomers().finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? "").includes(search)
  );

  const openCreate = () => {
    setEditCustomer(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditCustomer(c);
    setForm({ name: c.name, email: c.email, phone: c.phone ?? "" });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editCustomer?.id) {
        await customersService.update(String(editCustomer.id), form);
        toast.success("Customer updated");
      } else {
        await customersService.create(form);
        toast.success("Customer created");
      }
      setDialogOpen(false);
      await fetchCustomers();
    } catch {
      toast.error("Failed to save customer");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await customersService.delete(String(deleteTarget.id));
      setCustomers((prev) => prev.filter((c) => String(c.id) !== String(deleteTarget.id)));
      toast.success("Customer deleted");
    } catch {
      toast.error("Failed to delete customer");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} customers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-9 w-64 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Customer
          </Button> */}
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground font-medium">No customers found</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                {search ? "Try a different search term" : "Add your first customer to get started"}
              </p>
            </div>
          ) : (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Calls</TableHead>
                  <TableHead>Status</TableHead>
                  {/* <TableHead className="text-right">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {getInitials(c.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" /> {c.phone || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" /> {c.email}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{c.total_calls ?? 0}</TableCell>
                    <TableCell>
                      <Badge className={
                        (c.status ?? "").toLowerCase() === "active"
                          ? "bg-success/10 text-success border-0"
                          : "bg-muted text-muted-foreground border-0"
                      }>
                        {c.status ?? "—"}
                      </Badge>
                    </TableCell>
                    {/* <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(c)}>
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDeleteTarget(c)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editCustomer ? "Edit Customer" : "Add Customer"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                placeholder="Full name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editCustomer ? "Update Customer" : "Add Customer"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
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
