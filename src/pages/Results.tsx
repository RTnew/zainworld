import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Home, RotateCcw } from "lucide-react";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalRounds = 5 } = location.state || {};

  const score = Math.floor(Math.random() * 80) + 20; // Mock score
  const maxScore = totalRounds * 40; // 4 categories * 10 points
  const accuracy = Math.round((score / maxScore) * 100);

  useEffect(() => {
    // Save score to localStorage
    const gameScore = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      rounds: totalRounds,
      correctAnswers: score,
      totalAnswers: maxScore,
      accuracy,
    };

    const savedScores = localStorage.getItem("npat-scores");
    const scores = savedScores ? JSON.parse(savedScores) : [];
    scores.unshift(gameScore);
    localStorage.setItem("npat-scores", JSON.stringify(scores));
  }, [totalRounds, score, maxScore, accuracy]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-card bg-gradient-card border-0 animate-scale-in text-center">
          <div className="mb-8">
            <div className="inline-flex p-6 bg-gradient-primary rounded-3xl shadow-glow mb-6">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Game Complete!</h2>
            <p className="text-muted-foreground">Great job on finishing all rounds</p>
          </div>

          <div className="mb-8 p-6 bg-primary/5 rounded-2xl">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-primary mb-2">
              {score}
            </div>
            <div className="text-muted-foreground">
              out of {maxScore} points
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex justify-around text-sm">
                <div>
                  <div className="font-semibold text-foreground">{totalRounds}</div>
                  <div className="text-muted-foreground">Rounds</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{Math.round((score / maxScore) * 100)}%</div>
                  <div className="text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/game-setup")}
              className="w-full h-14 text-lg bg-gradient-primary hover:shadow-hover transition-all"
            >
              <RotateCcw className="mr-2 w-5 h-5" />
              Play Again
            </Button>
            <Button
              onClick={() => navigate("/menu")}
              variant="outline"
              className="w-full h-14 text-lg hover:bg-muted transition-all"
            >
              <Home className="mr-2 w-5 h-5" />
              Back to Menu
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Results;
