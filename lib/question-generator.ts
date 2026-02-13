export interface Question {
  question: string
  options: string[]
  correct: number
}

export type SkillQuestionsMap = Record<string, Question[]>

const skillQuestions: SkillQuestionsMap = {

  python: [
    { question: "Which keyword defines a function in Python?", options: ["function", "def", "func", "define"], correct: 1 },
    { question: "What does len() do?", options: ["Adds numbers", "Returns length", "Prints output", "Loops list"], correct: 1 },
    { question: "Which data type is immutable?", options: ["List", "Dictionary", "Tuple", "Set"], correct: 2 },
    { question: "What is PIP?", options: ["Package manager", "IDE", "Loop", "Framework"], correct: 0 },
    { question: "What does ** mean?", options: ["Multiply", "Power", "Divide", "Modulo"], correct: 1 }
  ],

  react: [
    { question: "What is JSX?", options: ["JavaScript XML", "JSON XML", "Java Syntax", "Style Sheet"], correct: 0 },
    { question: "Which hook manages state?", options: ["useEffect", "useState", "useRef", "useMemo"], correct: 1 },
    { question: "Props are?", options: ["Internal state", "Data from parent", "Hooks", "CSS"], correct: 1 },
    { question: "Virtual DOM improves?", options: ["Security", "Performance", "Storage", "Routing"], correct: 1 },
    { question: "Key prop helps React to?", options: ["Style items", "Identify elements", "Fetch API", "Debug"], correct: 1 }
  ],

  "machine learning": [
    { question: "Supervised learning uses?", options: ["Labeled data", "Unlabeled data", "No data", "Random data"], correct: 0 },
    { question: "Overfitting means?", options: ["Too simple", "Too complex on training data", "Perfect model", "Under trained"], correct: 1 },
    { question: "Neural networks are inspired by?", options: ["Brain", "CPU", "Database", "GPU"], correct: 0 },
    { question: "Regression predicts?", options: ["Category", "Continuous value", "Image", "Text"], correct: 1 },
    { question: "Feature engineering means?", options: ["Creating features", "Deleting data", "Training faster", "Testing model"], correct: 0 }
  ],

  "ui/ux design": [
    { question: "UX stands for?", options: ["User Experience", "User Extension", "Universal XML", "User Execution"], correct: 0 },
    { question: "Wireframe is?", options: ["Final design", "Layout structure", "Animation", "Font"], correct: 1 },
    { question: "UI focuses on?", options: ["Backend", "Visual interface", "Database", "Server"], correct: 1 },
    { question: "Persona represents?", options: ["Developer", "Target user", "Admin", "Tester"], correct: 1 },
    { question: "F-pattern relates to?", options: ["Color rule", "Reading behavior", "Grid system", "Typography"], correct: 1 }
  ],

  photography: [
    { question: "ISO controls?", options: ["Light sensitivity", "Zoom", "Focus", "Color"], correct: 0 },
    { question: "Aperture controls?", options: ["Light & depth", "Zoom", "Storage", "Resolution"], correct: 0 },
    { question: "Golden hour occurs?", options: ["Noon", "After sunrise/before sunset", "Midnight", "Evening only"], correct: 1 },
    { question: "Rule of thirds divides into?", options: ["4 parts", "6 parts", "9 parts", "12 parts"], correct: 2 },
    { question: "White balance fixes?", options: ["Brightness", "Color tone", "Noise", "Contrast"], correct: 1 }
  ],

  "public speaking": [
    { question: "Eye contact helps?", options: ["Scare audience", "Engage audience", "Forget lines", "Reduce volume"], correct: 1 },
    { question: "Speech outline is for?", options: ["Memorizing", "Structuring ideas", "Decorating slides", "Timing only"], correct: 1 },
    { question: "Body language percentage?", options: ["7%", "38%", "55%", "100%"], correct: 2 },
    { question: "Storytelling makes speech?", options: ["Long", "Memorable", "Confusing", "Short"], correct: 1 },
    { question: "Practice helps?", options: ["Increase fear", "Reduce confidence", "Build confidence", "Forget content"], correct: 2 }
  ],

  spanish: [
    { question: "Hello in Spanish?", options: ["Hola", "Gracias", "Adios", "Por favor"], correct: 0 },
    { question: "Thank you in Spanish?", options: ["Hola", "Gracias", "Si", "No"], correct: 1 },
    { question: "Formal 'you'?", options: ["Tu", "Usted", "Vos", "Nosotros"], correct: 1 },
    { question: "Ser vs Estar?", options: ["No difference", "Permanent vs temporary", "Tense change", "Plural rule"], correct: 1 },
    { question: "Libro plural?", options: ["Los libros", "La libros", "El libros", "Las libro"], correct: 0 }
  ],

  french: [
    { question: "Hello in French?", options: ["Hola", "Bonjour", "Ciao", "Danke"], correct: 1 },
    { question: "Thank you in French?", options: ["Merci", "Gracias", "Danke", "Hello"], correct: 0 },
    { question: "Oui means?", options: ["No", "Yes", "Please", "Bye"], correct: 1 },
    { question: "Goodbye?", options: ["Bonjour", "Au revoir", "Merci", "Oui"], correct: 1 },
    { question: "Je means?", options: ["You", "We", "I", "They"], correct: 2 }
  ],

  german: [
    { question: "Hello in German?", options: ["Hallo", "Bonjour", "Hola", "Ciao"], correct: 0 },
    { question: "Thank you?", options: ["Danke", "Merci", "Gracias", "Ciao"], correct: 0 },
    { question: "Ja means?", options: ["Yes", "No", "Maybe", "Hello"], correct: 0 },
    { question: "Goodbye?", options: ["Tschüss", "Hola", "Merci", "Oui"], correct: 0 },
    { question: "Ich means?", options: ["You", "He", "I", "They"], correct: 2 }
  ],

  "content writing": [
    { question: "SEO stands for?", options: ["Search Engine Optimization", "Social Engine", "Server Execution", "Site Output"], correct: 0 },
    { question: "Hook in writing?", options: ["Title", "Opening line", "Conclusion", "Image"], correct: 1 },
    { question: "CTA means?", options: ["Call To Action", "Content Text Area", "Click Tag", "Core Title"], correct: 0 },
    { question: "Plagiarism is?", options: ["Original writing", "Copying content", "Editing text", "Formatting"], correct: 1 },
    { question: "Tone defines?", options: ["Length", "Voice/style", "Font", "SEO rank"], correct: 1 }
  ],

  "video editing": [
    { question: "Timeline is?", options: ["Storage", "Editing workspace", "Export option", "Camera"], correct: 1 },
    { question: "Cut tool does?", options: ["Add music", "Split clip", "Add color", "Zoom"], correct: 1 },
    { question: "Rendering means?", options: ["Deleting file", "Processing final video", "Recording", "Uploading"], correct: 1 },
    { question: "Transition used for?", options: ["Joining clips smoothly", "Zoom", "Export", "Audio only"], correct: 0 },
    { question: "FPS stands for?", options: ["Frames per second", "Files per second", "Filter per scene", "Final process speed"], correct: 0 }
  ],

  "graphic design": [
    { question: "RGB used for?", options: ["Print", "Digital screens", "Newspaper", "Books"], correct: 1 },
    { question: "Vector graphics are?", options: ["Pixel based", "Resolution independent", "Blurry", "Low quality"], correct: 1 },
    { question: "Typography means?", options: ["Image editing", "Font styling", "Animation", "Layout coding"], correct: 1 },
    { question: "CMYK used for?", options: ["Web", "Print", "Video", "Audio"], correct: 1 },
    { question: "Contrast improves?", options: ["Readability", "File size", "Code speed", "Export time"], correct: 0 }
  ],

  "data analysis": [
    { question: "Mean is?", options: ["Average", "Middle value", "Most frequent", "Range"], correct: 0 },
    { question: "Median is?", options: ["Average", "Middle value", "Highest", "Lowest"], correct: 1 },
    { question: "Excel used for?", options: ["Coding", "Data analysis", "Gaming", "Design"], correct: 1 },
    { question: "Visualization helps?", options: ["Delete data", "Understand patterns", "Slow process", "Crash system"], correct: 1 },
    { question: "Outlier is?", options: ["Normal value", "Extreme value", "Median", "Mode"], correct: 1 }
  ],

  "mobile development": [
    { question: "Android uses?", options: ["Swift", "Kotlin/Java", "Python", "Ruby"], correct: 1 },
    { question: "iOS apps built with?", options: ["Swift", "Java", "C#", "PHP"], correct: 0 },
    { question: "APK stands for?", options: ["Android Package", "App Key", "Application Kit", "App Kernel"], correct: 0 },
    { question: "React Native builds?", options: ["Web only", "Mobile apps", "Games only", "Servers"], correct: 1 },
    { question: "Emulator used for?", options: ["Testing app", "Publishing", "Designing logo", "Storage"], correct: 0 }
  ],

  "game development": [
    { question: "Unity is?", options: ["Game engine", "Database", "IDE", "Language"], correct: 0 },
    { question: "FPS in games means?", options: ["Frames per second", "Final process", "Fast play system", "File per save"], correct: 0 },
    { question: "Physics engine handles?", options: ["Lighting", "Movement & collision", "Sound only", "UI only"], correct: 1 },
    { question: "Sprite is?", options: ["3D model", "2D image asset", "Sound file", "Database"], correct: 1 },
    { question: "Game loop controls?", options: ["Design", "Core gameplay cycle", "Export", "Database"], correct: 1 }
  ]

}

export function getQuestionsForSkill(skillName: string): Question[] {
  if (!skillName) return []
  const key = skillName.toLowerCase().trim()
  return skillQuestions[key] || []
}
