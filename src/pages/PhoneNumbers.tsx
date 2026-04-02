import { useState, useEffect } from "react";
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
import { getAvailableNumbers, getMyNumbers, buyNumber, releaseNumber } from "@/services/twilioApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";



export default function PhoneNumbers() {
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [purchasedNumbers, setPurchasedNumbers] = useState([]);
  const [loadingPurchased, setLoadingPurchased] = useState(false);
  const [releasingId, setReleasingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("buy");
  const [country, setCountry] = useState("US");
  const [search, setSearch] = useState("");
  const [matchType, setMatchType] = useState("contains");
  const [filters, setFilters] = useState({
    voice: true,
    sms: true,
    mms: false,
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [selectedSid, setSelectedSid] = useState(null);

  useEffect(() => {
    fetchNumbers();

    if (activeTab === "purchased") {
      fetchPurchased();
    }

  }, [activeTab]);


  const fetchNumbers = async () => {
    try {
      setLoading(true);

      const res = await getAvailableNumbers({
        country,
        search,
        match: matchType,
      });

      let data = res.data.data.map((n) => ({
        number: n.phone_number,
        display: n.friendly_name,
        location: n.location,
        type: n.type,
        price: n.price,
        voice: n.capabilities.voice,
        sms: n.capabilities.sms,
        mms: n.capabilities.mms,
      }));

      // 🔥 frontend capability filter
      data = data.filter((n) => {
        return (
          (!filters.voice || n.voice) &&
          (!filters.sms || n.sms) &&
          (!filters.mms || n.mms)
        );
      });

      setAvailableNumbers(data);

    } catch (err) {
      toast.error("Failed to load numbers");
    } finally {
      setLoading(false);
    }
  };
  const fetchPurchased = async () => {
    try {
      const res = await getMyNumbers();
      setPurchasedNumbers(res.data.data || res.data);
    } catch (err) {
      toast.error("Failed to load purchased numbers");
    }
  };
  const handleBuy = async (number) => {
    try {
      setBuyingId(number);

      await buyNumber({
        phone_number: number,
      });

      toast.success("Number purchased successfully");

      fetchNumbers();
      fetchPurchased();

    } catch (err) {
      toast.error("Failed to buy number");
    } finally {
      setBuyingId(null);
    }
  };
  const handleRelease = async (sid) => {
    try {
      setReleasingId(sid);

      await releaseNumber(sid);

      toast.success("Number released successfully");

      fetchPurchased(); // 🔥 refresh list

    } catch (err) {
      toast.error("Failed to release number");
    } finally {
      setReleasingId(null);
    }
  };

  const visibleNumbers = availableNumbers.slice(0, visibleCount);

  console.log(availableNumbers);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Phone Numbers</h1>
      <Tabs defaultValue="buy">
        <TabsList>
          <TabsTrigger value="buy" onClick={() => setActiveTab("buy")}>Buy a Number</TabsTrigger>
          <TabsTrigger value="purchased" onClick={() => setActiveTab("purchased")}>Purchased Numbers</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4 mt-4">
          {/* Search Section */}
          <Card className="shadow-sm sticky top-14 z-[5] bg-card">
            <CardContent className="pt-5 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1.5">Country</p>
                  <Select value={country} onValueChange={(val) => setCountry(val.toUpperCase())}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">🇺🇸 United States</SelectItem>
                      <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                      <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                      <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1.5">Capabilities</p>
                  <div className="flex items-center gap-5 h-10">
                    {[
                      { label: "Voice", key: "voice", icon: Phone },
                      { label: "SMS", key: "sms", icon: MessageSquare },
                      { label: "MMS", key: "mms", icon: Image },
                    ].map((c) => (
                      <div key={c.key} className="flex items-center gap-1.5">
                        <Checkbox
                          checked={filters[c.key]}
                          onCheckedChange={(val) =>
                            setFilters({ ...filters, [c.key]: val })
                          }
                        />
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
                    <Input
                      placeholder="Search by number, prefix, or keywords"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-10"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1.5">Match</p>
                  <Select value={matchType} onValueChange={setMatchType}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="starts">Starts with</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="h-10"
                  onClick={fetchNumbers}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-1.5" />
                      Search
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="h-10"
                  onClick={() => {
                    setSearch("");
                    setCountry("US");
                    setMatchType("contains");
                    setFilters({ voice: true, sms: true, mms: false });

                    fetchNumbers();
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Reset
                </Button>              </div>
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
                      <TableCell className="font-semibold text-foreground">{n.display}</TableCell>
                      <TableCell className="text-muted-foreground">{n.location}</TableCell>
                      <TableCell><Badge variant="secondary">{n.type}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {n?.voice && <Phone className="w-4 h-4 text-primary" />}
                          {n?.sms && <MessageSquare className="w-4 h-4 text-primary" />}
                          {n?.mms && <Image className="w-4 h-4 text-primary" />}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{n.price}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleBuy(n.number)} disabled={buyingId === i}>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchasedNumbers.map((n, i) => (
                    <TableRow key={i}>
                      <TableCell>{n.phone_number}</TableCell>

                      <TableCell>
                        <Badge className="bg-success/10 text-success">
                          {n.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{n.created_at}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => {
                              setSelectedSid(n.twilio_sid);
                              setConfirmOpen(true);
                            }}
                          >
                            Release
                          </Button>
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
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Release</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This action will permanently release the phone number.
              <br />
              Please type <b>CONFIRM</b> to continue.
            </p>

            <Input
              placeholder="Type CONFIRM"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />

            <Button
              className="w-full"
              variant="destructive"
              disabled={confirmText !== "CONFIRM"}
              onClick={async () => {
                try {
                  setReleasingId(selectedSid);

                  await releaseNumber(selectedSid);

                  toast.success("Number released successfully");

                  setConfirmOpen(false);
                  setConfirmText("");
                  fetchPurchased();

                } catch {
                  toast.error("Failed to release number");
                } finally {
                  setReleasingId(null);
                }
              }}
            >
              {releasingId === selectedSid ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Confirm Release"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
