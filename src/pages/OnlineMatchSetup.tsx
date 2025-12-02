import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Coins, Swords, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STAKE_OPTIONS = [
  { amount: 10, label: "Casual", icon: "🎮", color: "bg-success" },
  { amount: 50, label: "Competitive", icon: "⚔️", color: "bg-secondary" },
  { amount: 100, label: "High Stakes", icon: "🏆", color: "bg-accent" },
];

const OnlineMatchSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState("");
  const [coins, setCoins] = useState(0);
  const [selectedStake, setSelectedStake] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      setPlayerName(savedName);
      fetchWallet(savedName);
    }
  }, []);

  const fetchWallet = async (name: string) => {
    const { data, error } = await supabase
      .from("user_wallets")
      .select("*")
      .eq("player_name", name)
      .maybeSingle();

    if (data) {
      setCoins(data.coins);
    } else if (!error) {
      // Create new wallet with 500 coins
      const { data: newWallet } = await supabase
        .from("user_wallets")
        .insert({ player_name: name, coins: 500 })
        .select()
        .single();
      if (newWallet) {
        setCoins(newWallet.coins);
      }
    }
  };

  const handleNameChange = async (name: string) => {
    setPlayerName(name);
    localStorage.setItem("playerName", name);
    if (name.trim()) {
      await fetchWallet(name.trim());
    }
  };

  const handleFindMatch = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Enter your name",
        description: "Please enter your player name to continue.",
        variant: "destructive",
      });
      return;
    }

    if (selectedStake === null) {
      toast({
        title: "Select stake",
        description: "Please select an entry fee to play.",
        variant: "destructive",
      });
      return;
    }

    if (coins < selectedStake) {
      toast({
        title: "Insufficient coins",
        description: "You don't have enough coins for this stake.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    localStorage.setItem("playerName", playerName.trim());

    // Navigate to matchmaking with stake
    navigate(`/online-matchmaking?stake=${selectedStake}`);
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/menu")}
          className="mr-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Online Match</h1>
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Coins Display */}
        <Card className="p-4 bg-gradient-card border-0 shadow-card mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-full">
                <Coins className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p className="text-2xl font-bold text-foreground">{coins}</p>
              </div>
            </div>
            <Zap className="w-8 h-8 text-amber-500 animate-pulse" />
          </div>
        </Card>

        {/* Player Name */}
        <Card className="p-4 bg-gradient-card border-0 shadow-card mb-6 animate-slide-up">
          <Label htmlFor="playerName" className="text-sm text-muted-foreground mb-2 block">
            Player Name
          </Label>
          <Input
            id="playerName"
            value={playerName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter your name"
            className="text-lg"
          />
        </Card>

        {/* Stake Selection */}
        <Card className="p-4 bg-gradient-card border-0 shadow-card mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Label className="text-sm text-muted-foreground mb-4 block">
            Select Entry Fee
          </Label>
          <div className="space-y-3">
            {STAKE_OPTIONS.map((option) => (
              <button
                key={option.amount}
                onClick={() => setSelectedStake(option.amount)}
                disabled={coins < option.amount}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  selectedStake === option.amount
                    ? "border-primary bg-primary/10"
                    : coins < option.amount
                    ? "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                    : "border-border hover:border-primary/50 bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">Winner takes {option.amount * 2} coins</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-foreground">{option.amount}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Find Match Button */}
        <Button
          onClick={handleFindMatch}
          disabled={isLoading || !playerName.trim() || selectedStake === null}
          className="w-full h-16 text-lg bg-gradient-primary hover:shadow-hover transition-all animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Swords className="mr-2 w-6 h-6" />
          {isLoading ? "Finding..." : "Find Match"}
        </Button>
      </div>
    </div>
  );
};

export default OnlineMatchSetup;
