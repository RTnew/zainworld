import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/menu")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>

        <Card className="p-6 shadow-card bg-gradient-card border-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Toggle dark mode on or off
                </p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </div>
        </Card>

        <div className="mt-8">
          <Card className="p-6 shadow-card bg-gradient-card border-0">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Name Place Animal Thing (NPAT) Game</p>
              <p>Version 1.0.0</p>
              <p>Think fast and fill the categories!</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
