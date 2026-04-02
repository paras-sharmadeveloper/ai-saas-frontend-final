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
  { number: "+1 662 441 4968", location: "Cleveland, MS", country: "US", type: "Local", voice: true, sms: true, mms: true, price: "$1.15" },
  { number: "+1 662 441 4922", location: "Cleveland, MS", country: "US", type: "Local", voice: true, sms: true, mms: true, price: "$1.15" },
  { number: "+1 662 441 5076", location: "Cleveland, MS", country: "US", type: "Local", voice: true, sms: true, mms: false, price: "$1.15" },
  { number: "+1 415 555 0102", location: "San Francisco, CA", country: "US", type: "Local", voice: true, sms: true, mms: true, price: "$1.50" },
  { number: "+1 212 555 0134", location: "New York, NY", country: "US", type: "Toll-Free", voice: true, sms: false, mms: false, price: "$2.00" },
  { number: "+1 310 555 0198", location: "Los Angeles, CA", country: "US", type: "Mobile", voice: true, sms: true, mms: true, price: "$1.75" },
];

const purchasedNumbers = [
  { number: "+1 (555) 100-0001", agent: "Lead Bot", status: "Active", calls: 234, created: "Jan 15, 2026" },
  { number: "+1 (555) 100-0002", agent: "Support Bot", status: "Active", calls: 189, created: "Feb 1, 2026" },
  { number: "+1 (555) 100-0003", agent: "—", status: "Inactive", calls: 0, created: "Mar 10, 2026" },
];

export default function PhoneNumbers() {
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const handleBuy = (idx: number) => {
    setBuyingId(idx);
    setTimeout(() => {
      setBuyingId(null);
      toast.success("Number purchased successfully");
    }, 1300);
  };

  const visibleNumbers = availableNumbers.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Phone Numbers</h1>
      <Tabs defaultValue="buy">
        <TabsList>
          <TabsTrigger value="buy">Buy a Number</TabsTrigger>
          <TabsTrigger value="purchased">Purchased Numbers</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4 mt-4">
          {/* Search Section */}
          <Card className="shadow-sm sticky top-14 z-[5] bg-card">
            <CardContent className="pt-5 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1.5">Country</p>
                  <Select defaultValue="us">
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">🇺🇸 United States</SelectItem>
                      <SelectItem value="au">🇦🇺 Australia</SelectItem>
                      <SelectItem value="gb">🇬🇧 United Kingdom</SelectItem>
                      <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1.5">Capabilities</p>
                  <div className="flex items-center gap-5 h-10">
                    {[{ label: "Voice", icon: Phone, checked: true }, { label: "SMS", icon: MessageSquare, checked: true }, { label: "MMS", icon: Image, checked: false }].map((c) => (
                      <div key={c.label} className="flex items-center gap-1.5">
                        <Checkbox defaultChecked={c.checked} />
                        <c.icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_auto_auto] gap-3 items-end">
                <div>
                  <p className="text-sm font-medium mb-1.5">Search</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search by number, prefix, or keywords" className="pl-9 h-10" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1.5">Match</p>
                  <Select defaultValue="contains">
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="starts">Starts with</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="h-10">Search</Button>
                <Button variant="outline" className="h-10"><RotateCcw className="w-4 h-4 mr-1.5" /> Reset</Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Available Numbers</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Capabilities</TableHead>
                    <TableHead>Monthly Price</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleNumbers.map((n, i) => (
                    <TableRow key={i} className="hover:bg-muted/50">
                      <TableCell className="font-semibold text-foreground">{n.number}</TableCell>
                      <TableCell className="text-muted-foreground">{n.location}, {n.country}</TableCell>
                      <TableCell><Badge variant="secondary">{n.type}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {n.voice && <Phone className="w-4 h-4 text-primary" />}
                          {n.sms && <MessageSquare className="w-4 h-4 text-primary" />}
                          {n.mms && <Image className="w-4 h-4 text-primary" />}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{n.price}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleBuy(i)} disabled={buyingId === i}>
                          {buyingId === i ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buy"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {visibleCount < availableNumbers.length && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={() => setVisibleCount((c) => c + 10)}>Load More</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchased" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Purchased Numbers</CardTitle></CardHeader>
            <CardContent>
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
                    <TableRow key={i} className="hover:bg-muted/50">
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
                          <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">Release</Button>
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
