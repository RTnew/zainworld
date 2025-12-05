import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Coins, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import RoundCelebration from "@/components/RoundCelebration";

interface Match {
  id: string;
  player1_name: string;
  player2_name: string;
  stake_amount: number;
  current_letter: string;
  current_round: number;
  total_rounds: number;
  timer_duration: number;
  round_started_at: string;
  categories: string[];
  status: string;
}

const OnlineMatch = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const playerName = localStorage.getItem("playerName") || "";

  const [match, setMatch] = useState<Match | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [opponentAnswers, setOpponentAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [recordingCategory, setRecordingCategory] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (!matchId) return;
    fetchMatch();

    // Subscribe to match updates
    const channel = supabase
      .channel(`match-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "online_matches",
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          const updated = payload.new as Match;
          setMatch(updated);
          if (updated.status === "round_complete") {
            setShowCelebration(true);
          } else if (updated.status === "finished") {
            navigate(`/online-match-results/${matchId}`);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "online_match_answers",
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          fetchOpponentAnswers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  useEffect(() => {
    if (!match?.round_started_at) return;

    const startTime = new Date(match.round_started_at).getTime();
    const duration = match.timer_duration * 1000;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0 && !hasSubmittedRef.current) {
        handleTimeUp();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [match?.round_started_at, match?.timer_duration]);

  const fetchMatch = async () => {
    const { data, error } = await supabase
      .from("online_matches")
      .select("*")
      .eq("id", matchId)
      .single();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Failed to load match.",
        variant: "destructive",
      });
      return;
    }

    setMatch({
      ...data,
      categories: data.categories as string[],
    });
    setTimeLeft(data.timer_duration);
    hasSubmittedRef.current = false;
    setAnswers({});
    fetchOpponentAnswers();
  };

  const fetchOpponentAnswers = async () => {
    if (!match) return;
    
    const opponentName = match.player1_name === playerName 
      ? match.player2_name 
      : match.player1_name;

    const { data } = await supabase
      .from("online_match_answers")
      .select("*")
      .eq("match_id", matchId)
      .eq("player_name", opponentName)
      .eq("round_number", match.current_round);

    if (data) {
      const mapped: Record<string, string> = {};
      data.forEach((a) => {
        mapped[a.category] = a.answer || "";
      });
      setOpponentAnswers(mapped);
    }
  };

  const handleAnswerChange = (category: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [category]: value }));
  };

  const startVoiceInput = (category: string) => {
    if (!("webkitSpeechRecognition" in window)) {
      toast({
        title: "Not supported",
        description: "Voice input is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleAnswerChange(category, transcript);
      setRecordingCategory(null);
    };

    recognitionRef.current.onerror = () => {
      setRecordingCategory(null);
    };

    recognitionRef.current.onend = () => {
      setRecordingCategory(null);
    };

    setRecordingCategory(category);
    recognitionRef.current.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecordingCategory(null);
  };

  const handleTimeUp = async () => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    await submitAnswers();
  };

  const submitAnswers = async () => {
    if (!match || isSubmitting) return;
    setIsSubmitting(true);

    const answersToSubmit = match.categories.map((category) => ({
      match_id: matchId,
      player_name: playerName,
      round_number: match.current_round,
      category,
      answer: answers[category] || "",
      is_valid: (answers[category] || "").toLowerCase().startsWith(match.current_letter.toLowerCase()),
    }));

    await supabase.from("online_match_answers").upsert(answersToSubmit, {
      onConflict: "match_id,player_name,round_number,category",
    });

    // Check if both players submitted
    const { count } = await supabase
      .from("online_match_answers")
      .select("*", { count: "exact", head: true })
      .eq("match_id", matchId)
      .eq("round_number", match.current_round);

    const expectedAnswers = match.categories.length * 2; // Both players
    if (count && count >= expectedAnswers) {
      // Both submitted, navigate to results
      navigate(`/online-match-results/${matchId}`);
    }

    setIsSubmitting(false);
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    fetchMatch();
  };

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const opponent = match.player1_name === playerName 
    ? match.player2_name 
    : match.player1_name;

  if (showCelebration) {
    return (
      <RoundCelebration
        players={[playerName, opponent]}
        onComplete={handleCelebrationComplete}
      />
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-full">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">{playerName}</span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 rounded-full">
          <Coins className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-amber-500">{match.stake_amount * 2}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{opponent}</span>
          <div className="p-2 bg-accent/20 rounded-full">
            <User className="w-4 h-4 text-accent" />
          </div>
        </div>
      </div>

      {/* Round Info */}
      <Card className="p-4 bg-gradient-card border-0 shadow-card mb-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Round</p>
            <p className="text-xl font-bold text-foreground">
              {match.current_round}/{match.total_rounds}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Letter</p>
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-4xl font-bold text-white">
                {match.current_letter}
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Time</p>
            <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-destructive' : 'text-foreground'}`}>
              {timeLeft}s
            </div>
          </div>
        </div>
      </Card>

      {/* Answer Inputs */}
      <div className="space-y-3">
        {match.categories.map((category) => (
          <Card key={category} className="p-3 bg-gradient-card border-0 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {category}
              </span>
              {opponentAnswers[category] && (
                <span className="text-xs text-muted-foreground">
                  Opponent: {opponentAnswers[category]}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={answers[category] || ""}
                onChange={(e) => handleAnswerChange(category, e.target.value)}
                placeholder={`${category} starting with ${match.current_letter}...`}
                className="flex-1"
                disabled={timeLeft === 0}
              />
              <Button
                variant={recordingCategory === category ? "destructive" : "outline"}
                size="icon"
                onClick={() =>
                  recordingCategory === category
                    ? stopVoiceInput()
                    : startVoiceInput(category)
                }
                disabled={timeLeft === 0}
              >
                {recordingCategory === category ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <Button
        onClick={submitAnswers}
        disabled={isSubmitting || timeLeft === 0}
        className="w-full mt-6 h-14 text-lg bg-gradient-primary hover:shadow-hover"
      >
        {isSubmitting ? "Submitting..." : "Submit Answers"}
      </Button>
    </div>
  );
};

export default OnlineMatch;
