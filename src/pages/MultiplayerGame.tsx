import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, MicOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import GameTimer from "@/components/GameTimer";
import RoundCelebration from "@/components/RoundCelebration";

interface Room {
  id: string;
  room_code: string;
  status: string;
  current_letter: string;
  current_round: number;
  total_rounds: number;
  timer_duration: number;
  round_started_at: string | null;
  categories: any; // Using any for JSONB compatibility
}

interface PlayerAnswer {
  player_id: string;
  player_name: string;
  category: string;
  answer: string;
}

const MultiplayerGame = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [allAnswers, setAllAnswers] = useState<PlayerAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [showCelebration, setShowCelebration] = useState(false);
  const [allPlayers, setAllPlayers] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  const playerName = localStorage.getItem("npat-player-name") || "";

  useEffect(() => {
    if (!roomId) return;

    fetchRoomData();
    fetchPlayerId();

    // Subscribe to answers updates and room changes
    const answersChannel = supabase
      .channel(`answers-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "player_answers",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          fetchAllAnswers();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const updatedRoom = payload.new as Room;
          setRoom(updatedRoom);
          
          // Calculate time left based on server time
          if (updatedRoom.round_started_at) {
            const startTime = new Date(updatedRoom.round_started_at).getTime();
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            const remaining = Math.max(0, updatedRoom.timer_duration - elapsed);
            setTimeLeft(remaining);
          }
          
          if (updatedRoom.status === "finished") {
            navigate(`/multiplayer-results/${roomId}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(answersChannel);
    };
  }, [roomId]);

  const fetchRoomData = async () => {
    if (!roomId) return;

    const { data, error } = await supabase
      .from("game_rooms")
      .select()
      .eq("id", roomId)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load game",
        variant: "destructive",
      });
      navigate("/menu");
      return;
    }

    setRoom(data);
    
    // Calculate time left based on server time if round has started
    if (data.round_started_at) {
      const startTime = new Date(data.round_started_at).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, data.timer_duration - elapsed);
      setTimeLeft(remaining);
    } else {
      setTimeLeft(data.timer_duration || 60);
    }
    
    // Initialize empty answers
    const initialAnswers: Record<string, string> = {};
    const cats = Array.isArray(data.categories) ? data.categories : [];
    cats.forEach((cat: string) => {
      initialAnswers[cat] = "";
    });
    setAnswers(initialAnswers);
  };

  const fetchPlayers = async () => {
    if (!roomId) return;

    const { data } = await supabase
      .from("game_players")
      .select("player_name")
      .eq("room_id", roomId);

    if (data) {
      setAllPlayers(data.map(p => p.player_name));
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [roomId]);

  const fetchPlayerId = async () => {
    if (!roomId) return;

    const { data } = await supabase
      .from("game_players")
      .select()
      .eq("room_id", roomId)
      .eq("player_name", playerName)
      .single();

    if (data) {
      setPlayerId(data.id);
    }
  };

  const fetchAllAnswers = async () => {
    if (!roomId || !room) return;

    const { data } = await supabase
      .from("player_answers")
      .select(`
        player_id,
        category,
        answer,
        game_players!inner(player_name)
      `)
      .eq("room_id", roomId)
      .eq("round_number", room.current_round);

    if (data) {
      const formattedAnswers: PlayerAnswer[] = data.map((item: any) => ({
        player_id: item.player_id,
        player_name: item.game_players.player_name,
        category: item.category,
        answer: item.answer || "",
      }));
      setAllAnswers(formattedAnswers);
    }
  };

  const handleAnswerChange = (category: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [category]: value }));
  };

  const startVoiceInput = (category: string) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      sonnerToast.error("Voice input is not supported in your browser. Try Chrome or Edge.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording((prev) => ({ ...prev, [category]: true }));
        sonnerToast.info("🎤 Listening... Speak now!");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAnswers((prev) => ({ ...prev, [category]: transcript }));
        sonnerToast.success(`Got it: "${transcript}"`);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          sonnerToast.error("Microphone access denied. Please allow microphone access.");
        } else if (event.error === 'no-speech') {
          sonnerToast.error("No speech detected. Please try again.");
        } else {
          sonnerToast.error(`Voice input error: ${event.error}`);
        }
        setIsRecording((prev) => ({ ...prev, [category]: false }));
      };

      recognition.onend = () => {
        setIsRecording((prev) => ({ ...prev, [category]: false }));
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      sonnerToast.error("Failed to start voice input");
      setIsRecording((prev) => ({ ...prev, [category]: false }));
    }
  };

  const stopVoiceInput = (category: string) => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording((prev) => ({ ...prev, [category]: false }));
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!room || showCelebration) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [room, timeLeft, showCelebration]);

  const handleTimeUp = async () => {
    if (!isSubmitting && !showCelebration) {
      await submitAnswers();
    }
  };

  const submitAnswers = async () => {
    if (!roomId || !playerId || !room) {
      console.error("Missing required data:", { roomId, playerId, room });
      toast({
        title: "Error",
        description: "Missing required data",
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) {
      console.log("Already submitting, skipping");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Ensure categories is an array
      const categories = Array.isArray(room.categories) 
        ? room.categories 
        : [];

      if (categories.length === 0) {
        throw new Error("No categories found");
      }

      const answerRecords = categories.map((category: string) => ({
        room_id: roomId,
        player_id: playerId,
        round_number: room.current_round,
        category,
        answer: answers[category] || "",
      }));

      const { error } = await supabase
        .from("player_answers")
        .upsert(answerRecords, {
          onConflict: "room_id,player_id,round_number,category",
        });

      if (error) throw error;

      // Show celebration
      setShowCelebration(true);
      
      toast({
        title: "Submitted!",
        description: "Your answers have been submitted",
      });
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit answers",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setIsSubmitting(false);
    setTimeLeft(room?.timer_duration || 60);
    
    // Reset answers for next round
    const initialAnswers: Record<string, string> = {};
    const cats = Array.isArray(room?.categories) ? room.categories : [];
    cats.forEach((cat: string) => {
      initialAnswers[cat] = "";
    });
    setAnswers(initialAnswers);
  };

  if (!room) return null;

  return (
    <div className="min-h-screen p-6">
      {showCelebration && (
        <RoundCelebration
          players={allPlayers}
          onComplete={handleCelebrationComplete}
        />
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">Round {room.current_round}</h1>
            <div className="text-sm text-muted-foreground">
              Room: {room.room_code}
            </div>
          </div>

          <div className="mb-6">
            <GameTimer
              timeLeft={timeLeft}
              totalTime={room.timer_duration}
              onTimeUp={handleTimeUp}
            />
          </div>
          <Card className="p-8 text-center shadow-glow bg-gradient-primary border-0">
            <p className="text-xl text-white mb-2">Current Letter</p>
            <div className="text-8xl font-bold text-white">
              {room.current_letter}
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Answers</h2>
            <div className="space-y-4">
              {room.categories.map((category) => (
                <div key={category}>
                  <Label htmlFor={category} className="mb-2">
                    {category}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={category}
                      value={answers[category] || ""}
                      onChange={(e) => handleAnswerChange(category, e.target.value)}
                      placeholder={`Enter ${category.toLowerCase()} starting with ${room.current_letter}`}
                    />
                    <Button
                      type="button"
                      variant={isRecording[category] ? "destructive" : "outline"}
                      size="icon"
                      onClick={() =>
                        isRecording[category]
                          ? stopVoiceInput(category)
                          : startVoiceInput(category)
                      }
                    >
                      {isRecording[category] ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={submitAnswers}
              disabled={isSubmitting || showCelebration}
              className="w-full mt-6 bg-gradient-primary"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Answers"}
            </Button>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Other Players</h2>
            <div className="space-y-4">
              {room.categories.map((category) => (
                <Card key={category} className="p-4 bg-gradient-card border-0">
                  <h3 className="font-semibold mb-2">{category}</h3>
                  <div className="space-y-1 text-sm">
                    {allAnswers
                      .filter((a) => a.category === category && a.player_name !== playerName)
                      .map((a, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-muted-foreground">{a.player_name}:</span>
                          <span className="font-medium">{a.answer || "..."}</span>
                        </div>
                      ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerGame;
