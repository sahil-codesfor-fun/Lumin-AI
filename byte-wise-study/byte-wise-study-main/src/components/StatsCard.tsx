import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE } from "@/lib/api";

const StatsCard = () => {
  const [counts, setCounts] = useState({ notes: 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/notes`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        });
        const data = await res.json();
        if (res.ok) {
          setCounts({ notes: Array.isArray(data) ? data.length : 0 });
        }
      } catch {}
    })();
  }, []);

  return (
    <Card>
      <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-2xl font-bold">{counts.notes}</div>
          <div className="text-xs text-muted-foreground">Notes</div>
        </div>
        <div>
          <div className="text-2xl font-bold">—</div>
          <div className="text-xs text-muted-foreground">Quizzes</div>
        </div>
        <div>
          <div className="text-2xl font-bold">—</div>
          <div className="text-xs text-muted-foreground">Correct</div>
        </div>
        <div>
          <div className="text-2xl font-bold">—</div>
          <div className="text-xs text-muted-foreground">Chats</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
