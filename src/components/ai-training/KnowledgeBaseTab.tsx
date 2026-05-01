import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, FileText, Link, AlignLeft, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { API_ROUTES } from "@/services/apiRoutes";

type KBItem = {
    id: number;
    type: "text" | "url" | "file";
    name: string;
    content?: string;
    url?: string;
    file_name?: string;
    file_size?: number;
    created_at: string;
};

type Props = { clientId: number };

const TYPES = [
    { key: "text", label: "Text", icon: AlignLeft },
    { key: "url", label: "URL", icon: Link },
    { key: "file", label: "File", icon: FileText },
] as const;

export function KnowledgeBaseTab({ clientId }: Props) {
    const [items, setItems] = useState<KBItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeType, setActiveType] = useState<"text" | "url" | "file">("text");
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        api.get(API_ROUTES.knowledge.list.replace(":clientId", String(clientId)))
            .then(r => { if (r.data.success) setItems(r.data.knowledge); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [clientId]);

    const resetForm = () => {
        setName(""); setContent(""); setUrl(""); setFile(null);
    };

    const isValid = () => {
        if (!name.trim()) return false;
        if (activeType === "text" && !content.trim()) return false;
        if (activeType === "url" && !url.trim()) return false;
        if (activeType === "file" && !file) return false;
        return true;
    };

    const handleAdd = async () => {
        if (!isValid()) return toast.error("Please fill all required fields");

        setSaving(true);
        try {
            const form = new FormData();
            form.append("client_id", String(clientId));
            form.append("type", activeType);
            form.append("name", name.trim());

            if (activeType === "text") form.append("content", content);
            if (activeType === "url") form.append("url", url);
            if (activeType === "file" && file) form.append("file", file);

            const res = await api.post(API_ROUTES.knowledge.add, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                setItems(prev => [res.data.knowledge, ...prev]);
                resetForm();
                toast.success("Knowledge added successfully! ");
            }
        } catch {
            toast.error("Failed to add knowledge");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeleting(id);
        try {
            await api.delete(API_ROUTES.knowledge.delete.replace(":id", String(id)));
            setItems(prev => prev.filter(k => k.id !== id));
            toast.success("Deleted successfully");
        } catch {
            toast.error("Failed to delete");
        } finally {
            setDeleting(null);
        }
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return "";
        return bytes > 1024 * 1024
            ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
            : `${(bytes / 1024).toFixed(0)} KB`;
    };

    const getPreview = (item: KBItem) => {
        if (item.type === "url") return item.url ?? "";
        if (item.type === "file") return `${item.file_name} · ${formatSize(item.file_size)}`;
        if (item.type === "text") return (item.content ?? "").slice(0, 80) + ((item.content?.length ?? 0) > 80 ? "..." : "");
        return "";
    };

    return (
        <div className="space-y-6">

            {/* Type Tabs */}
            <div className="flex gap-2">
                {TYPES.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => { setActiveType(key); resetForm(); }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${activeType === key
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40"
                            }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Input Card */}
            <div className="space-y-3 p-4 border-2 border-dashed border-border rounded-2xl">
                <Input
                    placeholder="Name (e.g. Pricing Info, FAQ, Refund Policy)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="rounded-xl h-11"
                />

                {activeType === "text" && (
                    <Textarea
                        placeholder="Add your company info, FAQs, pricing, policies, office hours..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="min-h-[140px] rounded-xl text-sm resize-none"
                    />
                )}

                {activeType === "url" && (
                    <Input
                        placeholder="https://yoursite.com/faq"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        className="rounded-xl h-11"
                    />
                )}

                {activeType === "file" && (
                    <>
                        <div
                            onClick={() => fileRef.current?.click()}
                            className={`flex flex-col items-center justify-center gap-2 p-8 rounded-xl cursor-pointer transition-colors border-2 border-dashed ${file
                                ? "border-primary/40 bg-primary/5"
                                : "border-border bg-muted/40 hover:bg-muted/70"
                                }`}
                        >
                            {file ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6 text-primary" />
                                    <p className="text-sm font-medium text-primary">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 text-muted-foreground" />
                                    <p className="text-sm font-medium">Click to upload file</p>
                                    <p className="text-xs text-muted-foreground">PDF, DOCX, TXT — up to 21MB</p>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={e => setFile(e.target.files?.[0] ?? null)}
                        />
                    </>
                )}

                <Button
                    onClick={handleAdd}
                    disabled={saving || !isValid()}
                    className="w-full rounded-xl h-11"
                >
                    {saving
                        ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading ...</>
                        : "Add to Knowledge Base"
                    }
                </Button>
            </div>

            {/* Saved Items */}
            {loading ? (
                <div className="flex justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
            ) : items.length > 0 ? (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Knowledge Base · {items.length} {items.length === 1 ? "item" : "items"}
                    </p>
                    {items.map(item => {
                        const TypeIcon = TYPES.find(t => t.key === item.type)?.icon ?? FileText;
                        return (
                            <div
                                key={item.id}
                                className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-border hover:border-primary/30 transition-colors"
                            >
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="mt-0.5 p-1.5 rounded-lg bg-muted">
                                        <TypeIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                            {getPreview(item)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    disabled={deleting === item.id}
                                    className="shrink-0 text-muted-foreground hover:text-destructive transition-colors mt-0.5"
                                >
                                    {deleting === item.id
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <Trash2 className="w-4 h-4" />
                                    }
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No knowledge added yet</p>
                    <p className="text-xs mt-1">Add text, URLs, or files above</p>
                </div>
            )}

        </div>
    );
}