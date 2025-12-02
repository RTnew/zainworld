import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, Trophy, X, Check, ArrowRight, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

interface Answer {
  player_name: string;
  category: string;
  answer: string;
  is_valid: boolean;
  round_number: number;
}

interface Match {
  id: string;
  player1_name: string;
  player2_name: string;
  stake_amount: number;
  current_letter: string;
  current_round: number;
  total_rounds: number;
  categories: string[];
  status: string;
  winner_name: string | null;
}

const OnlineMatchResults = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const playerName = localStorage.getItem("playerName") || "";

  const [match, setMatch] = useState<Match | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLastRound, setIsLastRound] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [matchId]);

  const fetchResults = async () => {
    // Fetch match
    const { data: matchData } = await supabase
      .from("online_matches")
      .select("*")
      .eq("id", matchId)
      .single();

    if (!matchData) return;

    const matchParsed: Match = {
      ...matchData,
      categories: matchData.categories as string[],
    };
    setMatch(matchParsed);

    // Fetch all answers for this match
    const { data: answersData } = await supabase
      .from("online_match_answers")
      .select("*")
      .eq("match_id", matchId);

    if (answersData) {
      setAnswers(answersData);

      // Calculate scores
      const p1Answers = answersData.filter(
        (a) => a.player_name === matchParsed.player1_name && a.is_valid
      );
      const p2Answers = answersData.filter(
        (a) => a.player_name === matchParsed.player2_name && a.is_valid
      );

      setPlayer1Score(p1Answers.length);
      setPlayer2Score(p2Answers.length);

      // Check if last round
      const isLast = matchParsed.current_round >= matchParsed.total_rounds;
      setIsLastRound(isLast);

      if (isLast) {
        // Determine winner
        const finalWinner = p1Answers.length > p2Answers.length
          ? matchParsed.player1_name
          : p1Answers.length < p2Answers.length
          ? matchParsed.player2_name
          : null;

        setWinner(finalWinner);

        if (finalWinner === playerName) {
          // Award coins
          await awardWinner(matchParsed.stake_amount * 2);
          celebrateWin();
        }

        // Update match status
        await supabase
          .from("online_matches")
          .update({ status: "finished", winner_name: finalWinner })
          .eq("id", matchId);
      }
    }

    setIsLoading(false);
  };

  const awardWinner = async (amount: number) => {
    const { data: wallet } = await supabase
      .from("user_wallets")
      .select("*")
      .eq("player_name", playerName)
      .single();

    if (wallet) {
      await supabase
        .from("user_wallets")
        .update({
          coins: wallet.coins + amount,
          total_wins: wallet.total_wins + 1,
        })
        .eq("player_name", playerName);
    }
  };

  const celebrateWin = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#8B5CF6", "#3B82F6", "#F97316"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#8B5CF6", "#3B82F6", "#F97316"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleNextRound = async () => {
    if (!match) return;

    const letters = "ABCDEFGHIJKLMNOPRSTUVWYZ";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];

    await supabase
      .from("online_matches")
      .update({
        current_round: match.current_round + 1,
        current_letter: randomLetter,
        round_started_at: new Date().toISOString(),
        status: "playing",
      })
      .eq("id", matchId);

    navigate(`/online-match/${matchId}`);
  };

  if (isLoading || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentRoundAnswers = answers.filter(
    (a) => a.round_number === match.current_round
  );

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-muted-foreground mb-1">
          Round {match.current_round} Results
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full">
          <Coins className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-amber-500 text-lg">
            Prize: {match.stake_amount * 2} coins
          </span>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className={`p-4 text-center ${player1Score > player2Score ? "bg-success/20 border-success" : "bg-gradient-card border-0"}`}>
          <p className="text-sm text-muted-foreground mb-1">{match.player1_name}</p>
          <p className="text-3xl font-bold text-foreground">{player1Score}</p>
          <p className="text-xs text-muted-foreground">correct</p>
        </Card>
        <Card className={`p-4 text-center ${player2Score > player1Score ? "bg-success/20 border-success" : "bg-gradient-card border-0"}`}>
          <p className="text-sm text-muted-foreground mb-1">{match.player2_name}</p>
          <p className="text-3xl font-bold text-foreground">{player2Score}</p>
          <p className="text-xs text-muted-foreground">correct</p>
        </Card>
      </div>

      {/* Winner Banner */}
      {isLastRound && (
        <Card className={`p-6 mb-6 text-center ${winner === playerName ? "bg-gradient-primary" : "bg-muted"}`}>
          <Trophy className={`w-12 h-12 mx-auto mb-2 ${winner === playerName ? "text-white" : "text-muted-foreground"}`} />
          <p className={`text-xl font-bold ${winner === playerName ? "text-white" : "text-foreground"}`}>
            {winner === playerName
              ? "You Won! 🎉"
              : winner
              ? `${winner} Wins!`
              : "It's a Tie!"}
          </p>
          {winner === playerName && (
            <p className="text-white/80 mt-1">
              +{match.stake_amount * 2} coins
            </p>
          )}
        </Card>
      )}

      {/* Answers Comparison */}
      <div className="space-y-3 mb-6">
        {match.categories.map((category) => {
          const p1Answer = currentRoundAnswers.find(
            (a) => a.player_name === match.player1_name && a.category === category
          );
          const p2Answer = currentRoundAnswers.find(
            (a) => a.player_name === match.player2_name && a.category === category
          );

          return (
            <Card key={category} className="p-3 bg-gradient-card border-0">
              <p className="text-xs text-muted-foreground mb-2">{category}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 rounded-lg flex items-center justify-between ${p1Answer?.is_valid ? "bg-success/20" : "bg-destructive/20"}`}>
                  <span className="text-sm truncate">{p1Answer?.answer || "-"}</span>
                  {p1Answer?.is_valid ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <X className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div className={`p-2 rounded-lg flex items-center justify-between ${p2Answer?.is_valid ? "bg-success/20" : "bg-destructive/20"}`}>
                  <span className="text-sm truncate">{p2Answer?.answer || "-"}</span>
                  {p2Answer?.is_valid ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <X className="w-4 h-4 text-destructive" />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      {isLastRound ? (
        <Button
          onClick={() => navigate("/menu")}
          className="w-full h-14 text-lg bg-gradient-primary hover:shadow-hover"
        >
          <Home className="mr-2 w-5 h-5" />
          Back to Menu
        </Button>
      ) : (
        <Button
          onClick={handleNextRound}
          className="w-full h-14 text-lg bg-gradient-primary hover:shadow-hover"
        >
          Next Round
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default OnlineMatchResults;
