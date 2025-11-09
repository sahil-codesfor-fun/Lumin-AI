import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, LogOut } from "lucide-react";
import FileUploadCard from "@/components/FileUploadCard";
import NotesListCard from "@/components/NotesListCard";
import StatsCard from "@/components/StatsCard";

const Dashboard = () => {
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) navigate("/");
}, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    else setAuthed(true);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!authed) return null;

  return (
    <div className="container mx-auto p-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      <StatsCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <FileUploadCard userId={"local"} />
        <NotesListCard userId={"local"} />
      </div>
    </div>
  );
};

export default Dashboard;
