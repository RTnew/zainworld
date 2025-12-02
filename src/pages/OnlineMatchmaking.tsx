import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Coins, Loader2, Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OnlineMatchmaking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const stake = parseInt(searchParams.get("stake") || "10");
  const playerName = localStorage.getItem("playerName") || "";

  const [queueId, setQueueId] = useState<string | null>(null);
  const [searchTime, setSearchTime] = useState(0);
  const [playersInQueue, setPlayersInQueue] = useState(0);

  useEffect(() => {
    if (!playerName) {
      navigate("/online-match-setup");
      return;
    }

    joinQueue();

    return () => {
      if (queueId) {
        leaveQueue();
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSearchTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Subscribe to queue changes
    const channel = supabase
      .channel("matchmaking")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matchmaking_queue",
          filter: `stake_amount=eq.${stake}`,
        },
        async (payload) => {
          console.log("Queue update:", payload);
          await checkForMatch();
          countPlayersInQueue();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queueId, stake]);

  const countPlayersInQueue = async () => {
    const { count } = await supabase
      .from("matchmaking_queue")
      .select("*", { count: "exact", head: true })
      .eq("stake_amount", stake)
      .eq("status", "waiting");
    setPlayersInQueue(count || 0);
  };

  const joinQueue = async () => {
    // First, check if already in queue
    await supabase
      .from("matchmaking_queue")
      .delete()
      .eq("player_name", playerName)
      .eq("status", "waiting");

    // Join queue
    const { data, error } = await supabase
      .from("matchmaking_queue")
      .insert({
        player_name: playerName,
        stake_amount: stake,
        status: "waiting",
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to join matchmaking queue.",
        variant: "destructive",
      });
      return;
    }

    setQueueId(data.id);
    countPlayersInQueue();
    
    // Check for immediate match
    await checkForMatch();
  };

  const checkForMatch = async () => {
    if (!queueId) return;

    // Find another player waiting with same stake
    const { data: waitingPlayers } = await supabase
      .from("matchmaking_queue")
      .select("*")
      .eq("stake_amount", stake)
      .eq("status", "waiting")
      .neq("player_name", playerName)
      .order("created_at", { ascending: true })
      .limit(1);

    if (waitingPlayers && waitingPlayers.length > 0) {
      const opponent = waitingPlayers[0];
      
      // Create match
      const letters = "ABCDEFGHIJKLMNOPRSTUVWYZ";
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      
      const { data: match, error: matchError } = await supabase
        .from("online_matches")
        .insert({
          player1_name: playerName,
          player2_name: opponent.player_name,
          stake_amount: stake,
          current_letter: randomLetter,
          round_started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (matchError) {
        console.error("Match creation error:", matchError);
        return;
      }

      // Update both players in queue
      await supabase
        .from("matchmaking_queue")
        .update({ status: "matched", match_id: match.id })
        .in("id", [queueId, opponent.id]);

      // Deduct coins from both players
      const { data: wallet1 } = await supabase
        .from("user_wallets")
        .select("coins")
        .eq("player_name", playerName)
        .single();
      
      if (wallet1) {
        await supabase
          .from("user_wallets")
          .update({ coins: wallet1.coins - stake })
          .eq("player_name", playerName);
      }

      const { data: wallet2 } = await supabase
        .from("user_wallets")
        .select("coins")
        .eq("player_name", opponent.player_name)
        .single();
      
      if (wallet2) {
        await supabase
          .from("user_wallets")
          .update({ coins: wallet2.coins - stake })
          .eq("player_name", opponent.player_name);
      }

      // Navigate to match
      navigate(`/online-match/${match.id}`);
    }

    // Check if we were matched by someone else
    const { data: ourQueue } = await supabase
      .from("matchmaking_queue")
      .select("*")
      .eq("id", queueId)
      .single();

    if (ourQueue?.status === "matched" && ourQueue.match_id) {
      navigate(`/online-match/${ourQueue.match_id}`);
    }
  };

  const leaveQueue = async () => {
    if (queueId) {
      await supabase
        .from("matchmaking_queue")
        .delete()
        .eq("id", queueId);
    }
  };

  const handleCancel = async () => {
    await leaveQueue();
    navigate("/online-match-setup");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="mr-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Finding Match</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Stake Display */}
        <Card className="p-4 bg-gradient-card border-0 shadow-card mb-8 w-full animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold text-foreground">{stake} coins</span>
            <span className="text-muted-foreground">entry fee</span>
          </div>
        </Card>

        {/* Searching Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-primary/30 animate-ping absolute" />
          <div className="w-32 h-32 rounded-full border-4 border-primary/50 animate-pulse absolute" style={{ animationDelay: "0.5s" }} />
          <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center relative">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        </div>

        {/* Search Info */}
        <div className="text-center mb-8">
          <p className="text-xl font-semibold text-foreground mb-2">
            Searching for opponent...
          </p>
          <p className="text-3xl font-bold text-primary mb-2">
            {formatTime(searchTime)}
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{playersInQueue} players in queue</span>
          </div>
        </div>

        {/* Cancel Button */}
        <Button
          variant="outline"
          onClick={handleCancel}
          className="w-full max-w-xs h-14"
        >
          <X className="mr-2 w-5 h-5" />
          Cancel Search
        </Button>
      </div>
    </div>
  );
};

export default OnlineMatchmaking;
