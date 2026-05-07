import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, PhoneCall, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { callsService, type Call, type PaginatedCallsResponse } from "@/services/callsService";

const filters = ["All", "lead", "complaint", "service"];

const intentColor = (intent: string) => {
  const i = intent?.toLowerCase();
  if (i === "lead") return "bg-green-100 text-green-700 border-0";
  if (i === "complaint") return "bg-red-100 text-red-700 border-0";
  return "bg-blue-100 text-blue-700 border-0"; // service / other
};

const statusColor = (s: string) => {
  if (s?.toLowerCase() === "success" || s?.toLowerCase() === "completed") return "bg-success/10 text-success border-0";
  if (s?.toLowerCase() === "missed" || s?.toLowerCase() === "failed") return "bg-destructive/10 text-destructive border-0";
  return "bg-accent text-accent-foreground border-0";
};

const getCustomerName = (c: Call) =>
  c.customer?.name ?? c.customer_name ?? "—";

const getCustomerPhone = (c: Call) =>
  c.customer?.phone ?? c.phone ?? c.to ?? "—";

const getType = (c: Call) => c.intent ?? c.call_type ?? c.type ?? "—";

export default function Calls() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });
  const navigate = useNavigate();

  const loadCalls = (page = 1, searchTerm = search, filterType = filter) => {
    setLoading(true);
    callsService
      .getAll({
        page,
        per_page: 10,
        search: searchTerm || undefined,
        filter: filterType !== "All" ? filterType : undefined
      })
      .then((response: PaginatedCallsResponse) => {
        setCalls(response.data || []);
        setPagination({
          current_page: response.current_page,
          per_page: response.per_page,
          total: response.total,
          last_page: response.last_page
        });
      })
      .catch(() => {
        toast.error("Failed to load calls");
        setCalls([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCalls();
  }, []);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    loadCalls(1, search, newFilter);
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearch(searchTerm);
    loadCalls(1, searchTerm, filter);
  };

  const handlePageChange = (page: number) => {
    loadCalls(page, search, filter);
  };

  const filtered = calls; // Server-side filtering now

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
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => handleFilterChange(f)} className="rounded-lg">{f}</Button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search customer..." 
            className="pl-9 w-56 h-9" 
            value={search} 
            onChange={(e) => handleSearchChange(e.target.value)} 
          />
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
                    onClick={() => navigate(`/calls/${c.uuid}`)}
                  >
                    <TableCell className="font-medium">{getCustomerName(c)}</TableCell>
                    <TableCell className="text-muted-foreground">{getCustomerPhone(c)}</TableCell>
                    <TableCell><Badge className={intentColor(getType(c))}>{getType(c)}</Badge></TableCell>
                    <TableCell><Badge className={statusColor(c.status ?? "")}>{c.status ?? "—"}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{c.date ?? c.created_at ?? "—"}</TableCell>
                    <TableCell>{c.duration ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
            {pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1 || loading}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page || loading}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
