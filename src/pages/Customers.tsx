import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Phone, Mail } from "lucide-react";

const customers = [
  { name: "Sarah Johnson", phone: "+1 (555) 123-4567", email: "sarah@example.com", calls: 12, lastCall: "2 min ago", status: "Active" },
  { name: "Michael Chen", phone: "+1 (555) 234-5678", email: "michael@example.com", calls: 8, lastCall: "15 min ago", status: "Active" },
  { name: "Emma Wilson", phone: "+1 (555) 345-6789", email: "emma@example.com", calls: 5, lastCall: "1 hr ago", status: "Active" },
  { name: "James Brown", phone: "+1 (555) 456-7890", email: "james@example.com", calls: 15, lastCall: "2 hrs ago", status: "Inactive" },
  { name: "Lisa Davis", phone: "+1 (555) 567-8901", email: "lisa@example.com", calls: 3, lastCall: "3 hrs ago", status: "Active" },
  { name: "Robert Taylor", phone: "+1 (555) 678-9012", email: "robert@example.com", calls: 22, lastCall: "5 hrs ago", status: "Active" },
  { name: "Jennifer Martinez", phone: "+1 (555) 789-0123", email: "jennifer@example.com", calls: 7, lastCall: "1 day ago", status: "Inactive" },
];

const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

export default function Customers() {
  const [search, setSearch] = useState("");
  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} customers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-9 w-64 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Calls</TableHead>
                <TableHead>Last Call</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c, i) => (
                <TableRow key={i} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{getInitials(c.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" /> {c.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" /> {c.email}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{c.calls}</TableCell>
                  <TableCell className="text-muted-foreground">{c.lastCall}</TableCell>
                  <TableCell>
                    <Badge className={c.status === "Active" ? "bg-success/10 text-success border-0" : "bg-muted text-muted-foreground border-0"}>
                      {c.status}
                    </Badge>
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
