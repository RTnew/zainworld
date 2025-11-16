import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";

interface GameScore {
  id: string;
  date: string;
  rounds: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
}

const Scores = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<GameScore[]>([]);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = () => {
    const savedScores = localStorage.getItem("npat-scores");
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  };

  const deleteScore = (id: string) => {
    const updatedScores = scores.filter((score) => score.id !== id);
    localStorage.setItem("npat-scores", JSON.stringify(updatedScores));
    setScores(updatedScores);
    toast.success("Score deleted");
  };

  const clearAllScores = () => {
    localStorage.removeItem("npat-scores");
    setScores([]);
    toast.success("All scores cleared");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/menu")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-4xl font-bold">Your Scores</h1>
          </div>
          {scores.length > 0 && (
            <Button
              variant="destructive"
              onClick={clearAllScores}
              size="sm"
            >
              Clear All
            </Button>
          )}
        </div>

        {scores.length === 0 ? (
          <Card className="p-12 shadow-card bg-gradient-card border-0 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Scores Yet</h2>
            <p className="text-muted-foreground mb-6">
              Play some games to see your scores here!
            </p>
            <Button onClick={() => navigate("/game-setup")}>
              Start Playing
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {scores.map((score) => (
              <Card
                key={score.id}
                className="p-6 shadow-card bg-gradient-card border-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(score.date).toLocaleDateString()} at{" "}
                        {new Date(score.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Rounds</p>
                        <p className="text-2xl font-bold">{score.rounds}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Answers</p>
                        <p className="text-2xl font-bold">
                          {score.correctAnswers}/{score.totalAnswers}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-2xl font-bold">{score.accuracy}%</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteScore(score.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scores;
