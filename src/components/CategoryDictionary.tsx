import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

const categoryExamples = {
  Name: {
    A: ["Aaron", "Abigail", "Adam", "Adrian", "Alan", "Albert", "Alex", "Alice", "Allison", "Amanda", "Amy", "Andrea", "Andrew", "Angela", "Anna", "Anthony", "Arthur", "Ashley"],
    B: ["Barbara", "Benjamin", "Betty", "Beverly", "Billy", "Bobby", "Brandon", "Brenda", "Brian", "Bruce", "Bryan"],
    C: ["Cameron", "Carl", "Carol", "Carolyn", "Catherine", "Charles", "Charlotte", "Cheryl", "Christian", "Christina", "Christine", "Christopher", "Cynthia"],
    D: ["Daniel", "Danielle", "David", "Deborah", "Debra", "Dennis", "Diana", "Diane", "Donald", "Donna", "Doris", "Dorothy", "Douglas"],
    E: ["Edward", "Elizabeth", "Emily", "Emma", "Eric", "Ethan", "Eugene", "Evelyn"],
    F: ["Frances", "Frank", "Fred", "Frederick"],
    G: ["Gabriel", "Gary", "George", "Gerald", "Gloria", "Grace", "Gregory"],
    H: ["Hannah", "Harold", "Harry", "Heather", "Helen", "Henry", "Howard"],
    I: ["Ian", "Isaac", "Isabella", "Isaiah"],
    J: ["Jack", "Jacob", "Jacqueline", "James", "Janet", "Janice", "Jason", "Jean", "Jeffrey", "Jennifer", "Jeremy", "Jerry", "Jessica", "Joan", "Joe", "John", "Jonathan", "Jordan", "Jose", "Joseph", "Joshua", "Joyce", "Juan", "Judith", "Judy", "Julia", "Julie", "Justin"],
    K: ["Karen", "Katherine", "Kathleen", "Kathryn", "Kayla", "Keith", "Kelly", "Kenneth", "Kevin", "Kimberly"],
    L: ["Larry", "Laura", "Lauren", "Lawrence", "Leonard", "Liam", "Linda", "Lisa", "Logan", "Lori", "Louis", "Louise"],
    M: ["Madison", "Margaret", "Maria", "Marie", "Marilyn", "Mark", "Martha", "Martin", "Mary", "Matthew", "Megan", "Melissa", "Michael", "Michelle", "Mildred", "Mohammad"],
    N: ["Nancy", "Nathan", "Natalie", "Nicholas", "Nicole", "Noah", "Norma"],
    O: ["Olivia", "Oscar"],
    P: ["Pamela", "Patricia", "Patrick", "Paul", "Peter", "Philip", "Phyllis"],
    Q: ["Quinn", "Quentin"],
    R: ["Rachel", "Ralph", "Randy", "Raymond", "Rebecca", "Richard", "Robert", "Roger", "Ronald", "Rose", "Roy", "Ruby", "Russell", "Ruth", "Ryan"],
    S: ["Samuel", "Sandra", "Sara", "Sarah", "Scott", "Sean", "Sharon", "Shirley", "Sophia", "Stephanie", "Stephen", "Steven", "Susan"],
    T: ["Taylor", "Teresa", "Terry", "Theresa", "Thomas", "Timothy", "Tyler"],
    U: ["Uma", "Ulysses", "Ursula"],
    V: ["Victor", "Victoria", "Vincent", "Virginia"],
    W: ["Walter", "Wayne", "William", "Willie"],
    X: ["Xavier", "Xander"],
    Y: ["Yasmin", "Yvonne"],
    Z: ["Zachary", "Zoe"]
  },
  Place: {
    A: ["Adelaide", "Afghanistan", "Africa", "Alabama", "Alaska", "Albania", "Algeria", "Amsterdam", "Andorra", "Angola", "Antarctica", "Argentina", "Arizona", "Arkansas", "Armenia", "Asia", "Athens", "Atlanta", "Australia", "Austria"],
    B: ["Baghdad", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Barcelona", "Beijing", "Belarus", "Belgium", "Berlin", "Bermuda", "Bhutan", "Bolivia", "Boston", "Botswana", "Brazil", "Brisbane", "Britain", "Brussels", "Budapest", "Bulgaria"],
    C: ["Cairo", "California", "Cambodia", "Cameroon", "Canada", "Canberra", "Cape Town", "Cardiff", "Chad", "Chicago", "Chile", "China", "Colombia", "Colorado", "Connecticut", "Copenhagen", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic"],
    D: ["Dallas", "Damascus", "Delaware", "Denmark", "Denver", "Detroit", "Dominican Republic", "Dubai", "Dublin", "Dundee"],
    E: ["Ecuador", "Edinburgh", "Egypt", "England", "Estonia", "Ethiopia", "Europe"],
    F: ["Fiji", "Finland", "Florence", "Florida", "France", "Frankfurt"],
    G: ["Gabon", "Georgia", "Germany", "Ghana", "Glasgow", "Greece", "Greenland", "Guatemala", "Guinea"],
    H: ["Haiti", "Hamburg", "Hawaii", "Helsinki", "Honduras", "Hong Kong", "Houston", "Hungary"],
    I: ["Iceland", "Idaho", "Illinois", "India", "Indiana", "Indonesia", "Iowa", "Iran", "Iraq", "Ireland", "Israel", "Istanbul", "Italy"],
    J: ["Jakarta", "Jamaica", "Japan", "Jordan"],
    K: ["Kansas", "Kazakhstan", "Kentucky", "Kenya", "Korea", "Kuwait", "Kyoto"],
    L: ["Laos", "Las Vegas", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lisbon", "Lithuania", "London", "Los Angeles", "Louisiana", "Luxembourg"],
    M: ["Madagascar", "Madrid", "Maine", "Malawi", "Malaysia", "Mali", "Malta", "Manchester", "Manhattan", "Maryland", "Massachusetts", "Melbourne", "Memphis", "Mexico", "Miami", "Michigan", "Milan", "Minnesota", "Mississippi", "Missouri", "Monaco", "Mongolia", "Montana", "Montreal", "Morocco", "Moscow", "Munich", "Myanmar"],
    N: ["Nairobi", "Namibia", "Naples", "Nebraska", "Nepal", "Netherlands", "Nevada", "New Delhi", "New Hampshire", "New Jersey", "New Mexico", "New York", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Carolina", "North Dakota", "North Korea", "Norway"],
    O: ["Ohio", "Oklahoma", "Oman", "Oregon", "Orlando", "Oslo", "Ottawa", "Oxford"],
    P: ["Pakistan", "Palestine", "Panama", "Paraguay", "Paris", "Pennsylvania", "Perth", "Peru", "Philadelphia", "Philippines", "Phoenix", "Poland", "Portugal", "Prague", "Puerto Rico"],
    Q: ["Qatar", "Quebec", "Queensland"],
    R: ["Rhode Island", "Rio de Janeiro", "Rome", "Romania", "Russia", "Rwanda"],
    S: ["San Diego", "San Francisco", "Saudi Arabia", "Scotland", "Seattle", "Senegal", "Seoul", "Serbia", "Shanghai", "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa", "South Carolina", "South Dakota", "South Korea", "Spain", "Sri Lanka", "Stockholm", "Sudan", "Sweden", "Switzerland", "Sydney", "Syria"],
    T: ["Taiwan", "Tanzania", "Tasmania", "Tennessee", "Texas", "Thailand", "Tokyo", "Toronto", "Tunisia", "Turkey", "Turkmenistan"],
    U: ["Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Utah", "Uzbekistan"],
    V: ["Vancouver", "Vatican City", "Venezuela", "Vermont", "Victoria", "Vienna", "Vietnam", "Virginia"],
    W: ["Wales", "Warsaw", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
    X: ["Xian"],
    Y: ["Yemen", "York", "Yukon"],
    Z: ["Zambia", "Zimbabwe", "Zurich"]
  },
  Animal: {
    A: ["Aardvark", "Albatross", "Alligator", "Alpaca", "Ant", "Anteater", "Antelope", "Ape", "Armadillo", "Axolotl"],
    B: ["Baboon", "Badger", "Barracuda", "Bat", "Bear", "Beaver", "Bee", "Bison", "Boar", "Buffalo", "Butterfly"],
    C: ["Camel", "Capybara", "Caribou", "Cat", "Caterpillar", "Cattle", "Chameleon", "Cheetah", "Chicken", "Chimpanzee", "Chinchilla", "Clam", "Cobra", "Cockroach", "Cod", "Cormorant", "Cow", "Coyote", "Crab", "Crane", "Crocodile", "Crow"],
    D: ["Deer", "Dingo", "Dinosaur", "Dog", "Dogfish", "Dolphin", "Donkey", "Dotterel", "Dove", "Dragonfly", "Duck", "Dugong"],
    E: ["Eagle", "Echidna", "Eel", "Eland", "Elephant", "Elk", "Emu", "Ermine"],
    F: ["Falcon", "Ferret", "Finch", "Fish", "Flamingo", "Fly", "Fox", "Frog"],
    G: ["Gazelle", "Gerbil", "Giant Panda", "Giraffe", "Gnat", "Gnu", "Goat", "Goldfish", "Goose", "Gorilla", "Grasshopper", "Grouse", "Guanaco", "Guinea Pig", "Gull"],
    H: ["Hamster", "Hare", "Hawk", "Hedgehog", "Heron", "Herring", "Hippopotamus", "Hornet", "Horse", "Hummingbird", "Hyena"],
    I: ["Ibex", "Ibis", "Iguana", "Impala"],
    J: ["Jackal", "Jaguar", "Jay", "Jellyfish"],
    K: ["Kangaroo", "Kingfisher", "Koala", "Komodo Dragon", "Kookaburra"],
    L: ["Lark", "Lemur", "Leopard", "Lion", "Llama", "Lobster", "Locust", "Louse", "Lynx"],
    M: ["Magpie", "Mallard", "Manatee", "Mandrill", "Mantis", "Meerkat", "Mink", "Mole", "Mongoose", "Monkey", "Moose", "Mosquito", "Moth", "Mouse", "Mule"],
    N: ["Narwhal", "Newt", "Nightingale", "Numbat"],
    O: ["Octopus", "Okapi", "Opossum", "Orangutan", "Orca", "Ostrich", "Otter", "Owl", "Ox", "Oyster"],
    P: ["Panda", "Panther", "Parrot", "Partridge", "Peacock", "Pelican", "Penguin", "Pheasant", "Pig", "Pigeon", "Pony", "Porcupine", "Porpoise", "Prairie Dog", "Puffin", "Puma", "Python"],
    Q: ["Quail", "Quelea", "Quokka"],
    R: ["Rabbit", "Raccoon", "Ram", "Rat", "Raven", "Reindeer", "Rhinoceros", "Rook", "Rooster"],
    S: ["Salamander", "Salmon", "Sandpiper", "Sardine", "Scorpion", "Sea Lion", "Seahorse", "Seal", "Shark", "Sheep", "Shrew", "Shrimp", "Skunk", "Sloth", "Snail", "Snake", "Sparrow", "Spider", "Squid", "Squirrel", "Starling", "Stingray", "Stork", "Swallow", "Swan"],
    T: ["Tapir", "Tarantula", "Termite", "Tiger", "Toad", "Trout", "Turkey", "Turtle"],
    U: ["Urchin", "Urial"],
    V: ["Vicuna", "Viper", "Vulture"],
    W: ["Wallaby", "Walrus", "Wasp", "Water Buffalo", "Weasel", "Whale", "Wildcat", "Wolf", "Wolverine", "Wombat", "Woodpecker", "Worm"],
    X: ["X-ray Fish"],
    Y: ["Yak", "Yellow Jacket"],
    Z: ["Zebra", "Zebu"]
  },
  Thing: {
    A: ["Accordion", "Airplane", "Alarm Clock", "Anchor", "Apple", "Apron", "Axe"],
    B: ["Backpack", "Ball", "Balloon", "Banana", "Basket", "Battery", "Bell", "Belt", "Bench", "Bicycle", "Binoculars", "Blanket", "Book", "Bottle", "Bowl", "Box", "Bracelet", "Bread", "Brick", "Broom", "Brush", "Bucket", "Button"],
    C: ["Calculator", "Calendar", "Camera", "Candle", "Cap", "Card", "Carpet", "Chair", "Chalk", "Clock", "Clothes", "Coat", "Coin", "Comb", "Computer", "Cookie", "Couch", "Cup", "Curtain"],
    D: ["Desk", "Diamond", "Dice", "Door", "Drawer", "Dress", "Drill", "Drum"],
    E: ["Earring", "Easel", "Egg", "Envelope", "Eraser"],
    F: ["Fan", "Feather", "Fence", "Fire", "Flag", "Flashlight", "Flower", "Fork", "Frame", "Fridge"],
    G: ["Game", "Garden", "Gate", "Glass", "Glove", "Gold", "Grater", "Guitar"],
    H: ["Hammer", "Hat", "Headphones", "Helmet", "Hose", "Hourglass"],
    I: ["Ice", "Ice Cream", "Iron"],
    J: ["Jacket", "Jar", "Jeans", "Jewelry"],
    K: ["Key", "Kettle", "Keyboard", "Kite", "Knife"],
    L: ["Ladder", "Lamp", "Laptop", "Leaf", "Lens", "Letter", "Light", "Lock"],
    M: ["Magnet", "Map", "Mask", "Match", "Mattress", "Medal", "Microphone", "Mirror", "Monitor", "Mop", "Mug"],
    N: ["Nail", "Necklace", "Needle", "Net", "Newspaper", "Notebook"],
    O: ["Oar", "Orange", "Ornament", "Oven"],
    P: ["Pad", "Paint", "Pan", "Paper", "Pen", "Pencil", "Phone", "Piano", "Picture", "Pillow", "Pin", "Pipe", "Plate", "Plug", "Pot", "Purse"],
    Q: ["Quilt"],
    R: ["Radio", "Rag", "Rake", "Remote", "Ring", "Rope", "Rug", "Ruler"],
    S: ["Saddle", "Saw", "Scissors", "Screw", "Screwdriver", "Shampoo", "Sheet", "Shelf", "Shirt", "Shoe", "Shovel", "Sink", "Soap", "Sock", "Sofa", "Spoon", "Stamp", "Stapler", "Stove", "Strap", "Suitcase", "Switch"],
    T: ["Table", "Tablet", "Tape", "Teapot", "Telephone", "Television", "Tent", "Thread", "Tire", "Tissue", "Toaster", "Towel", "Toy", "Tray", "Trophy", "Truck", "Trumpet"],
    U: ["Umbrella", "Uniform"],
    V: ["Vacuum", "Vase", "Violin"],
    W: ["Wallet", "Watch", "Water", "Wheel", "Whistle", "Window", "Wire", "Wrench"],
    X: ["Xylophone"],
    Y: ["Yard", "Yarn", "Yoyo"],
    Z: ["Zipper"]
  }
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
          <div className="space-y-8 pr-4">
            {Object.entries(categoryExamples).map(([category, letterGroups]) => (
              <Card key={category} className="p-6 shadow-card bg-gradient-card border-0">
                <h2 className="text-2xl font-bold mb-4 text-primary">{category}</h2>
                <div className="space-y-4">
                  {Object.entries(letterGroups as Record<string, string[]>).map(([letter, examples]) => (
                    <div key={letter}>
                      <h4 className="text-lg font-bold mb-2 text-primary/80">{letter}</h4>
                      <div className="flex flex-wrap gap-2">
                        {examples.map((example, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-background/50 text-sm font-medium"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
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
