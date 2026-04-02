import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, RotateCcw, Phone, MessageSquare, Image, Loader2 } from "lucide-react";
import { toast } from "sonner";

const availableNumbers = [
  { number: "+1 662 441 4968", location: "Cleveland, MS US", type: "Local", voice: true, sms: true, mms: true, price: "$1.15" },
  { number: "+1 662 441 4922", location: "Cleveland, MS US", type: "Local", voice: true, sms: true, mms: true, price: "$1.15" },
  { number: "+1 662 441 5076", location: "Cleveland, MS US", type: "Local", voice: true, sms: true, mms: false, price: "$1.15" },
  { number: "+1 415 555 0102", location: "San Francisco, CA US", type: "Local", voice: true, sms: true, mms: true, price: "$1.50" },
];

const purchasedNumbers = [
  { number: "+1 (555) 100-0001", agent: "Lead Bot", status: "Active", calls: 234, created: "Jan 15, 2024" },
  { number: "+1 (555) 100-0002", agent: "Support Bot", status: "Active", calls: 189, created: "Feb 1, 2024" },
  { number: "+1 (555) 100-0003", agent: "—", status: "Inactive", calls: 0, created: "Mar 10, 2024" },
];

export default function PhoneNumbers() {
  const [buyingId, setBuyingId] = useState<number | null>(null);

  const handleBuy = (idx: number) => {
    setBuyingId(idx);
    setTimeout(() => {
      setBuyingId(null);
      toast.success("Number purchased successfully");
    }, 1300);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Phone Numbers</h1>
      <Tabs defaultValue="buy">
        <TabsList>
          <TabsTrigger value="buy">Buy a Number</TabsTrigger>
          <TabsTrigger value="purchased">Purchased Numbers</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-6 mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2">Country</p>
                  <Select defaultValue="us">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">🇺🇸 (+1) United States - US</SelectItem>
                      <SelectItem value="au">🇦🇺 (+61) Australia - AU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Capabilities</p>
                  <div className="flex items-center gap-4">
                    {[{ label: "Voice", icon: Phone, checked: true }, { label: "SMS", icon: MessageSquare, checked: true }, { label: "MMS", icon: Image, checked: false }].map((c) => (
                      <div key={c.label} className="flex items-center gap-2">
                        <Checkbox defaultChecked={c.checked} className="data-[state=checked]:bg-success data-[state=checked]:border-success" />
                        <c.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
                <div>
                  <p className="text-sm font-medium mb-2">Search criteria</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search by digits or phrases" className="pl-9" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Match to</p>
                  <Select defaultValue="contains">
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="starts">Starts with</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Search</Button>
                <Button variant="outline"><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
              </div>
              <p className="text-sm text-muted-foreground">Search by area code, prefix, or characters you want in your phone number.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Available Numbers</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Voice</TableHead>
                    <TableHead>SMS</TableHead>
                    <TableHead>MMS</TableHead>
                    <TableHead>Monthly Fee</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableNumbers.map((n, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div>
                          <span className="font-medium text-primary">{n.number}</span>
                          <p className="text-xs text-muted-foreground">{n.location}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary">{n.type}</Badge></TableCell>
                      <TableCell>{n.voice ? <Phone className="w-4 h-4 text-muted-foreground" /> : "—"}</TableCell>
                      <TableCell>{n.sms ? <MessageSquare className="w-4 h-4 text-muted-foreground" /> : "—"}</TableCell>
                      <TableCell>{n.mms ? <Image className="w-4 h-4 text-muted-foreground" /> : "—"}</TableCell>
                      <TableCell>{n.price}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleBuy(i)} disabled={buyingId === i}>
                          {buyingId === i ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buy"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchased" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Assigned Agent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Call Count</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchasedNumbers.map((n, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{n.number}</TableCell>
                      <TableCell>{n.agent}</TableCell>
                      <TableCell>
                        <Badge className={n.status === "Active" ? "bg-success/10 text-success border-0" : "bg-muted text-muted-foreground border-0"}>
                          {n.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{n.calls}</TableCell>
                      <TableCell className="text-muted-foreground">{n.created}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline" className="text-destructive">Release</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
