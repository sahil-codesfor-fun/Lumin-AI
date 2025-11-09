import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

interface QuizSectionProps {
  noteId: string;
  noteContent: string;
}

const parseQuiz = (text: string) => {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const questions: any[] = [];
  let current: any = null;
  for (const line of lines) {
    if (/^\d+\./.test(line)) {
      if (current) questions.push(current);
      current = { question: line.replace(/^\d+\.\s*/, ""), options: [], correct: "" };
    } else if (/^[A-D]\)/i.test(line)) {
      current?.options.push(line);
    } else if (/^Answer:/i.test(line)) {
      current && (current.correct = line.replace(/^Answer:\s*/i, ""));
    }
  }
  if (current) questions.push(current);
  return questions;
};

const QuizSection = ({ noteId, noteContent }: QuizSectionProps) => {
  const [raw, setRaw] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ai/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ noteContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to generate quiz");
      setRaw(data?.quiz || "");
      setQuestions(parseQuiz(data?.quiz || ""));
    } catch (err: any) {
      toast.error(err.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    const score = questions.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);
    toast.success(`You scored ${score}/${questions.length}`);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" /> Quiz
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={generateQuiz} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Quiz"}
        </Button>

        {questions.length > 0 && (
          <div className="mt-4 space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="border rounded-md p-3">
                <div className="font-medium">{i + 1}. {q.question}</div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((opt: string, j: number) => {
                    const val = opt.replace(/^[A-D]\)\s*/i, "").trim();
                    const selected = answers[i] === val;
                    return (
                      <Button
                        key={j}
                        variant={selected ? "default" : "outline"}
                        onClick={() => setAnswers((a) => ({ ...a, [i]: val }))}
                      >
                        {opt}
                      </Button>
                    );
                  })}
                </div>
                {answers[i] && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {answers[i] === q.correct ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        Correct answer: {q.correct}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            <Button onClick={submit} className="mt-2">Submit</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizSection;
