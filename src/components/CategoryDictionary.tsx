import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

const categoryExamples = {
  Name: {
    A: ["Aaron", "Abby", "Abigail", "Abraham", "Ada", "Adaline", "Adam", "Addison", "Adelaide", "Adele", "Adeline", "Adrian", "Adriana", "Adrienne", "Agnes", "Aiden", "Aileen", "Alan", "Alana", "Albert", "Alberta", "Alejandro", "Alex", "Alexa", "Alexander", "Alexandra", "Alexis", "Alfred", "Alice", "Alicia", "Alison", "Allison", "Alma", "Alvin", "Alyssa", "Amanda", "Amber", "Amelia", "Amy", "Ana", "Andrea", "Andrew", "Angel", "Angela", "Angelina", "Anita", "Ann", "Anna", "Annabelle", "Anne", "Annette", "Annie", "Anthony", "Antonio", "April", "Ariana", "Ariel", "Arlene", "Arnold", "Arthur", "Ashley", "Aubrey", "Audrey", "Austin", "Autumn", "Ava", "Avery"],
    B: ["Bailey", "Barbara", "Barry", "Beatrice", "Becky", "Belinda", "Ben", "Benjamin", "Bernard", "Bernice", "Bert", "Bertha", "Bessie", "Beth", "Bethany", "Betty", "Beverly", "Bill", "Billy", "Blake", "Blanche", "Bob", "Bobby", "Bonnie", "Brad", "Bradley", "Brady", "Brandi", "Brandon", "Brandy", "Brayden", "Brenda", "Brendan", "Brent", "Brett", "Brian", "Brianna", "Bridget", "Brittany", "Brooke", "Brooklyn", "Bruce", "Bryan", "Bryant", "Bryce"],
    C: ["Caden", "Caitlin", "Caleb", "Calvin", "Cameron", "Camila", "Candace", "Cara", "Carl", "Carla", "Carlos", "Carmen", "Carol", "Caroline", "Carolyn", "Carrie", "Carter", "Casey", "Cassandra", "Cassidy", "Catherine", "Cathy", "Cecilia", "Cedric", "Celeste", "Chad", "Charity", "Charlene", "Charles", "Charlie", "Charlotte", "Chase", "Chelsea", "Cheryl", "Chester", "Chloe", "Chris", "Christian", "Christina", "Christine", "Christopher", "Christy", "Cindy", "Claire", "Clara", "Clarence", "Clarissa", "Clark", "Claudia", "Clay", "Clayton", "Clifford", "Clint", "Clinton", "Cody", "Cole", "Colin", "Colleen", "Connie", "Connor", "Constance", "Cora", "Corey", "Courtney", "Craig", "Crystal", "Curtis", "Cynthia"],
    D: ["Daisy", "Dakota", "Dale", "Dallas", "Dalton", "Damian", "Damon", "Dan", "Dana", "Daniel", "Daniela", "Danielle", "Danny", "Darlene", "Darrell", "Darren", "Darryl", "Dave", "David", "Dawn", "Dean", "Deanna", "Debbie", "Deborah", "Debra", "Delores", "Denise", "Dennis", "Derek", "Derrick", "Desiree", "Destiny", "Devon", "Diana", "Diane", "Dianne", "Dolores", "Dominic", "Don", "Donald", "Donna", "Donnie", "Doris", "Dorothy", "Doug", "Douglas", "Drew", "Dustin", "Dwight", "Dylan"],
    E: ["Earl", "Earnest", "Ed", "Eddie", "Eden", "Edgar", "Edith", "Edna", "Eduardo", "Edward", "Edwin", "Eileen", "Elaine", "Eleanor", "Elena", "Eli", "Elias", "Elijah", "Elizabeth", "Ella", "Ellen", "Elliott", "Ellis", "Elmer", "Eloise", "Elsa", "Elsie", "Elvis", "Emily", "Emma", "Emmanuel", "Eric", "Erica", "Erin", "Ernest", "Ernestine", "Esmeralda", "Esther", "Ethan", "Ethel", "Eugene", "Eunice", "Eva", "Evan", "Evelyn", "Everett"],
    F: ["Faith", "Felicia", "Felix", "Fernando", "Florence", "Floyd", "Forrest", "Frances", "Francine", "Francis", "Francisco", "Frank", "Franklin", "Fred", "Freda", "Freddie", "Frederick", "Fredrick"],
    G: ["Gabriel", "Gabriela", "Gabrielle", "Gail", "Garrett", "Garry", "Gary", "Gavin", "Gene", "Geneva", "Geoffrey", "George", "Georgia", "Gerald", "Geraldine", "Gerard", "Gertrude", "Gilbert", "Gina", "Ginger", "Gladys", "Glen", "Glenda", "Glenn", "Gloria", "Gordon", "Grace", "Gracie", "Grant", "Greg", "Gregory", "Gretchen", "Griffin", "Guadalupe", "Guillermo", "Guy", "Gwen", "Gwendolyn"],
    H: ["Hailey", "Haley", "Hannah", "Harold", "Harper", "Harriet", "Harry", "Harvey", "Hayden", "Hazel", "Heather", "Hector", "Heidi", "Helen", "Henry", "Herbert", "Herman", "Hilda", "Holly", "Hope", "Howard", "Hudson", "Hugh", "Hugo", "Hunter"],
    I: ["Ian", "Ida", "Ignacio", "Irene", "Iris", "Irma", "Irving", "Isaac", "Isabel", "Isabella", "Isabelle", "Isaiah", "Ismael", "Israel", "Ivan", "Ivy"],
    J: ["Jack", "Jackie", "Jackson", "Jaclyn", "Jacob", "Jacqueline", "Jacquelyn", "Jaden", "Jaime", "Jake", "James", "Jamie", "Jan", "Jane", "Janelle", "Janet", "Janice", "Janie", "Jared", "Jasmine", "Jason", "Javier", "Jay", "Jayden", "Jean", "Jeanette", "Jeanne", "Jeannie", "Jeff", "Jeffery", "Jeffrey", "Jenna", "Jennie", "Jennifer", "Jenny", "Jeremy", "Jermaine", "Jerome", "Jerry", "Jesse", "Jessica", "Jessie", "Jesus", "Jill", "Jim", "Jimmy", "Jo", "Joan", "Joann", "Joanna", "Joanne", "Jocelyn", "Jody", "Joe", "Joel", "Joey", "John", "Johnathan", "Johnnie", "Johnny", "Jon", "Jonathan", "Jordan", "Jorge", "Jose", "Joseph", "Josephine", "Josh", "Joshua", "Josiah", "Joy", "Joyce", "Juan", "Juanita", "Judith", "Judy", "Julia", "Julian", "Juliana", "Julie", "Juliet", "Julio", "June", "Justin", "Justine"],
    K: ["Kaitlyn", "Kara", "Karen", "Kari", "Karina", "Karl", "Karla", "Kate", "Katelyn", "Katherine", "Kathleen", "Kathryn", "Kathy", "Katie", "Katrina", "Kay", "Kayla", "Kaylee", "Keith", "Kelley", "Kelli", "Kelly", "Kelsey", "Ken", "Kendall", "Kendra", "Kenneth", "Kenny", "Kent", "Kenya", "Kerry", "Kevin", "Kim", "Kimberly", "Kirk", "Kristen", "Kristi", "Kristin", "Kristina", "Kristine", "Kristopher", "Kristy", "Krystal", "Kurt", "Kyle", "Kylie"],
    L: ["Lacy", "Lance", "Landon", "Larry", "Latasha", "Latoya", "Laura", "Laurel", "Lauren", "Laurie", "Laverne", "Lawrence", "Lea", "Leah", "Lee", "Leigh", "Lela", "Lena", "Leo", "Leon", "Leona", "Leonard", "Leroy", "Leslie", "Lester", "Lewis", "Liam", "Lillian", "Lillie", "Lilly", "Lincoln", "Linda", "Lindsay", "Lindsey", "Lisa", "Lloyd", "Logan", "Lois", "Lonnie", "Lora", "Loren", "Lorena", "Loretta", "Lori", "Lorie", "Lorraine", "Lou", "Louie", "Louis", "Louisa", "Louise", "Lucas", "Lucia", "Lucille", "Lucy", "Luis", "Luke", "Lula", "Luther", "Lydia", "Lyle", "Lynn", "Lynne"],
    M: ["Mabel", "Mack", "Mackenzie", "Madeline", "Madelyn", "Madison", "Mae", "Maggie", "Malcolm", "Mallory", "Mandy", "Manuel", "Marc", "Marcella", "Marcia", "Marco", "Marcus", "Margaret", "Margarita", "Margie", "Maria", "Marian", "Marianne", "Marie", "Marilyn", "Marina", "Mario", "Marion", "Marjorie", "Mark", "Marlene", "Marsha", "Marshall", "Martha", "Martin", "Marty", "Marvin", "Mary", "Mason", "Matilda", "Matt", "Matthew", "Mattie", "Maureen", "Maurice", "Max", "Maxine", "Maxwell", "May", "Maya", "Megan", "Meghan", "Melanie", "Melinda", "Melissa", "Melody", "Melvin", "Mercedes", "Meredith", "Merle", "Michael", "Micheal", "Michele", "Michelle", "Miguel", "Mildred", "Miles", "Milton", "Mindy", "Minnie", "Miranda", "Miriam", "Misty", "Mitchell", "Mohammad", "Molly", "Mona", "Monica", "Monique", "Morgan", "Morris", "Myrtle"],
    N: ["Nadia", "Nancy", "Naomi", "Natalie", "Natasha", "Nathan", "Nathaniel", "Neal", "Neil", "Nellie", "Nelson", "Nettie", "Nicholas", "Nichole", "Nick", "Nicolas", "Nicole", "Nina", "Noah", "Noel", "Noelle", "Nolan", "Nora", "Norma", "Norman"],
    O: ["Olivia", "Oliver", "Ollie", "Omar", "Opal", "Ora", "Orlando", "Oscar", "Otis", "Owen"],
    P: ["Pablo", "Paige", "Pam", "Pamela", "Pat", "Patrice", "Patricia", "Patrick", "Patsy", "Patti", "Patty", "Paul", "Paula", "Paulette", "Pauline", "Pearl", "Peggy", "Penny", "Perry", "Pete", "Peter", "Phil", "Philip", "Phillip", "Phyllis", "Preston", "Priscilla"],
    Q: ["Quentin", "Quinn"],
    R: ["Rachel", "Rafael", "Ralph", "Ramon", "Ramona", "Randal", "Randall", "Randolph", "Randy", "Raquel", "Raul", "Ray", "Raymond", "Reagan", "Rebecca", "Rebekah", "Reed", "Regina", "Reginald", "Rene", "Renee", "Rex", "Rhonda", "Ricardo", "Richard", "Ricky", "Rita", "Rob", "Robert", "Roberta", "Roberto", "Robin", "Robyn", "Rochelle", "Rodney", "Rodolfo", "Rodrigo", "Roger", "Roland", "Ron", "Ronald", "Ronnie", "Rosa", "Rosalie", "Rosemarie", "Rosemary", "Rosie", "Ross", "Roxanne", "Roy", "Ruben", "Ruby", "Rudolph", "Rudy", "Rufus", "Russell", "Rusty", "Ruth", "Ryan", "Rylee"],
    S: ["Sadie", "Sally", "Salvador", "Salvatore", "Sam", "Samantha", "Sammy", "Samuel", "Sandra", "Sandy", "Santiago", "Sara", "Sarah", "Saul", "Savannah", "Scarlett", "Scott", "Sean", "Sebastian", "Serena", "Sergio", "Seth", "Shane", "Shannon", "Shari", "Sharon", "Shaun", "Shawn", "Shawna", "Sheila", "Shelby", "Sheldon", "Shelia", "Shelley", "Shelly", "Sheri", "Sherri", "Sherry", "Sheryl", "Shirley", "Sidney", "Sierra", "Silvia", "Simon", "Skylar", "Sofia", "Sonia", "Sonja", "Sonya", "Sophia", "Sophie", "Spencer", "Stacey", "Stacy", "Stanley", "Stella", "Stephanie", "Stephen", "Steve", "Steven", "Stewart", "Stuart", "Sue", "Summer", "Susan", "Susie", "Suzanne", "Suzette", "Suzie", "Sydney", "Sylvester", "Sylvia"],
    T: ["Tabitha", "Tamara", "Tami", "Tammy", "Tanner", "Tanya", "Tara", "Taylor", "Ted", "Teddy", "Teresa", "Terrance", "Terrell", "Terrence", "Terri", "Terry", "Tessa", "Thelma", "Theodore", "Theresa", "Thomas", "Tiffany", "Tim", "Timothy", "Tina", "Todd", "Tom", "Tomas", "Tommy", "Toni", "Tony", "Tonya", "Tracey", "Traci", "Tracy", "Travis", "Trevor", "Trey", "Tricia", "Trina", "Trinity", "Tristan", "Troy", "Trudy", "Tyler", "Tyrone"],
    U: ["Ulysses", "Uma", "Uriel", "Ursula"],
    V: ["Valerie", "Van", "Vanessa", "Velma", "Vera", "Verna", "Vernon", "Veronica", "Vicki", "Vickie", "Vicky", "Victor", "Victoria", "Vincent", "Viola", "Violet", "Virgil", "Virginia", "Vivian"],
    W: ["Wade", "Wallace", "Walter", "Wanda", "Warren", "Wayne", "Wendell", "Wendy", "Wesley", "Whitney", "Wilbur", "Wilfred", "Willard", "William", "Willie", "Wilma", "Wilson", "Winifred", "Winston", "Wyatt"],
    X: ["Xander", "Xavier", "Ximena"],
    Y: ["Yasmin", "Yolanda", "Yvette", "Yvonne"],
    Z: ["Zachary", "Zane", "Zoe", "Zoey"]
  },
  Place: {
    A: ["Abu Dhabi", "Abuja", "Accra", "Adelaide", "Afghanistan", "Africa", "Alabama", "Alaska", "Albania", "Alberta", "Algeria", "Amman", "Amsterdam", "Anchorage", "Andorra", "Angola", "Ankara", "Annapolis", "Antarctica", "Antigua", "Arizona", "Arkansas", "Armenia", "Asia", "Aspen", "Astana", "Athens", "Atlanta", "Atlantic City", "Auckland", "Augusta", "Austin", "Australia", "Austria"],
    B: ["Baghdad", "Bahamas", "Bahrain", "Baku", "Bali", "Baltimore", "Bamako", "Bangkok", "Bangladesh", "Barbados", "Barcelona", "Baton Rouge", "Beijing", "Beirut", "Belarus", "Belfast", "Belgium", "Belgrade", "Belize", "Berlin", "Bermuda", "Bern", "Bhutan", "Birmingham", "Bismarck", "Bogota", "Boise", "Bolivia", "Bombay", "Bonn", "Boston", "Botswana", "Boulder", "Brazil", "Bridgeport", "Brisbane", "Britain", "Brooklyn", "Brussels", "Bucharest", "Budapest", "Buenos Aires", "Buffalo", "Bulgaria", "Burlington"],
    C: ["Cairo", "Calcutta", "Calgary", "California", "Cambodia", "Cameroon", "Canada", "Canberra", "Cape Town", "Caracas", "Cardiff", "Caribbean", "Carson City", "Casablanca", "Chad", "Charleston", "Charlotte", "Cheyenne", "Chicago", "Chile", "China", "Cincinnati", "Cleveland", "Cologne", "Colombia", "Colorado", "Columbia", "Columbus", "Connecticut", "Copenhagen", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic"],
    D: ["Dakar", "Dallas", "Damascus", "Dayton", "Delaware", "Delhi", "Denmark", "Denver", "Des Moines", "Detroit", "Dhaka", "Dominican Republic", "Doha", "Dover", "Dubai", "Dublin", "Duluth", "Dundee", "Durban"],
    E: ["Ecuador", "Edinburgh", "Edmonton", "Egypt", "El Paso", "England", "Erie", "Estonia", "Ethiopia", "Eugene", "Europe", "Evansville"],
    F: ["Fargo", "Fiji", "Finland", "Flint", "Florence", "Florida", "Fort Worth", "France", "Frankfurt", "Frankfort", "Fresno"],
    G: ["Gabon", "Geneva", "Georgia", "Germany", "Ghana", "Gibraltar", "Glasgow", "Grand Rapids", "Greece", "Green Bay", "Greenland", "Greensboro", "Grenada", "Guam", "Guatemala", "Guinea"],
    H: ["Hague", "Haiti", "Hamburg", "Hanoi", "Harare", "Hartford", "Havana", "Hawaii", "Helena", "Helsinki", "Honduras", "Hong Kong", "Honolulu", "Houston", "Hungary"],
    I: ["Iceland", "Idaho", "Illinois", "India", "Indiana", "Indianapolis", "Indonesia", "Iowa", "Iran", "Iraq", "Ireland", "Israel", "Istanbul", "Italy"],
    J: ["Jackson", "Jacksonville", "Jakarta", "Jamaica", "Japan", "Jersey City", "Jerusalem", "Jordan"],
    K: ["Kabul", "Kansas", "Kansas City", "Karachi", "Kashmir", "Kazakhstan", "Kentucky", "Kenya", "Khartoum", "Kiev", "Kingston", "Kinshasa", "Korea", "Kosovo", "Kuwait", "Kyoto"],
    L: ["Laos", "Las Vegas", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lima", "Lincoln", "Lisbon", "Lithuania", "Little Rock", "Liverpool", "London", "Los Angeles", "Louisiana", "Louisville", "Luxembourg"],
    M: ["Macedonia", "Madagascar", "Madison", "Madrid", "Maine", "Malawi", "Malaysia", "Mali", "Malta", "Manchester", "Manhattan", "Manila", "Maryland", "Massachusetts", "Melbourne", "Memphis", "Mexico", "Miami", "Michigan", "Milan", "Milwaukee", "Minneapolis", "Minnesota", "Mississippi", "Missouri", "Monaco", "Mongolia", "Montana", "Monterrey", "Montgomery", "Montreal", "Morocco", "Moscow", "Mumbai", "Munich", "Myanmar"],
    N: ["Nairobi", "Namibia", "Naples", "Nashville", "Nassau", "Nebraska", "Nepal", "Netherlands", "Nevada", "Newark", "New Delhi", "New Hampshire", "New Jersey", "New Mexico", "New Orleans", "New York", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norfolk", "North Carolina", "North Dakota", "North Korea", "Norway"],
    O: ["Oakland", "Ohio", "Oklahoma", "Oklahoma City", "Olympia", "Omaha", "Oman", "Ontario", "Oregon", "Orlando", "Oslo", "Ottawa", "Oxford"],
    P: ["Pakistan", "Palestine", "Panama", "Paraguay", "Paris", "Pennsylvania", "Perth", "Peru", "Philadelphia", "Philippines", "Phoenix", "Pierre", "Pittsburgh", "Poland", "Portland", "Portugal", "Prague", "Providence", "Puerto Rico"],
    Q: ["Qatar", "Quebec", "Queensland", "Quito"],
    R: ["Raleigh", "Reno", "Rhode Island", "Richmond", "Riga", "Rio de Janeiro", "Riyadh", "Rochester", "Rome", "Romania", "Russia", "Rwanda"],
    S: ["Sacramento", "Salem", "Salt Lake City", "San Antonio", "San Diego", "San Francisco", "San Jose", "Santa Fe", "Santiago", "Saudi Arabia", "Savannah", "Scotland", "Seattle", "Senegal", "Seoul", "Serbia", "Seville", "Shanghai", "Singapore", "Slovakia", "Slovenia", "Sofia", "Somalia", "South Africa", "South Carolina", "South Dakota", "South Korea", "Spain", "Spokane", "Springfield", "Sri Lanka", "Stockholm", "Sudan", "Sweden", "Switzerland", "Sydney", "Syria"],
    T: ["Tacoma", "Taiwan", "Tallahassee", "Tampa", "Tanzania", "Tasmania", "Tehran", "Tennessee", "Texas", "Thailand", "Tokyo", "Toledo", "Topeka", "Toronto", "Trenton", "Trinidad", "Tucson", "Tunisia", "Turkey", "Turkmenistan", "Tuscaloosa"],
    U: ["Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Utah", "Uzbekistan"],
    V: ["Vancouver", "Vatican City", "Venezuela", "Venice", "Vermont", "Victoria", "Vienna", "Vietnam", "Virginia"],
    W: ["Wales", "Warsaw", "Washington", "Wellington", "West Virginia", "Wichita", "Wilmington", "Wisconsin", "Wyoming"],
    X: ["Xian"],
    Y: ["Yemen", "Yokohama", "York", "Yukon"],
    Z: ["Zagreb", "Zambia", "Zimbabwe", "Zurich"]
  },
  Animal: {
    A: ["Aardvark", "Albatross", "Alligator", "Alpaca", "Anaconda", "Anchovy", "Angelfish", "Anglerfish", "Ant", "Anteater", "Antelope", "Ape", "Aphid", "Armadillo", "Asp", "Axolotl"],
    B: ["Baboon", "Badger", "Barracuda", "Bass", "Bat", "Beagle", "Bear", "Beaver", "Bee", "Beetle", "Bison", "Blackbird", "Bluebird", "Boa", "Boar", "Bobcat", "Bonito", "Buffalo", "Bulldog", "Bullfrog", "Bumblebee", "Bunny", "Butterfly", "Buzzard"],
    C: ["Camel", "Canary", "Capybara", "Caracal", "Cardinal", "Caribou", "Carp", "Cat", "Caterpillar", "Catfish", "Cattle", "Centipede", "Cheetah", "Chicken", "Chimpanzee", "Chinchilla", "Chipmunk", "Clam", "Cobra", "Cockatoo", "Cockroach", "Cod", "Condor", "Coral", "Cormorant", "Cougar", "Cow", "Coyote", "Crab", "Crane", "Cricket", "Crocodile", "Crow", "Cuckoo"],
    D: ["Dachshund", "Dalmatian", "Deer", "Dingo", "Dinosaur", "Doberman", "Dodo", "Dog", "Dogfish", "Dolphin", "Donkey", "Dove", "Dragonfly", "Duck", "Dugong", "Dunlin"],
    E: ["Eagle", "Earthworm", "Earwig", "Echidna", "Eel", "Egret", "Eland", "Elephant", "Elk", "Emu", "Ermine"],
    F: ["Falcon", "Ferret", "Finch", "Firefly", "Fish", "Flamingo", "Flea", "Fly", "Fowl", "Fox", "Frog"],
    G: ["Gazelle", "Gecko", "Gerbil", "Giant Panda", "Gibbon", "Giraffe", "Gnat", "Gnu", "Goat", "Goldfinch", "Goldfish", "Goose", "Gopher", "Gorilla", "Grasshopper", "Greyhound", "Grizzly Bear", "Grouse", "Guanaco", "Guinea Fowl", "Guinea Pig", "Gull"],
    H: ["Haddock", "Halibut", "Hamster", "Hare", "Harrier", "Hawk", "Hedgehog", "Hen", "Heron", "Herring", "Hippopotamus", "Honeybee", "Hornet", "Horse", "Hound", "Housefly", "Hummingbird", "Hyena"],
    I: ["Ibex", "Ibis", "Iguana", "Impala", "Insect"],
    J: ["Jackal", "Jackrabbit", "Jaguar", "Jay", "Jellyfish"],
    K: ["Kangaroo", "Katydid", "Kingfisher", "Kite", "Kiwi", "Koala", "Komodo Dragon", "Kookaburra"],
    L: ["Ladybug", "Lamb", "Lamprey", "Lark", "Leech", "Lemming", "Lemur", "Leopard", "Lion", "Lizard", "Llama", "Lobster", "Locust", "Loon", "Louse", "Lynx"],
    M: ["Macaw", "Mackerel", "Magpie", "Mallard", "Manatee", "Mandrill", "Manta Ray", "Mantis", "Marlin", "Marmot", "Meerkat", "Millipede", "Mink", "Minnow", "Mite", "Mockingbird", "Mole", "Mongoose", "Monkey", "Moose", "Mosquito", "Moth", "Mountain Goat", "Mouse", "Mule", "Muskrat"],
    N: ["Narwhal", "Newt", "Nightingale", "Numbat", "Nutria"],
    O: ["Ocelot", "Octopus", "Okapi", "Opossum", "Orangutan", "Orca", "Oriole", "Osprey", "Ostrich", "Otter", "Owl", "Ox", "Oyster"],
    P: ["Panda", "Panther", "Parakeet", "Parrot", "Partridge", "Peacock", "Peafowl", "Pelican", "Penguin", "Perch", "Peregrine", "Pheasant", "Pig", "Pigeon", "Pike", "Piranha", "Platypus", "Polar Bear", "Pony", "Poodle", "Porcupine", "Porpoise", "Possum", "Prairie Dog", "Prawn", "Puffin", "Puma", "Python"],
    Q: ["Quail", "Quelea", "Quetzal", "Quokka"],
    R: ["Rabbit", "Raccoon", "Racer", "Ram", "Rat", "Rattlesnake", "Raven", "Ray", "Reindeer", "Rhea", "Rhinoceros", "Roadrunner", "Robin", "Rook", "Rooster", "Rottweiler"],
    S: ["Salamander", "Salmon", "Sandpiper", "Sardine", "Scorpion", "Sea Lion", "Sea Turtle", "Seahorse", "Seal", "Shark", "Sheep", "Shrew", "Shrimp", "Skink", "Skunk", "Sloth", "Slug", "Snail", "Snake", "Snapper", "Sparrow", "Spider", "Sponge", "Squid", "Squirrel", "Starfish", "Starling", "Stingray", "Stoat", "Stork", "Sturgeon", "Swallow", "Swan", "Swift", "Swordfish"],
    T: ["Tadpole", "Tapir", "Tarantula", "Tarsier", "Tasmanian Devil", "Termite", "Tern", "Terrier", "Thrush", "Tick", "Tiger", "Toad", "Tortoise", "Toucan", "Trout", "Tuna", "Turkey", "Turtle"],
    U: ["Uakari", "Umbrellabird", "Urchin", "Urial"],
    V: ["Vicuna", "Viper", "Vole", "Vulture"],
    W: ["Wallaby", "Walrus", "Warthog", "Wasp", "Water Buffalo", "Weasel", "Weevil", "Whale", "Whippet", "Wildcat", "Wildebeest", "Wolf", "Wolverine", "Wombat", "Woodchuck", "Woodpecker", "Worm", "Wren"],
    X: ["X-ray Fish", "Xenops"],
    Y: ["Yak", "Yellow Jacket", "Yellowtail"],
    Z: ["Zebra", "Zebu", "Zorilla"]
  },
  Thing: {
    A: ["Abacus", "Accordion", "Adapter", "Airplane", "Alarm", "Album", "Anchor", "Antenna", "Apple", "Apron", "Armchair", "Arrow", "Ashtray", "Axe"],
    B: ["Backpack", "Badge", "Bag", "Ball", "Balloon", "Banana", "Band", "Bandage", "Banner", "Barrel", "Basket", "Battery", "Beads", "Beam", "Bed", "Bell", "Belt", "Bench", "Bicycle", "Binoculars", "Blade", "Blanket", "Blender", "Board", "Boat", "Book", "Bookmark", "Boot", "Bottle", "Bow", "Bowl", "Box", "Bracelet", "Bread", "Brick", "Bridge", "Broom", "Brush", "Bucket", "Buckle", "Bulb", "Bulletin", "Button"],
    C: ["Cabinet", "Cable", "Calculator", "Calendar", "Camera", "Can", "Candle", "Cane", "Canvas", "Cap", "Card", "Carpet", "Carriage", "Cart", "Case", "Cash", "Cassette", "Chain", "Chair", "Chalk", "Charger", "Chart", "Chest", "Clock", "Cloth", "Clothes", "Coat", "Coffee Maker", "Coin", "Collar", "Comb", "Computer", "Cone", "Container", "Cookie", "Cooker", "Cord", "Cork", "Couch", "Counter", "Cover", "Cradle", "Crane", "Crate", "Crown", "Crutch", "Cup", "Cupboard", "Curtain", "Cushion"],
    D: ["Deck", "Desk", "Diamond", "Dice", "Dish", "Disk", "Door", "Doorbell", "Drape", "Drawer", "Dress", "Drill", "Drum", "Dryer", "Dumbbell", "Dustpan"],
    E: ["Earbuds", "Earphone", "Earring", "Easel", "Egg", "Elastic", "Emblem", "Envelope", "Eraser"],
    F: ["Fabric", "Fan", "Faucet", "Feather", "Fence", "File", "Filter", "Fire", "Fireplace", "Flag", "Flashlight", "Flask", "Flower", "Folder", "Fork", "Frame", "Freezer", "Fridge", "Funnel"],
    G: ["Game", "Garage", "Garden", "Garland", "Gate", "Gauge", "Gear", "Glass", "Globe", "Glove", "Glue", "Gold", "Gown", "Grater", "Grid", "Grill", "Guitar", "Gym"],
    H: ["Hammer", "Hamper", "Handle", "Handset", "Hanger", "Hat", "Heater", "Hedge", "Helmet", "Hinge", "Hook", "Hoop", "Horn", "Hose", "Hourglass", "Hub"],
    I: ["Ice", "Ice Cream", "Icon", "Ink", "Iron"],
    J: ["Jacket", "Jar", "Jeans", "Jewelry", "Jug"],
    K: ["Kettle", "Key", "Keyboard", "Knife", "Knob", "Kite"],
    L: ["Label", "Lace", "Ladder", "Ladle", "Lamp", "Lantern", "Laptop", "Latch", "Lawn", "Leaf", "Leather", "Lens", "Letter", "Lid", "Light", "Lighter", "Line", "Linen", "Lock", "Locker", "Locket"],
    M: ["Machine", "Magazine", "Magnet", "Mailbox", "Map", "Marker", "Mask", "Mat", "Match", "Mattress", "Medal", "Mesh", "Meter", "Microphone", "Microwave", "Mirror", "Monitor", "Mop", "Motor", "Mouse", "Mug", "Mural"],
    N: ["Nail", "Napkin", "Necklace", "Needle", "Net", "Newspaper", "Nob", "Notebook", "Nut"],
    O: ["Oar", "Ornament", "Oven", "Outlet"],
    P: ["Pad", "Pail", "Paint", "Palette", "Pan", "Panel", "Paper", "Parachute", "Peg", "Pen", "Pencil", "Phone", "Piano", "Picture", "Pillow", "Pin", "Pipe", "Pitcher", "Plane", "Plank", "Plant", "Plate", "Platform", "Plug", "Pocket", "Pole", "Polish", "Pot", "Pouch", "Powder", "Printer", "Projector", "Pump", "Purse", "Puzzle"],
    Q: ["Quilt"],
    R: ["Rack", "Radio", "Rag", "Rail", "Rake", "Ramp", "Razor", "Record", "Refrigerator", "Remote", "Ribbon", "Ring", "Rod", "Roller", "Roof", "Rope", "Rug", "Ruler"],
    S: ["Sack", "Saddle", "Safe", "Sail", "Salt", "Sandal", "Saucer", "Saw", "Scale", "Scarf", "Scissors", "Scoop", "Screen", "Screw", "Screwdriver", "Seal", "Seat", "Shampoo", "Shaver", "Shawl", "Sheet", "Shelf", "Shell", "Shield", "Shirt", "Shoe", "Shovel", "Shower", "Sign", "Silk", "Sink", "Skate", "Ski", "Skirt", "Slate", "Sled", "Sleeve", "Slide", "Slipper", "Soap", "Socket", "Sofa", "Spatula", "Speaker", "Sponge", "Spoon", "Spring", "Stamp", "Stand", "Stapler", "Statue", "Stencil", "Stick", "Stool", "Stove", "Strap", "String", "Stroller", "Suitcase", "Sweater", "Switch"],
    T: ["Table", "Tablet", "Tack", "Tag", "Tank", "Tape", "Tarp", "Teapot", "Telephone", "Television", "Tent", "Thermos", "Thread", "Tile", "Timer", "Tire", "Tissue", "Toaster", "Toilet", "Tongs", "Tool", "Toothbrush", "Toothpick", "Towel", "Toy", "Tray", "Tree", "Tripod", "Trophy", "Trowel", "Truck", "Trumpet", "Tub", "Tube", "Tunnel"],
    U: ["Umbrella", "Uniform", "Urn", "Utensil"],
    V: ["Vacuum", "Vase", "Vault", "Veil", "Vest", "Vial", "Video", "Violin"],
    W: ["Wagon", "Wallet", "Wall", "Wardrobe", "Washer", "Watch", "Water", "Wheel", "Whip", "Whistle", "Wick", "Window", "Wire", "Wood", "Wreath", "Wrench"],
    X: ["Xylophone"],
    Y: ["Yard", "Yarn", "Yoyo"],
    Z: ["Zipper", "Zone"]
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
