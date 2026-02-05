/**
 * Question Generator
 * Centralized service for generating skill-specific test questions
 * 
 * ARCHITECTURE:
 * - Questions are mapped by specific skill name (e.g., "Python", "React", "UI/UX Design")
 * - Each skill has a minimum of 5 questions
 * - Questions are skill-specific, not category-based
 * 
 * ADDING NEW SKILLS:
 * To add questions for a new skill:
 * 1. Add a new entry to the skillQuestions map below
 * 2. Ensure at least 5 questions are provided
 * 3. Each question should have: question (string), options (string[]), correct (number index)
 * 4. Questions should test relevant knowledge for that specific skill
 */

export interface Question {
  question: string
  options: string[]
  correct: number // Index of correct answer (0-based)
}

export type SkillQuestionsMap = Record<string, Question[]>

/**
 * Skill-specific question database
 * Questions are organized by exact skill name (case-insensitive matching)
 */
const skillQuestions: SkillQuestionsMap = {
  // Python Programming
  python: [
    {
      question: "What is the correct way to create a list in Python?",
      options: [
        "list = []",
        "list = new List()",
        "list = List()",
        "list = array[]"
      ],
      correct: 0
    },
    {
      question: "Which keyword is used to define a function in Python?",
      options: ["function", "def", "func", "define"],
      correct: 1
    },
    {
      question: "What is the output of: print(2 ** 3)?",
      options: ["6", "8", "9", "5"],
      correct: 1
    },
    {
      question: "How do you access the last element of a list called 'my_list'?",
      options: [
        "my_list[last]",
        "my_list[-1]",
        "my_list[len(my_list)]",
        "my_list.end()"
      ],
      correct: 1
    },
    {
      question: "What does the 'in' operator check in Python?",
      options: [
        "If a value exists in a sequence",
        "If a variable is defined",
        "If a file exists",
        "If a number is positive"
      ],
      correct: 0
    },
    {
      question: "Which method is used to add an item to the end of a list?",
      options: ["push()", "append()", "add()", "insert()"],
      correct: 1
    },
    {
      question: "What is a dictionary in Python?",
      options: [
        "A list of numbers",
        "A key-value pair data structure",
        "A string manipulation tool",
        "A file reading function"
      ],
      correct: 1
    }
  ],

  // Java Programming
  java: [
    {
      question: "What is the main method signature in Java?",
      options: [
        "public static void main(String[] args)",
        "public void main()",
        "static main(String[] args)",
        "public main()"
      ],
      correct: 0
    },
    {
      question: "Which keyword is used to create a class in Java?",
      options: ["class", "Class", "new", "create"],
      correct: 0
    },
    {
      question: "What is inheritance in Java?",
      options: [
        "A way to copy code",
        "A mechanism where a class inherits properties from another class",
        "A method to import libraries",
        "A way to delete classes"
      ],
      correct: 1
    },
    {
      question: "Which access modifier allows access from anywhere?",
      options: ["private", "protected", "public", "default"],
      correct: 2
    },
    {
      question: "What is an interface in Java?",
      options: [
        "A class implementation",
        "A contract that defines methods a class must implement",
        "A variable type",
        "A file format"
      ],
      correct: 1
    },
    {
      question: "Which collection class is synchronized in Java?",
      options: ["ArrayList", "Vector", "LinkedList", "HashSet"],
      correct: 1
    },
    {
      question: "What is the difference between == and .equals() in Java?",
      options: [
        "No difference",
        "== compares references, .equals() compares values",
        ".equals() compares references, == compares values",
        "They're used for different data types"
      ],
      correct: 1
    }
  ],

  // React Development
  react: [
    {
      question: "What is a React component?",
      options: [
        "A JavaScript function that returns JSX",
        "A CSS file",
        "A database table",
        "A server endpoint"
      ],
      correct: 0
    },
    {
      question: "What are props in React?",
      options: [
        "Internal component state",
        "Data passed from parent to child components",
        "React hooks",
        "CSS properties"
      ],
      correct: 1
    },
    {
      question: "Which hook is used to manage state in functional components?",
      options: ["useEffect", "useState", "useContext", "useReducer"],
      correct: 1
    },
    {
      question: "What does JSX stand for?",
      options: [
        "JavaScript XML",
        "Java Syntax Extension",
        "JSON XML",
        "JavaScript Extension"
      ],
      correct: 0
    },
    {
      question: "How do you conditionally render in React?",
      options: [
        "Using if statements outside JSX",
        "Using ternary operators or && operator in JSX",
        "Using switch statements",
        "Using for loops"
      ],
      correct: 1
    },
    {
      question: "What is the purpose of useEffect hook?",
      options: [
        "To manage component state",
        "To perform side effects and lifecycle operations",
        "To create new components",
        "To style components"
      ],
      correct: 1
    },
    {
      question: "What is the key prop used for in React lists?",
      options: [
        "To add styling",
        "To help React identify which items have changed",
        "To add event handlers",
        "To pass data to children"
      ],
      correct: 1
    }
  ],

  // JavaScript
  javascript: [
    {
      question: "What is the difference between 'let' and 'var'?",
      options: [
        "No difference",
        "'let' has block scope, 'var' has function scope",
        "'var' is newer",
        "They're different languages"
      ],
      correct: 1
    },
    {
      question: "What is a closure in JavaScript?",
      options: [
        "A way to close a function",
        "A function that has access to variables in its outer scope",
        "A method to hide code",
        "A type of loop"
      ],
      correct: 1
    },
    {
      question: "What does the 'this' keyword refer to?",
      options: [
        "The current function",
        "The object that owns the executing code",
        "The global object",
        "The parent function"
      ],
      correct: 1
    },
    {
      question: "What is the purpose of async/await?",
      options: [
        "To create loops",
        "To handle asynchronous operations more cleanly",
        "To define classes",
        "To manipulate arrays"
      ],
      correct: 1
    },
    {
      question: "What is a promise in JavaScript?",
      options: [
        "A guarantee that code will run",
        "An object representing eventual completion of an async operation",
        "A type of variable",
        "A function declaration"
      ],
      correct: 1
    },
    {
      question: "What is the spread operator (...) used for?",
      options: [
        "To multiply numbers",
        "To expand arrays or objects",
        "To concatenate strings",
        "To create loops"
      ],
      correct: 1
    }
  ],

  // UI/UX Design
  "ui/ux design": [
    {
      question: "What does UX stand for?",
      options: [
        "User Experience",
        "User Extension",
        "Universal Experience",
        "User Exchange"
      ],
      correct: 0
    },
    {
      question: "What is the purpose of a wireframe?",
      options: [
        "Final design",
        "Layout structure planning",
        "Color scheme",
        "Animation"
      ],
      correct: 1
    },
    {
      question: "Which color combination is generally considered most accessible?",
      options: [
        "Red on blue",
        "Yellow on white",
        "Black on white",
        "Green on red"
      ],
      correct: 2
    },
    {
      question: "What is the F-pattern in UX design?",
      options: [
        "A color scheme",
        "A reading pattern users follow when scanning content",
        "A font style",
        "A layout grid"
      ],
      correct: 1
    },
    {
      question: "What is the purpose of user personas?",
      options: [
        "To create user accounts",
        "To represent target users and guide design decisions",
        "To track user behavior",
        "To store user data"
      ],
      correct: 1
    },
    {
      question: "What is the 60-30-10 rule in design?",
      options: [
        "A spacing rule",
        "A color proportion rule (60% primary, 30% secondary, 10% accent)",
        "A font size rule",
        "A component size rule"
      ],
      correct: 1
    },
    {
      question: "What is the difference between UI and UX?",
      options: [
        "No difference",
        "UI is visual design, UX is overall user experience",
        "UI is for mobile, UX is for web",
        "UI is backend, UX is frontend"
      ],
      correct: 1
    }
  ],

  // Machine Learning
  "machine learning": [
    {
      question: "What is machine learning?",
      options: [
        "Manual programming",
        "Systems that learn from data",
        "Database management",
        "Web development"
      ],
      correct: 1
    },
    {
      question: "What is a neural network?",
      options: [
        "A database",
        "A computing system inspired by biological neural networks",
        "A programming language",
        "A design pattern"
      ],
      correct: 1
    },
    {
      question: "What is supervised learning?",
      options: [
        "Learning without data",
        "Learning from labeled training data",
        "Learning from unlabeled data",
        "Learning from reinforcement"
      ],
      correct: 1
    },
    {
      question: "What is overfitting in machine learning?",
      options: [
        "A model that performs well on training data but poorly on new data",
        "A model that is too simple",
        "A data preprocessing step",
        "A type of neural network"
      ],
      correct: 0
    },
    {
      question: "What is the purpose of training and testing datasets?",
      options: [
        "To store data",
        "To train the model and evaluate its performance",
        "To delete data",
        "To visualize data"
      ],
      correct: 1
    },
    {
      question: "What is feature engineering?",
      options: [
        "Creating new features from existing data to improve model performance",
        "Deleting features",
        "Visualizing features",
        "Storing features"
      ],
      correct: 0
    }
  ],

  // Photography
  photography: [
    {
      question: "What does ISO control in photography?",
      options: [
        "Shutter speed",
        "Camera sensitivity to light",
        "Aperture size",
        "Focus distance"
      ],
      correct: 1
    },
    {
      question: "What is the rule of thirds?",
      options: [
        "A camera setting",
        "A composition guideline dividing image into 9 equal parts",
        "A lighting technique",
        "A color theory"
      ],
      correct: 1
    },
    {
      question: "What does aperture control?",
      options: [
        "Shutter speed",
        "Amount of light and depth of field",
        "ISO sensitivity",
        "White balance"
      ],
      correct: 1
    },
    {
      question: "What is the golden hour?",
      options: [
        "Midday",
        "The hour after sunrise and before sunset with soft light",
        "Nighttime",
        "Noon"
      ],
      correct: 1
    },
    {
      question: "What is depth of field?",
      options: [
        "The distance between camera and subject",
        "The range of distance that appears sharp in a photo",
        "The camera lens type",
        "The image resolution"
      ],
      correct: 1
    },
    {
      question: "What is white balance used for?",
      options: [
        "To adjust image brightness",
        "To correct color temperature and remove color casts",
        "To change image size",
        "To add filters"
      ],
      correct: 1
    }
  ],

  // Public Speaking
  "public speaking": [
    {
      question: "What is the most important aspect of effective public speaking?",
      options: [
        "Speaking fast",
        "Connecting with your audience",
        "Using complex vocabulary",
        "Standing still"
      ],
      correct: 1
    },
    {
      question: "What is the purpose of a speech outline?",
      options: [
        "To memorize everything",
        "To organize thoughts and structure the presentation",
        "To write the full speech",
        "To time the speech"
      ],
      correct: 1
    },
    {
      question: "How should you handle nervousness before speaking?",
      options: [
        "Avoid the speech",
        "Practice, breathe deeply, and focus on the message",
        "Read from notes only",
        "Speak very quietly"
      ],
      correct: 1
    },
    {
      question: "What is the purpose of eye contact in public speaking?",
      options: [
        "To intimidate the audience",
        "To engage and connect with the audience",
        "To avoid looking at notes",
        "To check the time"
      ],
      correct: 1
    },
    {
      question: "What is the 7-38-55 rule in communication?",
      options: [
        "A time management rule",
        "7% words, 38% tone, 55% body language",
        "A speech structure",
        "A volume control rule"
      ],
      correct: 1
    },
    {
      question: "What is the purpose of storytelling in presentations?",
      options: [
        "To fill time",
        "To make content memorable and relatable",
        "To confuse the audience",
        "To show off knowledge"
      ],
      correct: 1
    }
  ],

  // Spanish Language
  spanish: [
    {
      question: "How do you say 'hello' in Spanish?",
      options: ["Hola", "Adiós", "Gracias", "Por favor"],
      correct: 0
    },
    {
      question: "What is the formal way to say 'you' in Spanish?",
      options: ["Tú", "Usted", "Vosotros", "Ellos"],
      correct: 1
    },
    {
      question: "How do you conjugate 'hablar' (to speak) for 'yo' (I)?",
      options: ["Hablas", "Habla", "Hablo", "Hablan"],
      correct: 2
    },
    {
      question: "What is the difference between 'ser' and 'estar'?",
      options: [
        "No difference",
        "'Ser' is for permanent traits, 'estar' is for temporary states",
        "'Estar' is for permanent traits, 'ser' is for temporary states",
        "They're different tenses"
      ],
      correct: 1
    },
    {
      question: "How do you say 'thank you' in Spanish?",
      options: ["Por favor", "Gracias", "De nada", "Lo siento"],
      correct: 1
    },
    {
      question: "What is the plural of 'el libro' (the book)?",
      options: ["Los libros", "Las libros", "El libros", "La libros"],
      correct: 0
    }
  ]
}

/**
 * Normalize skill name for lookup
 * Converts to lowercase and handles common variations
 */
function normalizeSkillName(skillName: string): string {
  return skillName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/[^\w\s]/g, "") // Remove special characters
}

/**
 * Find matching skill key in the questions map
 * Handles variations like "Python Programming" -> "python"
 */
function findSkillKey(skillName: string): string | null {
  const normalized = normalizeSkillName(skillName)
  
  // Direct match
  if (skillQuestions[normalized]) {
    return normalized
  }
  
  // Partial match - check if skill name contains any key
  for (const key of Object.keys(skillQuestions)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return key
    }
  }
  
  // Check common aliases
  const aliases: Record<string, string> = {
    "python programming": "python",
    "java programming": "java",
    "react development": "react",
    "react.js": "react",
    "reactjs": "react",
    "javascript": "javascript",
    "js": "javascript",
    "ui design": "ui/ux design",
    "ux design": "ui/ux design",
    "ui/ux": "ui/ux design",
    "machine learning": "machine learning",
    "ml": "machine learning",
    "ai/ml": "machine learning",
    "photography": "photography",
    "public speaking": "public speaking",
    "spanish": "spanish",
    "spanish language": "spanish"
  }
  
  if (aliases[normalized]) {
    return aliases[normalized]
  }
  
  return null
}

/**
 * Get questions for a specific skill
 * @param skillName - The exact skill name (e.g., "Python", "React", "UI/UX Design")
 * @returns Array of questions for that skill, or empty array if not found
 */
export function getQuestionsForSkill(skillName: string): Question[] {
  if (!skillName || typeof skillName !== "string") {
    return []
  }
  
  const skillKey = findSkillKey(skillName)
  
  if (!skillKey || !skillQuestions[skillKey]) {
    return []
  }
  
  return skillQuestions[skillKey]
}

/**
 * Check if a skill has questions available
 * @param skillName - The skill name to check
 * @returns true if at least 5 questions exist for this skill
 */
export function hasQuestionsForSkill(skillName: string): boolean {
  const questions = getQuestionsForSkill(skillName)
  return questions.length >= 5
}

/**
 * Get all available skills that have questions
 * @returns Array of skill names that have questions
 */
export function getAvailableSkills(): string[] {
  return Object.keys(skillQuestions)
}

/**
 * Get question count for a skill
 * @param skillName - The skill name
 * @returns Number of questions available, or 0 if not found
 */
export function getQuestionCount(skillName: string): number {
  return getQuestionsForSkill(skillName).length
}








