import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";
import { API_BASE } from "@/lib/api";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileUploadCardProps {
  userId: string;
}

const FileUploadCard = (_: FileUploadCardProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const extractTextFromPDF = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it: any) => ("str" in it ? it.str : "")).join(" ") + "\n";
    }
    return text.trim();
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    try {
      let content = "";
      if (file.type === "application/pdf") {
        content = await extractTextFromPDF(file);
      } else {
        content = await file.text();
      }

      const payload = {
        title: file.name.replace(/\.[^.]+$/, ""),
        content,
      };

      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create note");
      toast.success("Note created!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Notes
        </CardTitle>
        <CardDescription>Upload a PDF/TXT to create a note</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <input
            ref={inputRef}
            id="file-upload"
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-8 h-8 text-primary" />
              <p className="text-sm">
                {uploading ? "Uploading..." : "Click to upload"}
              </p>
              <p className="text-sm text-muted-foreground">Supports PDF and TXT files</p>
              {uploading && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
            </div>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
