import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Settings, Trophy, Gamepad2, Users, Swords } from "lucide-react";

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex p-4 bg-gradient-primary rounded-2xl shadow-glow mb-4">
            <Gamepad2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">NPAT Game</h1>
          <p className="text-muted-foreground">Ready to play?</p>
        </div>

        <Card className="p-6 shadow-card bg-gradient-card border-0 mb-6 animate-slide-up">
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/game-setup")}
              className="w-full h-16 text-lg bg-gradient-primary hover:shadow-hover transition-all"
            >
              <Play className="mr-2 w-6 h-6" />
              Play Solo
            </Button>

            <Button
              onClick={() => navigate("/multiplayer-setup")}
              className="w-full h-16 text-lg bg-gradient-accent hover:shadow-hover transition-all"
            >
              <Users className="mr-2 w-6 h-6" />
              Multiplayer
            </Button>

            <Button
              onClick={() => navigate("/online-match-setup")}
              className="w-full h-16 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-hover transition-all text-white"
            >
              <Swords className="mr-2 w-6 h-6" />
              Online Match
            </Button>

            <Button
              variant="outline"
              className="w-full h-14 text-lg hover:bg-muted transition-all"
              onClick={() => navigate("/scores")}
            >
              <Trophy className="mr-2 w-5 h-5" />
              View Scores
            </Button>

            <Button
              variant="outline"
              className="w-full h-14 text-lg hover:bg-muted transition-all"
              onClick={() => navigate("/settings")}
            >
              <Settings className="mr-2 w-5 h-5" />
              Settings
            </Button>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Version 1.0 • Made with ❤️</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
