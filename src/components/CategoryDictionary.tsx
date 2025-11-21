import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

const categoryExamples = {
  Name: [
    "Alice", "Benjamin", "Catherine", "Daniel", "Emma", "Frank", "Grace", "Henry",
    "Isabella", "Jack", "Katherine", "Liam", "Maria", "Nathan", "Olivia", "Patrick",
    "Quinn", "Rachel", "Samuel", "Taylor", "Uma", "Vincent", "Wendy", "Xavier",
    "Yasmin", "Zachary"
  ],
  Place: [
    "Amsterdam", "Berlin", "Chicago", "Dubai", "Edinburgh", "Florence", "Geneva",
    "Helsinki", "Istanbul", "Jakarta", "Kyoto", "London", "Madrid", "Naples",
    "Oslo", "Paris", "Quebec", "Rome", "Sydney", "Tokyo", "Utah", "Vienna",
    "Warsaw", "York", "Zurich"
  ],
  Animal: [
    "Antelope", "Bear", "Cheetah", "Dolphin", "Elephant", "Fox", "Giraffe",
    "Hedgehog", "Iguana", "Jaguar", "Kangaroo", "Lion", "Monkey", "Narwhal",
    "Octopus", "Penguin", "Quail", "Rabbit", "Snake", "Tiger", "Urchin",
    "Vulture", "Whale", "Yak", "Zebra"
  ],
  Thing: [
    "Apple", "Ball", "Chair", "Desk", "Eraser", "Fan", "Guitar", "Hat",
    "Ice cream", "Jacket", "Kite", "Lamp", "Mirror", "Notebook", "Orange",
    "Pencil", "Quilt", "Ruler", "Scissors", "Table", "Umbrella", "Vase",
    "Watch", "Xylophone", "Yarn", "Zipper"
  ]
};

export const CategoryDictionary = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="w-4 h-4" />
          View Examples
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle className="text-2xl">Category Dictionary</SheetTitle>
          <SheetDescription>
            Learn examples for each category to help you during the game
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(80vh-120px)] mt-6">
          <div className="space-y-6 pr-4">
            {Object.entries(categoryExamples).map(([category, examples]) => (
              <Card key={category} className="p-4 shadow-card bg-gradient-card border-0">
                <h3 className="text-xl font-bold mb-3 text-primary">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {examples.map((example, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-md bg-background/50 text-sm font-medium"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
