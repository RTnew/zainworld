import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Card } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

interface RoundCelebrationProps {
  players: string[];
  onComplete: () => void;
  duration?: number;
}

const RoundCelebration = ({ players, onComplete, duration = 3000 }: RoundCelebrationProps) => {
  useEffect(() => {
    // Fire confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete, duration]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <Card className="p-8 max-w-md w-full mx-4 shadow-glow bg-gradient-card border-0 animate-scale-in">
        <div className="text-center space-y-6">
          <div className="flex justify-center gap-2">
            <Trophy className="w-12 h-12 text-primary animate-bounce" />
            <Star className="w-12 h-12 text-secondary animate-bounce" style={{ animationDelay: "0.1s" }} />
            <Trophy className="w-12 h-12 text-accent animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Round Complete!
          </h2>
          
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">Great job!</p>
            {players.length > 0 && (
              <div className="space-y-1">
                {players.map((player, idx) => (
                  <p 
                    key={idx} 
                    className="text-xl font-semibold text-primary animate-fade-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {player}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RoundCelebration;
