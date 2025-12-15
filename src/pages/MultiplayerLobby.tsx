import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy, Users, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: string;
  player_name: string;
  is_host: boolean;
}

interface Room {
  id: string;
  room_code: string;
  host_name: string;
  status: string;
  categories: any; // Using any for JSONB compatibility
  total_rounds: number;
}

const MultiplayerLobby = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const playerName = localStorage.getItem("npat-player-name") || "";

  useEffect(() => {
    if (!roomId) return;

    fetchRoomData();

    // Subscribe to room updates
    const roomChannel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          console.log("Room update:", payload);
          if (payload.eventType === "UPDATE") {
            const updatedRoom = payload.new as Room;
            setRoom(updatedRoom);
            if (updatedRoom.status === "playing") {
              navigate(`/multiplayer-game/${roomId}`);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_players",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          fetchPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, [roomId]);

  const fetchRoomData = async () => {
    if (!roomId) return;

    const { data: roomData, error: roomError } = await supabase
      .from("game_rooms")
      .select()
      .eq("id", roomId)
      .single();

    if (roomError) {
      toast({
        title: "Error",
        description: "Failed to load room",
        variant: "destructive",
      });
      navigate("/menu");
      return;
    }

    setRoom(roomData);
    fetchPlayers();
  };

  const fetchPlayers = async () => {
    if (!roomId) return;

    const { data: playersData } = await supabase
      .from("game_players")
      .select()
      .eq("room_id", roomId)
      .order("joined_at", { ascending: true });

    if (playersData) {
      setPlayers(playersData);
      const currentPlayer = playersData.find((p) => p.player_name === playerName);
      setIsHost(currentPlayer?.is_host || false);
    }
  };

  const copyRoomCode = () => {
    if (room?.room_code) {
      navigator.clipboard.writeText(room.room_code);
      toast({
        title: "Copied!",
        description: "Room code copied to clipboard",
      });
    }
  };

  const startGame = async () => {
    if (!roomId || !room) return;

    setIsStarting(true);
    try {
      // Generate random letter
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];

      const { error } = await supabase
        .from("game_rooms")
        .update({
          status: "playing",
          current_letter: randomLetter,
          current_round: 1,
          round_started_at: new Date().toISOString(),
        })
        .eq("id", roomId);

      if (error) throw error;

      navigate(`/multiplayer-game/${roomId}`);
    } catch (error: any) {
      console.error("Error starting game:", error);
      toast({
        title: "Error",
        description: "Failed to start game",
        variant: "destructive",
      });
      setIsStarting(false);
    }
  };

  if (!room) return null;

  return (
    <div className="flex flex-col flex-1 p-4 pb-8 overflow-y-auto">
      <div className="w-full max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/multiplayer-setup")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Game Lobby</h1>
        </div>

        <Card className="p-4 mb-4 shadow-card bg-gradient-card border-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Room Code</h2>
            <Button onClick={copyRoomCode} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold font-mono text-primary mb-1">
              {room.room_code}
            </div>
            <p className="text-sm text-muted-foreground">
              Share this code with friends
            </p>
          </div>
        </Card>

        <Card className="p-4 mb-4 shadow-card bg-gradient-card border-0">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">
              Players ({players.length})
            </h2>
          </div>
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2.5 bg-muted rounded-lg"
              >
                <span className="font-medium text-sm">{player.player_name}</span>
                {player.is_host && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                    Host
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 shadow-card bg-gradient-card border-0">
          <h2 className="text-base font-bold mb-3">Game Settings</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rounds:</span>
              <span className="font-semibold">{room.total_rounds}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Categories:</span>
              <span className="font-semibold">{room.categories.length}</span>
            </div>
          </div>
        </Card>

        {isHost && (
          <Button
            onClick={startGame}
            disabled={isStarting || players.length < 2}
            className="w-full mt-4 bg-gradient-primary"
            size="default"
          >
            <Play className="w-4 h-4 mr-2" />
            {isStarting ? "Starting..." : "Start Game"}
          </Button>
        )}

        {!isHost && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Waiting for host to start the game...
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiplayerLobby;
