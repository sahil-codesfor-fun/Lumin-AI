import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

interface SummarySectionProps {
  noteId: string;
  noteContent: string;
}

const SummarySection = ({ noteId, noteContent }: SummarySectionProps) => {
  const [summary, setSummary] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  const generateSummary = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/ai/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ noteContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to summarize");
      setSummary(data?.summary || "");
    } catch (err: any) {
      toast.error(err.message || "Failed to summarize");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> AI Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary ? (
          <pre className="whitespace-pre-wrap text-sm">{summary}</pre>
        ) : (
          <p className="text-sm text-muted-foreground">No summary generated yet.</p>
        )}

        <Button className="mt-4" onClick={generateSummary} disabled={generating}>
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Summary"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SummarySection;
