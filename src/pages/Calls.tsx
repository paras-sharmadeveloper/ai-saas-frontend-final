import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { callsService, type Call } from "@/services/callsService";

const filters = ["All", "Lead", "Support", "Complaint"];

const statusColor = (s: string) => {
  if (s?.toLowerCase() === "completed") return "bg-success/10 text-success border-0";
  if (s?.toLowerCase() === "missed") return "bg-destructive/10 text-destructive border-0";
  return "bg-accent text-accent-foreground border-0";
};

const getCustomerName = (c: Call) =>
  c.customer?.name ?? "—";

const getCustomerPhone = (c: Call) =>
  c.customer?.phone ?? c.to ?? "—";

const getType = (c: Call) => c.type ?? "—";

export default function Calls() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    callsService
      .getAll()
      .then(setCalls)
      .catch(() => toast.error("Failed to load calls"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = calls.filter((c) => {
    const name = getCustomerName(c).toLowerCase();
    if (filter !== "All" && getType(c) !== filter) return false;
    if (search && !name.includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calls</h1>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="rounded-lg">{f}</Button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customer..." className="pl-9 w-56 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <PhoneCall className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground font-medium">No calls found</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                {search ? "Try a different search term" : "Calls will appear here once they come in"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/admin/calls/${c.id}`)}
                  >
                    <TableCell className="font-medium">{getCustomerName(c)}</TableCell>
                    <TableCell className="text-muted-foreground">{getCustomerPhone(c)}</TableCell>
                    <TableCell><Badge variant="secondary">{getType(c)}</Badge></TableCell>
                    <TableCell><Badge className={statusColor(c.status ?? "")}>{c.status ?? "—"}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{c.created_at ?? "—"}</TableCell>
                    <TableCell>{c.duration ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
