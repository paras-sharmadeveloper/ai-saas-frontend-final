import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const allCalls = [
  { id: "1", customer: "Sarah Johnson", phone: "+1 (555) 123-4567", type: "Lead", status: "Completed", date: "Apr 1, 2026", duration: "5:23" },
  { id: "2", customer: "Michael Chen", phone: "+1 (555) 234-5678", type: "Support", status: "Completed", date: "Apr 1, 2026", duration: "3:45" },
  { id: "3", customer: "Emma Wilson", phone: "+1 (555) 345-6789", type: "Lead", status: "Missed", date: "Apr 1, 2026", duration: "—" },
  { id: "4", customer: "James Brown", phone: "+1 (555) 456-7890", type: "Complaint", status: "In Progress", date: "Mar 31, 2026", duration: "8:12" },
  { id: "5", customer: "Lisa Davis", phone: "+1 (555) 567-8901", type: "Support", status: "Completed", date: "Mar 31, 2026", duration: "2:10" },
];

const filters = ["All", "Lead", "Support", "Complaint"];

const statusColor = (s: string) => {
  if (s === "Completed") return "bg-success/10 text-success border-0";
  if (s === "Missed") return "bg-destructive/10 text-destructive border-0";
  return "bg-muted text-muted-foreground border-0";
};

export default function Calls() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = allCalls.filter((c) => {
    if (filter !== "All" && c.type !== filter) return false;
    if (search && !c.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calls</h1>
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>{f}</Button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customer..." className="pl-9 w-56" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
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
                <TableRow key={c.id} className="cursor-pointer hover:bg-secondary/50" onClick={() => navigate(`/calls/${c.id}`)}>
                  <TableCell className="font-medium">{c.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                  <TableCell><Badge variant="secondary">{c.type}</Badge></TableCell>
                  <TableCell><Badge className={statusColor(c.status)}>{c.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{c.date}</TableCell>
                  <TableCell>{c.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
