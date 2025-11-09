import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Sparkles, Trophy, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SummarySection from "@/components/SummarySection";
import QuizSection from "@/components/QuizSection";
import ChatSection from "@/components/ChatSection";
import { API_BASE } from "@/lib/api";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at?: string;
}

const NoteView = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "quiz" | "chat">("summary");

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  const fetchNote = async () => {
    try {
      const res = await fetch(`${API_BASE}/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load note");
      setNote(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load note");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="inline-flex gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            {note.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm">{note.content}</pre>

          <div className="flex gap-2 mt-6">
            <Button variant={activeTab === "summary" ? "default" : "outline"} onClick={() => setActiveTab("summary")}>
              <Sparkles className="w-4 h-4 mr-2" />
              Summary
            </Button>
            <Button variant={activeTab === "quiz" ? "default" : "outline"} onClick={() => setActiveTab("quiz")}>
              <Trophy className="w-4 h-4 mr-2" />
              Quiz
            </Button>
            <Button variant={activeTab === "chat" ? "default" : "outline"} onClick={() => setActiveTab("chat")}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>

          <div className="mt-6">
            <SummarySection noteId={note.id} noteContent={note.content} />
            <QuizSection noteId={note.id} noteContent={note.content} />
            <ChatSection noteId={note.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteView;
