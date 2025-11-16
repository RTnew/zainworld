import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Check } from "lucide-react";
import { toast } from "sonner";

const categories = ["Name", "Place", "Animal", "Thing"];
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { timeLimit = 60, rounds = 5 } = location.state || {};

  const [currentRound, setCurrentRound] = useState(1);
  const [currentLetter, setCurrentLetter] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    Name: "",
    Place: "",
    Animal: "",
    Thing: "",
  });

  useEffect(() => {
    // Generate random letter
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setCurrentLetter(randomLetter);
  }, [currentRound]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (category: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = () => {
    const filledAnswers = Object.values(answers).filter((a) => a.trim() !== "").length;
    
    if (filledAnswers === 0) {
      toast.error("Please fill at least one answer!");
      return;
    }

    toast.success(`Round ${currentRound} completed!`);

    if (currentRound < rounds) {
      setCurrentRound(currentRound + 1);
      setTimeLeft(timeLimit);
      setAnswers({ Name: "", Place: "", Animal: "", Thing: "" });
    } else {
      navigate("/results", { state: { totalRounds: rounds } });
    }
  };

  const progress = ((timeLimit - timeLeft) / timeLimit) * 100;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/menu")}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Exit Game
          </Button>
          <div className="text-sm font-semibold text-muted-foreground">
            Round {currentRound} / {rounds}
          </div>
        </div>

        <Card className="p-8 shadow-card bg-gradient-card border-0 mb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-primary rounded-3xl shadow-glow mb-4">
              <span className="text-5xl font-bold text-white">{currentLetter}</span>
            </div>
            <p className="text-muted-foreground">
              Fill all categories starting with letter <span className="font-bold text-primary">{currentLetter}</span>
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{timeLeft}s remaining</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <Label className="text-lg font-semibold">{category}</Label>
                <Input
                  value={answers[category]}
                  onChange={(e) => handleAnswerChange(category, e.target.value)}
                  placeholder={`Enter a ${category.toLowerCase()} starting with ${currentLetter}`}
                  className="h-12 text-lg"
                />
              </div>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full h-14 text-lg mt-8 bg-gradient-primary hover:shadow-hover transition-all"
          >
            <Check className="mr-2 w-5 h-5" />
            Submit Answers
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Game;
