import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Medal } from "lucide-react";
import confetti from "canvas-confetti";

interface PlayerStats {
  playerName: string;
  totalScore: number;
  correctAnswers: number;
  totalAnswers: number;
}

const MultiplayerFinalResults = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFinalStats();
  }, [roomId]);

  useEffect(() => {
    if (stats.length > 0) {
      // Victory celebration
      const duration = 5000;
      const animationEnd = Date.now() + duration;
      const colors = ['#9b87f5', '#7E69AB', '#6E59A5', '#D946EF', '#F97316'];

      const firework = () => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { x: Math.random(), y: Math.random() * 0.5 },
          colors: colors,
          startVelocity: 50,
          gravity: 1.2,
          scalar: 1.5,
          ticks: 250,
          shapes: ['star', 'circle'],
        });
      };

      // Initial massive burst
      firework();
      setTimeout(firework, 200);
      setTimeout(firework, 400);
      setTimeout(firework, 600);

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { x: Math.random(), y: Math.random() * 0.5 },
          colors: colors,
          startVelocity: 35,
          gravity: 1,
          ticks: 180,
          shapes: ['star'],
        });
      }, 400);

      return () => clearInterval(interval);
    }
  }, [stats]);

  const fetchFinalStats = async () => {
    if (!roomId) return;

    try {
      // Fetch room to get current letter
      const { data: room } = await supabase
        .from("game_rooms")
        .select("current_letter")
        .eq("id", roomId)
        .single();

      if (!room) return;

      // Fetch all players
      const { data: players } = await supabase
        .from("game_players")
        .select("*")
        .eq("room_id", roomId);

      if (!players) return;

      // Fetch all answers for all rounds
      const { data: allAnswers } = await supabase
        .from("player_answers")
        .select("*")
        .eq("room_id", roomId);

      if (!allAnswers) return;

      // Calculate stats for each player
      const playerStats: PlayerStats[] = players.map((player) => {
        const playerAnswers = allAnswers.filter(
          (answer) => answer.player_id === player.id
        );

        let correctAnswers = 0;
        playerAnswers.forEach((answer) => {
          if (
            answer.answer &&
            answer.answer.toLowerCase().startsWith(room.current_letter?.toLowerCase() || "")
          ) {
            correctAnswers++;
          }
        });

        return {
          playerName: player.player_name,
          totalScore: correctAnswers * 10,
          correctAnswers,
          totalAnswers: playerAnswers.length,
        };
      });

      // Sort by total score descending
      playerStats.sort((a, b) => b.totalScore - a.totalScore);
      setStats(playerStats);
    } catch (error) {
      console.error("Error fetching final stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-primary" />;
      case 1:
        return <Medal className="w-5 h-5 text-secondary" />;
      case 2:
        return <Star className="w-5 h-5 text-accent" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-4">
        <Card className="p-6">
          <p className="text-base">Loading final results...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-4 pb-8 overflow-y-auto">
      <Card className="w-full max-w-md p-6 shadow-glow bg-gradient-card animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-primary animate-bounce" />
            <Star className="w-8 h-8 text-secondary animate-bounce" style={{ animationDelay: "0.1s" }} />
            <Trophy className="w-8 h-8 text-accent animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Game Over!
          </h1>

          {stats.length > 0 && (
            <div className="space-y-1 mb-4">
              <p className="text-xl font-bold text-primary animate-scale-in">
                🎉 {stats[0].playerName} Wins! 🎉
              </p>
              <p className="text-sm text-muted-foreground">
                with {stats[0].totalScore} points
              </p>
            </div>
          )}

          <div className="space-y-2 mt-6">
            <h2 className="text-lg font-semibold mb-3">Final Leaderboard</h2>
            {stats.map((player, index) => (
              <Card
                key={player.playerName}
                className={`p-4 transition-all hover:scale-105 ${
                  index === 0 ? "bg-primary/10 border-primary" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex justify-center">
                      {getRankIcon(index)}
                    </div>
                    <div className="text-left">
                      <p className="text-base font-bold">{player.playerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {player.correctAnswers} / {player.totalAnswers} correct
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {player.totalScore}
                    </p>
                    <p className="text-xs text-muted-foreground">pts</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={() => navigate("/menu")}
            size="default"
            className="mt-6 w-full"
          >
            Back to Menu
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MultiplayerFinalResults;
