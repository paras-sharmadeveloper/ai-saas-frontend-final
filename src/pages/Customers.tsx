import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const customers = [
  { name: "Sarah Johnson", phone: "+1 (555) 123-4567", email: "sarah@example.com", calls: 12, lastCall: "2 min ago" },
  { name: "Michael Chen", phone: "+1 (555) 234-5678", email: "michael@example.com", calls: 8, lastCall: "15 min ago" },
  { name: "Emma Wilson", phone: "+1 (555) 345-6789", email: "emma@example.com", calls: 5, lastCall: "1 hr ago" },
  { name: "James Brown", phone: "+1 (555) 456-7890", email: "james@example.com", calls: 15, lastCall: "2 hrs ago" },
  { name: "Lisa Davis", phone: "+1 (555) 567-8901", email: "lisa@example.com", calls: 3, lastCall: "3 hrs ago" },
];

export default function Customers() {
  const [search, setSearch] = useState("");
  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">{filtered.length} customers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-9 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Calls</TableHead>
                <TableHead>Last Call</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email}</TableCell>
                  <TableCell>{c.calls}</TableCell>
                  <TableCell className="text-muted-foreground">{c.lastCall}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
