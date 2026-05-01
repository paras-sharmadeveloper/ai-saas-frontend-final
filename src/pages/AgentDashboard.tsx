import { useState } from "react";
import { Pencil, BookOpen, Phone, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/services/api";
import { API_ROUTES } from "@/services/apiRoutes";
import { EditAgentForm } from "@/pages/EditAgentForm";
import { KnowledgeBaseTab } from "@/components/ai-training/KnowledgeBaseTab";

export function AgentDashboard({ client, onAgentUpdated }: {
    client: any;
    onAgentUpdated: (c: any) => void;
}) {
    const [activeTab, setActiveTab] = useState<"overview" | "edit" | "knowledge">("overview");
    const [knowledgeText, setKnowledgeText] = useState("");
    const [saving, setSaving] = useState(false);
    const [assigningNumber, setAssigningNumber] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const config = client.agent_config;
    const prompt = client.agent_prompt;

    const handleKnowledgeUpdate = async () => {
        setSaving(true);
        try {
            await api.post(API_ROUTES.agentCreate.updateKnowledge, {
                agent_id: client.elevenlabs_agent_id,
                knowledge_text: knowledgeText,
            });
            toast.success("Knowledge base updated on ElevenLabs! ");
            setKnowledgeText("");
        } catch {
            toast.error("Failed to update knowledge base");
        } finally {
            setSaving(false);
        }
    };
    const handleSyncWebhook = async () => {
        setSyncing(true);
        try {
            const res = await api.post(API_ROUTES.agentCreate.syncWebhook(client.elevenlabs_agent_id), {
                agent_id: client.elevenlabs_agent_id,
            });
            toast.success("Agent connected successfully!");
            onAgentUpdated({ ...client, elevenlabs_webhook_id: res.data.webhook_id });
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to sync webhook");
        } finally {
            setSyncing(false);
        }
    };
    const handleAssignNumber = async () => {
        setAssigningNumber(true);
        try {
            const res = await api.post(API_ROUTES.agentCreate.assignNumber);
            if (res.data.success) {
                toast.success(`${res.data.phone_number} assigned! `);
                onAgentUpdated({
                    ...client,
                    phone_number: { number: res.data.phone_number, is_assigned: true }
                });
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to assign number");
        } finally {
            setAssigningNumber(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">{config?.agent_name ?? client.company_name}</h2>
                    <p className="text-sm text-muted-foreground">{client.company_name} · {client.business_type}</p>
                </div>
                <div className="ml-auto">
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        Active
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
                {[
                    { key: "overview", label: "Overview", icon: Phone },
                    { key: "edit", label: "Edit Agent", icon: Pencil },
                    { key: "knowledge", label: "Knowledge Base", icon: BookOpen },
                ].map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key as any)}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === key
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Icon className="w-4 h-4" /> {label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
                <div className="space-y-3">
                    {[
                        { label: "Tone", value: config?.tone },
                        { label: "Language", value: config?.language },
                        { label: "Call Goal", value: config?.call_goal },
                        { label: "Voice", value: config?.selected_voice_id ?? "Default" },
                        { label: "Services", value: config?.services?.map((s: any) => s.name).join(", ") },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between py-2 border-b last:border-0">
                            <span className="text-sm text-muted-foreground">{label}</span>
                            <span className="text-sm font-medium capitalize">{value ?? "—"}</span>
                        </div>
                    ))}
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Phone Number</span>
                        <div className="flex items-center gap-2">
                            {client.phone_number ? (
                                <>
                                    <span className="text-sm font-medium">{client.phone_number.number}</span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                        Active ✓
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs text-muted-foreground">Not assigned</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full h-7 text-xs"
                                        onClick={handleAssignNumber}
                                        disabled={assigningNumber}
                                    >
                                        {assigningNumber
                                            ? <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                            : <Phone className="w-3 h-3 mr-1" />
                                        }
                                        {assigningNumber ? "Assigning..." : "Assign Number"}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Agent Connection */}
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Agent Connection</span>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full h-7 text-xs"
                                onClick={handleSyncWebhook}
                                disabled={syncing}
                            >
                                {syncing
                                    ? <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                    : <Bot className="w-3 h-3 mr-1" />
                                }
                                {syncing ? "Syncing..." : "Sync Agent"}
                            </Button>
                            {client.elevenlabs_webhook_id ? (
                                <>
                                    <span className="text-sm font-medium">Webhook Active</span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                        Connected ✓
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs text-muted-foreground">Not connected</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full h-7 text-xs"
                                        onClick={handleSyncWebhook}
                                        disabled={syncing}
                                    >
                                        {syncing
                                            ? <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                            : <Bot className="w-3 h-3 mr-1" />
                                        }
                                        {syncing ? "Syncing..." : "Sync Agent"}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-1">System Prompt</p>
                        <div className="bg-muted rounded-xl p-3 text-xs text-foreground max-h-40 overflow-y-auto whitespace-pre-wrap">
                            {prompt?.system_prompt ?? "—"}
                        </div>
                    </div>

                </div>

            )}

            {/* Edit Tab */}
            {activeTab === "edit" && (
                <EditAgentForm
                    client={client}
                    onUpdated={onAgentUpdated}
                />
            )}

            {/* Knowledge Base Tab */}
            {activeTab === "knowledge" && (
                <KnowledgeBaseTab clientId={client.id} />
            )}

        </div>
    );
}