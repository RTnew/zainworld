import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, Users, Trophy, ArrowRight } from "lucide-react";

const onboardingSteps = [
  {
    icon: Gamepad2,
    title: "Welcome to NPAT!",
    description: "The classic Name, Place, Animal, Thing game with a modern twist. Challenge your creativity and speed!",
  },
  {
    icon: Users,
    title: "How to Play",
    description: "Pick a random letter and fill in categories: Name, Place, Animal, and Thing. Be quick and creative!",
  },
  {
    icon: Trophy,
    title: "Score & Win",
    description: "Unique answers get full points. Common answers get half. First to finish gets bonus points!",
  },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already seen onboarding
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    
    if (hasSeenOnboarding) {
      // Skip onboarding and go directly to menu
      navigate("/menu");
    }
  }, [navigate]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("hasSeenOnboarding", "true");
      navigate("/menu");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/menu");
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-card bg-gradient-card border-0 animate-scale-in">
          <div className="text-center mb-8">
            <div className="inline-flex p-6 bg-gradient-primary rounded-3xl shadow-glow mb-6">
              <Icon className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">{step.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? "w-8 bg-gradient-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentStep < onboardingSteps.length - 1 && (
              <Button variant="outline" onClick={handleSkip} className="flex-1">
                Skip
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1 bg-gradient-primary hover:shadow-hover transition-all">
              {currentStep < onboardingSteps.length - 1 ? (
                <>
                  Next <ArrowRight className="ml-2 w-4 h-4" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
