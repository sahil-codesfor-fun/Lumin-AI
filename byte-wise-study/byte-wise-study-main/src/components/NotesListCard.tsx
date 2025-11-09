import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Sparkles, Brain } from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

interface Note {
  id: string;
  title: string;
  created_at?: string;
}

interface NotesListCardProps {
  userId: string;
}

const NotesListCard = (_: NotesListCardProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadNotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch notes");
      setNotes(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Delete failed");
      toast.success("Note deleted");
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" /> Your Notes
        </CardTitle>
        <CardDescription>All your uploaded or saved notes</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading notes…</p>
        ) : notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet. Use the uploader to add one.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-3">
                  <Brain className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-medium">{note.title}</span>
                    {note.created_at && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/notes/${note.id}`)}>
                    <Sparkles className="w-4 h-4 mr-1" />
                    Open
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(note.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesListCard;
