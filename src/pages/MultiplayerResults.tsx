import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRight, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Room {
  id: string;
  room_code: string;
  current_letter: string;
  current_round: number;
  total_rounds: number;
  status: string;
  host_name: string;
  categories: any;
}

interface PlayerAnswer {
  player_id: string;
  player_name: string;
  category: string;
  answer: string;
  is_correct: boolean;
}

interface PlayerScore {
  player_name: string;
  correct_answers: number;
  total_answers: number;
  score: number;
}

const MultiplayerResults = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [answers, setAnswers] = useState<PlayerAnswer[]>([]);
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isProgressing, setIsProgressing] = useState(false);
  const playerName = localStorage.getItem("npat-player-name") || "";

  useEffect(() => {
    if (!roomId) return;

    fetchRoomAndAnswers();

    // Subscribe to room status changes and answer updates
    const channel = supabase
      .channel(`results-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const updatedRoom = payload.new as any;
          if (updatedRoom.status === "playing" && updatedRoom.current_round > room?.current_round) {
            // Host started next round
            navigate(`/multiplayer-game/${roomId}`);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "player_answers",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          // Refresh answers when new ones come in
          fetchRoomAndAnswers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, room]);

  const fetchRoomAndAnswers = async () => {
    if (!roomId) return;

    // Fetch room data
    const { data: roomData, error: roomError } = await supabase
      .from("game_rooms")
      .select()
      .eq("id", roomId)
      .single();

    if (roomError || !roomData) {
      toast({
        title: "Error",
        description: "Failed to load results",
        variant: "destructive",
      });
      navigate("/menu");
      return;
    }

    setRoom(roomData);
    setIsHost(roomData.host_name === playerName);

    // Ensure categories is an array
    const categories = Array.isArray(roomData.categories) ? roomData.categories : [];

    // Fetch all answers for current round
    const { data: answersData, error: answersError } = await supabase
      .from("player_answers")
      .select(`
        player_id,
        category,
        answer,
        game_players!inner(player_name)
      `)
      .eq("room_id", roomId)
      .eq("round_number", roomData.current_round);

    if (answersError) {
      console.error("Error fetching answers:", answersError);
      return;
    }

    // Validate answers and calculate scores
    const validatedAnswers: PlayerAnswer[] = answersData.map((item: any) => {
      const answer = item.answer || "";
      const isCorrect = answer.length > 0 && 
        answer.charAt(0).toUpperCase() === roomData.current_letter.toUpperCase();
      
      return {
        player_id: item.player_id,
        player_name: item.game_players.player_name,
        category: item.category,
        answer: answer,
        is_correct: isCorrect,
      };
    });

    setAnswers(validatedAnswers);

    // Calculate scores per player
    const playerScoresMap = new Map<string, PlayerScore>();
    validatedAnswers.forEach((answer) => {
      if (!playerScoresMap.has(answer.player_name)) {
        playerScoresMap.set(answer.player_name, {
          player_name: answer.player_name,
          correct_answers: 0,
          total_answers: 0,
          score: 0,
        });
      }
      const playerScore = playerScoresMap.get(answer.player_name)!;
      playerScore.total_answers++;
      if (answer.is_correct) {
        playerScore.correct_answers++;
        playerScore.score += 10; // 10 points per correct answer
      }
    });

    const sortedScores = Array.from(playerScoresMap.values()).sort(
      (a, b) => b.score - a.score
    );
    setScores(sortedScores);
  };

  const handleNextRound = async () => {
    if (!room || !roomId) return;

    setIsProgressing(true);
    try {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];

      const { error } = await supabase
        .from("game_rooms")
        .update({
          status: "playing",
          current_letter: randomLetter,
          current_round: room.current_round + 1,
          round_started_at: new Date().toISOString(),
        })
        .eq("id", roomId);

      if (error) throw error;

      navigate(`/multiplayer-game/${roomId}`);
    } catch (error: any) {
      console.error("Error starting next round:", error);
      toast({
        title: "Error",
        description: "Failed to start next round",
        variant: "destructive",
      });
      setIsProgressing(false);
    }
  };

  const handleFinishGame = async () => {
    if (!roomId) return;

    setIsProgressing(true);
    navigate(`/multiplayer-final-results/${roomId}`);
  };

  if (!room) return null;

  const isLastRound = room.current_round >= room.total_rounds;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">Round {room.current_round} Results</h1>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Letter: {room.current_letter}
            </Badge>
          </div>

          {/* Leaderboard */}
          <Card className="p-6 mb-6 bg-gradient-primary border-0">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
            </div>
            <div className="space-y-3">
              {scores.map((player, index) => (
                <div
                  key={player.player_name}
                  className="flex items-center justify-between p-4 bg-background/20 rounded-lg backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-white w-8">
                      #{index + 1}
                    </span>
                    <span className="text-lg font-semibold text-white">
                      {player.player_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white text-sm">
                      {player.correct_answers}/{player.total_answers} correct
                    </span>
                    <Badge className="text-lg px-4 py-1 bg-white text-primary">
                      {player.score} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Answers by Category */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {(Array.isArray(room.categories) ? room.categories : []).map((category) => (
              <Card key={category} className="p-6 bg-gradient-card border-0">
                <h3 className="text-xl font-bold mb-4">{category}</h3>
                <div className="space-y-3">
                  {answers
                    .filter((a) => a.category === category)
                    .map((answer, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {answer.is_correct ? (
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-destructive flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium">{answer.player_name}</p>
                            <p className={answer.is_correct ? "text-foreground" : "text-muted-foreground line-through"}>
                              {answer.answer || "(no answer)"}
                            </p>
                          </div>
                        </div>
                        {answer.is_correct && (
                          <Badge variant="secondary">+10</Badge>
                        )}
                      </div>
                    ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Host Controls */}
          {isHost && (
            <div className="flex gap-4">
              {!isLastRound ? (
                <Button
                  onClick={handleNextRound}
                  disabled={isProgressing}
                  className="flex-1 bg-gradient-primary"
                  size="lg"
                >
                  Next Round
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinishGame}
                  disabled={isProgressing}
                  className="flex-1 bg-gradient-primary"
                  size="lg"
                >
                  Finish Game
                </Button>
              )}
            </div>
          )}

          {!isHost && (
            <Card className="p-6 text-center bg-muted">
              <p className="text-muted-foreground">
                Waiting for host to {isLastRound ? "finish the game" : "start next round"}...
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiplayerResults;
