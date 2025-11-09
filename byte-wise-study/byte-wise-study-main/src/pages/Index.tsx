import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Smart Study Buddy</h1>
        <p className="text-muted-foreground mb-6">
          Study Smarter. Learn Faster. Verify Instantly.
        </p>
        <Button onClick={() => navigate("/auth")}>Get Started</Button>
      </div>
    </div>
  );
};

export default Index;
