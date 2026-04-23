import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { API_ROUTES } from "@/services/apiRoutes";

type Props = {
    client: any;
    onUpdated: (updated: any) => void;
};

export function EditAgentForm({ client, onUpdated }: Props) {
    const config = client.agent_config ?? {};
    const prompt = client.agent_prompt ?? {};

    const [form, setForm] = useState({
        agent_name: config.agent_name ?? "",
        tone: config.tone ?? "",
        language: config.language ?? "en",
        call_goal: config.call_goal ?? "",
        website: config.website ?? "",
        description: config.description ?? "",
        system_prompt: prompt.system_prompt ?? "",
        first_message: prompt.first_message ?? "",
        questions: (config.questions ?? []).join("\n"),
        escalation_triggers: (config.escalation_triggers ?? []).join("\n"),
    });

    const [saving, setSaving] = useState(false);

    const set = (key: string, val: string) =>
        setForm(prev => ({ ...prev, [key]: val }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put(
                API_ROUTES.agentCreate.update.replace(":id", client.id),
                {
                    ...form,
                    questions: form.questions.split("\n").filter(Boolean),
                    escalation_triggers: form.escalation_triggers.split("\n").filter(Boolean),
                    agent_id: client.elevenlabs_agent_id,
                }
            );

            if (res.data.success) {
                toast.success("Agent updated successfully! ✅");
                onUpdated(res.data.client);
            }
        } catch {
            toast.error("Failed to update agent");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-5">

            {/* Basic Info */}
            <Section title="Basic Info">
                <Field label="Agent Name">
                    <Input
                        value={form.agent_name}
                        onChange={e => set("agent_name", e.target.value)}
                        placeholder="e.g. Aria, Max"
                        className="rounded-xl h-11"
                    />
                </Field>

                <Field label="Website">
                    <Input
                        value={form.website}
                        onChange={e => set("website", e.target.value)}
                        placeholder="https://yourcompany.com"
                        className="rounded-xl h-11"
                    />
                </Field>

                <Field label="Description">
                    <Textarea
                        value={form.description}
                        onChange={e => set("description", e.target.value)}
                        placeholder="What does your business do?"
                        className="rounded-xl text-sm min-h-[80px]"
                    />
                </Field>
            </Section>

            {/* Tone & Language */}
            <Section title="Tone & Language">
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Tone">
                        <select
                            value={form.tone}
                            onChange={e => set("tone", e.target.value)}
                            className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm"
                        >
                            {["friendly", "professional", "casual"].map(t => (
                                <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Language">
                        <select
                            value={form.language}
                            onChange={e => set("language", e.target.value)}
                            className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm"
                        >
                            {["en", "hi", "hinglish"].map(l => (
                                <option key={l} value={l}>{l.toUpperCase()}</option>
                            ))}
                        </select>
                    </Field>
                </div>

                <Field label="Call Goal">
                    <select
                        value={form.call_goal}
                        onChange={e => set("call_goal", e.target.value)}
                        className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm"
                    >
                        {[
                            { value: "lead_generation", label: "Lead Generation" },
                            { value: "customer_support", label: "Customer Support" },
                            { value: "appointment", label: "Appointment Booking" },
                            { value: "information", label: "Information Only" },
                        ].map(g => (
                            <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                    </select>
                </Field>
            </Section>

            {/* Questions & Triggers */}
            <Section title="Questions & Escalation">
                <Field label="Qualifying Questions (one per line)">
                    <Textarea
                        value={form.questions}
                        onChange={e => set("questions", e.target.value)}
                        placeholder={"What is your budget?\nWhen do you need this?"}
                        className="rounded-xl text-sm min-h-[100px]"
                    />
                </Field>

                <Field label="Escalation Triggers (one per line)">
                    <Textarea
                        value={form.escalation_triggers}
                        onChange={e => set("escalation_triggers", e.target.value)}
                        placeholder={"speak to someone\nhuman\nmanager"}
                        className="rounded-xl text-sm min-h-[80px]"
                    />
                </Field>
            </Section>

            {/* Prompt */}
            <Section title="System Prompt">
                <Field label="First Message">
                    <Input
                        value={form.first_message}
                        onChange={e => set("first_message", e.target.value)}
                        placeholder="Hi! I'm your assistant. How can I help?"
                        className="rounded-xl h-11"
                    />
                </Field>

                <Field label="System Prompt">
                    <Textarea
                        value={form.system_prompt}
                        onChange={e => set("system_prompt", e.target.value)}
                        className="rounded-xl text-sm min-h-[160px] font-mono"
                    />
                </Field>
            </Section>

            <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-xl h-11"
            >
                {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
                    : <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                }
            </Button>

        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {title}
            </p>
            {children}
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium">{label}</label>
            {children}
        </div>
    );
}