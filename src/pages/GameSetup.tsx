import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Play } from "lucide-react";

const GameSetup = () => {
  const navigate = useNavigate();
  const [timeLimit, setTimeLimit] = useState([60]);
  const [rounds, setRounds] = useState([5]);

  const handleStartGame = () => {
    navigate("/game", { state: { timeLimit: timeLimit[0], rounds: rounds[0] } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/menu")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Menu
        </Button>

        <Card className="p-8 shadow-card bg-gradient-card border-0 animate-scale-in">
          <h2 className="text-3xl font-bold text-foreground mb-6">Game Setup</h2>

          <div className="space-y-8">
            <div>
              <Label className="text-lg font-semibold mb-4 block">
                Time per Round: {timeLimit[0]} seconds
              </Label>
              <Slider
                value={timeLimit}
                onValueChange={setTimeLimit}
                min={30}
                max={180}
                step={15}
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground">
                Set how long players have to answer each round
              </p>
            </div>

            <div>
              <Label className="text-lg font-semibold mb-4 block">
                Number of Rounds: {rounds[0]}
              </Label>
              <Slider
                value={rounds}
                onValueChange={setRounds}
                min={1}
                max={10}
                step={1}
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground">
                Choose how many rounds to play
              </p>
            </div>

            <div className="pt-4">
              <div className="p-4 bg-primary/5 rounded-xl mb-6">
                <h3 className="font-semibold mb-2">Categories:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <span>Place</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span>Animal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span>Thing</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStartGame}
                className="w-full h-14 text-lg bg-gradient-primary hover:shadow-hover transition-all"
              >
                <Play className="mr-2 w-5 h-5" />
                Start Game
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GameSetup;
