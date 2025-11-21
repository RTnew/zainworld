import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Users, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MultiplayerSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [timeLimit, setTimeLimit] = useState([60]);
  const [rounds, setRounds] = useState([5]);

  useEffect(() => {
    // Load saved player name from localStorage
    const savedName = localStorage.getItem("npat-player-name");
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const code = generateRoomCode();
      const categories = ["Name", "Place", "Animal", "Thing"];

      const { data: room, error: roomError } = await supabase
        .from("game_rooms")
        .insert({
          room_code: code,
          host_name: playerName,
          categories,
          total_rounds: rounds[0],
          timer_duration: timeLimit[0],
        })
        .select()
        .single();

      if (roomError) throw roomError;

      const { error: playerError } = await supabase
        .from("game_players")
        .insert({
          room_id: room.id,
          player_name: playerName,
          is_host: true,
        });

      if (playerError) throw playerError;

      localStorage.setItem("npat-player-name", playerName);
      navigate(`/multiplayer-lobby/${room.id}`);
    } catch (error: any) {
      console.error("Error creating room:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create room",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and room code",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      const { data: room, error: roomError } = await supabase
        .from("game_rooms")
        .select()
        .eq("room_code", roomCode.toUpperCase())
        .single();

      if (roomError || !room) {
        toast({
          title: "Room Not Found",
          description: "Invalid room code",
          variant: "destructive",
        });
        return;
      }

      if (room.status !== "waiting") {
        toast({
          title: "Game In Progress",
          description: "This game has already started",
          variant: "destructive",
        });
        return;
      }

      const { error: playerError } = await supabase
        .from("game_players")
        .insert({
          room_id: room.id,
          player_name: playerName,
          is_host: false,
        });

      if (playerError) throw playerError;

      localStorage.setItem("npat-player-name", playerName);
      navigate(`/multiplayer-lobby/${room.id}`);
    } catch (error: any) {
      console.error("Error joining room:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to join room",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold">Multiplayer</h1>
        </div>

        <div className="mb-6">
          <Label htmlFor="playerName" className="text-lg mb-2">
            Your Name
          </Label>
          <Input
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="text-lg"
          />
        </div>

        <Card className="p-6 mb-6 shadow-card bg-gradient-card border-0">
          <h2 className="text-xl font-bold mb-4">Game Settings</h2>
          
          <div className="space-y-6 mb-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Time per Round: {timeLimit[0]} seconds
              </Label>
              <Slider
                value={timeLimit}
                onValueChange={setTimeLimit}
                min={30}
                max={180}
                step={15}
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">
                Number of Rounds: {rounds[0]}
              </Label>
              <Slider
                value={rounds}
                onValueChange={setRounds}
                min={1}
                max={10}
                step={1}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-card bg-gradient-card border-0">
          <div className="flex items-center gap-3 mb-4">
            <Plus className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Create Room</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Start a new game and invite friends with a room code
          </p>
          <Button
            onClick={createRoom}
            disabled={isCreating}
            className="w-full bg-gradient-primary"
            size="lg"
          >
            {isCreating ? "Creating..." : "Create Room"}
          </Button>
        </Card>

        <Card className="p-6 shadow-card bg-gradient-card border-0">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-secondary" />
            <h2 className="text-2xl font-bold">Join Room</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Enter a room code to join a friend's game
          </p>
          <div className="mb-4">
            <Label htmlFor="roomCode" className="mb-2">
              Room Code
            </Label>
            <Input
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-lg text-center font-mono"
            />
          </div>
          <Button
            onClick={joinRoom}
            disabled={isJoining}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            {isJoining ? "Joining..." : "Join Room"}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default MultiplayerSetup;
