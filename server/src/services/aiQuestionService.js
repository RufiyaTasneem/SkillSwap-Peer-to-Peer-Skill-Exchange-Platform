/**
 * AI Question Generation Service
 * Uses OpenAI to generate skill test questions when predefined ones don't exist
 */
const normalizeKey = (s) =>
    String(s).trim().toLowerCase().replace(/\s+/g, " ")

import OpenAI from 'openai';

// Initialize OpenAI client only when API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
    try {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    } catch (error) {
        console.error('Failed to initialize OpenAI client:', error);
    }
}

/**
 * Normalize questions to ensure correctAnswer is converted to correctAnswerIndex
 * @param {Array} questions - Array of question objects
 * @returns {Array} Normalized questions with correctAnswerIndex
 */
function normalizeQuestions(questions) {
    return questions.map(q => {
        let correctAnswerIndex;
        if (typeof q.correctAnswer === 'string') {
            if (['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
                // Convert letter to index
                correctAnswerIndex = q.correctAnswer.charCodeAt(0) - 'A'.charCodeAt(0);
            } else {
                // Find index by matching text
                correctAnswerIndex = q.options.indexOf(q.correctAnswer);
                if (correctAnswerIndex === -1) {
                    console.error(`Invalid correctAnswer for question: ${q.question}. Answer: ${q.correctAnswer}, Options: ${q.options}`);
                    throw new Error(`Correct answer not found in options for question: ${q.question}`);
                }
            }
        } else if (typeof q.correctAnswer === 'number') {
            // Already normalized
            correctAnswerIndex = q.correctAnswer;
        } else {
            console.error(`Invalid correctAnswer type for question: ${q.question}. Type: ${typeof q.correctAnswer}`);
            throw new Error(`Invalid correctAnswer type for question: ${q.question}`);
        }
        return {
            question: q.question,
            options: q.options,
            correctAnswerIndex
        };
    });
}

/**
 * Predefined high-quality questions for each skill
 * These are manually crafted to ensure quality and accuracy
 */
const RAW_QUESTIONS = {
    "Python Programming": [
        {
            "question": "What is the output of print(type([]))?",
            "options": ["<class 'list'>", "<class 'dict'>", "<class 'tuple'>", "<class 'set'>"],
            "correctAnswer": "<class 'list'>"
        },
        {
            "question": "Which data type is mutable in Python?",
            "options": ["tuple", "string", "list", "int"],
            "correctAnswer": "list"
        },
        {
            "question": "What keyword is used to define a function in Python?",
            "options": ["function", "def", "func", "define"],
            "correctAnswer": "def"
        },
        {
            "question": "What will len({1,2,2,3}) return?",
            "options": ["3", "4", "2", "5"],
            "correctAnswer": "3"
        },
        {
            "question": "Which operator is used for floor division?",
            "options": ["/", "//", "%", "*"],
            "correctAnswer": "//"
        },
        {
            "question": "What does list.append(x) do?",
            "options": ["Removes x from list", "Inserts x at beginning", "Adds x to end of list", "Replaces all elements with x"],
            "correctAnswer": "Adds x to end of list"
        },
        {
            "question": "What is the correct way to handle exceptions?",
            "options": ["try-except", "if-else", "for loop", "while loop"],
            "correctAnswer": "try-except"
        },
        {
            "question": "What does __init__ do in a class?",
            "options": ["Defines class methods", "Initializes object attributes", "Creates class instances", "Deletes objects"],
            "correctAnswer": "Initializes object attributes"
        },
        {
            "question": "What is a list comprehension?",
            "options": ["A way to sort lists", "A concise way to create lists", "A method to reverse lists", "A way to copy lists"],
            "correctAnswer": "A concise way to create lists"
        },
        {
            "question": "What is the output of print(2 ** 3)?",
            "options": ["5", "6", "8", "9"],
            "correctAnswer": "8"
        }
    ],

    "React Development": [
        {
            "question": "What is JSX in React?",
            "options": ["A database", "A syntax extension for JavaScript", "A CSS framework", "A testing library"],
            "correctAnswer": "A syntax extension for JavaScript"
        },
        {
            "question": "Which hook is used to manage state?",
            "options": ["useEffect", "useState", "useContext", "useReducer"],
            "correctAnswer": "useState"
        },
        {
            "question": "What is the purpose of useEffect?",
            "options": ["To manage state", "To handle side effects", "To create components", "To handle events"],
            "correctAnswer": "To handle side effects"
        },
        {
            "question": "How do you pass data to a component?",
            "options": ["Through state", "Through props", "Through context", "Through refs"],
            "correctAnswer": "Through props"
        },
        {
            "question": "What is a controlled component?",
            "options": ["A component with no state", "A component controlled by parent", "A component that controls its own state", "A component with refs"],
            "correctAnswer": "A component that controls its own state"
        },
        {
            "question": "Why are keys important in lists?",
            "options": ["For styling", "For performance and reconciliation", "For routing", "For testing"],
            "correctAnswer": "For performance and reconciliation"
        },
        {
            "question": "What does lifting state up mean?",
            "options": ["Moving state to a higher component", "Deleting state", "Creating new state", "Moving state to a lower component"],
            "correctAnswer": "Moving state to a higher component"
        },
        {
            "question": "What is the virtual DOM?",
            "options": ["A copy of the real DOM", "A database", "A testing tool", "A CSS framework"],
            "correctAnswer": "A copy of the real DOM"
        },
        {
            "question": "Which hook is used for context?",
            "options": ["useState", "useEffect", "useContext", "useReducer"],
            "correctAnswer": "useContext"
        },
        {
            "question": "What happens when state changes?",
            "options": ["Component re-renders", "Component unmounts", "Component mounts", "Nothing happens"],
            "correctAnswer": "Component re-renders"
        }
    ],

    "Machine Learning": [
        {
            "question": "What is supervised learning?",
            "options": ["Learning without labeled data", "Learning with labeled training data", "Learning from unlabeled data", "Learning from images only"],
            "correctAnswer": "Learning with labeled training data"
        },
        {
            "question": "What is overfitting?",
            "options": ["Model performs poorly on training data", "Model performs well on training but poorly on new data", "Model performs equally on all data", "Model has perfect accuracy"],
            "correctAnswer": "Model performs well on training but poorly on new data"
        },
        {
            "question": "Which metric is best for imbalanced datasets?",
            "options": ["Accuracy", "Precision and Recall", "Mean Squared Error", "R-squared"],
            "correctAnswer": "Precision and Recall"
        },
        {
            "question": "What is a training dataset?",
            "options": ["Data used to test the model", "Data used to train the model", "Data used for validation", "Data used for deployment"],
            "correctAnswer": "Data used to train the model"
        },
        {
            "question": "What does feature scaling do?",
            "options": ["Removes features", "Normalizes feature ranges", "Creates new features", "Selects important features"],
            "correctAnswer": "Normalizes feature ranges"
        },
        {
            "question": "What is the purpose of cross-validation?",
            "options": ["To train faster", "To evaluate model performance reliably", "To reduce dataset size", "To increase model complexity"],
            "correctAnswer": "To evaluate model performance reliably"
        },
        {
            "question": "What is regression used for?",
            "options": ["Categorizing data", "Predicting continuous values", "Finding patterns", "Reducing dimensions"],
            "correctAnswer": "Predicting continuous values"
        },
        {
            "question": "What is classification?",
            "options": ["Predicting continuous values", "Assigning categories to data", "Finding clusters", "Reducing noise"],
            "correctAnswer": "Assigning categories to data"
        },
        {
            "question": "What does a confusion matrix show?",
            "options": ["Model accuracy only", "True/false positives and negatives", "Training time", "Model complexity"],
            "correctAnswer": "True/false positives and negatives"
        },
        {
            "question": "What is underfitting?",
            "options": ["Model performs well on training data", "Model performs poorly on both training and new data", "Model has high variance", "Model memorizes training data"],
            "correctAnswer": "Model performs poorly on both training and new data"
        }
    ],

    "UI/UX Design": [
        {
            "question": "What is the difference between UI and UX?",
            "options": ["They are the same", "UI is visual design, UX is user experience", "UI is coding, UX is design", "UI is mobile, UX is web"],
            "correctAnswer": "UI is visual design, UX is user experience"
        },
        {
            "question": "What is a wireframe?",
            "options": ["Final design mockup", "Low-fidelity layout sketch", "High-fidelity prototype", "Color palette"],
            "correctAnswer": "Low-fidelity layout sketch"
        },
        {
            "question": "What is a prototype?",
            "options": ["Static image", "Interactive model of the design", "User research report", "Design specification"],
            "correctAnswer": "Interactive model of the design"
        },
        {
            "question": "What is user research?",
            "options": ["Designing interfaces", "Understanding user needs and behaviors", "Writing code", "Creating graphics"],
            "correctAnswer": "Understanding user needs and behaviors"
        },
        {
            "question": "What does accessibility mean in design?",
            "options": ["Making designs look good", "Ensuring designs work for all users", "Using bright colors", "Following trends"],
            "correctAnswer": "Ensuring designs work for all users"
        },
        {
            "question": "What is usability testing?",
            "options": ["Testing code performance", "Observing users interact with design", "Checking color contrast", "Validating HTML"],
            "correctAnswer": "Observing users interact with design"
        },
        {
            "question": "What is design thinking?",
            "options": ["Thinking about colors", "Human-centered problem-solving approach", "Thinking about layouts", "Thinking about fonts"],
            "correctAnswer": "Human-centered problem-solving approach"
        },
        {
            "question": "What is visual hierarchy?",
            "options": ["Using same size for everything", "Arranging elements by importance", "Using random layouts", "Ignoring spacing"],
            "correctAnswer": "Arranging elements by importance"
        },
        {
            "question": "What is a user persona?",
            "options": ["A real user", "Fictional representation of target user", "Design team member", "Stakeholder"],
            "correctAnswer": "Fictional representation of target user"
        },
        {
            "question": "What is consistency in UI design?",
            "options": ["Using different styles everywhere", "Using uniform elements and patterns", "Changing layouts randomly", "Ignoring design systems"],
            "correctAnswer": "Using uniform elements and patterns"
        }
    ],

    "Data Analysis": [
        {
            "question": "What is data cleaning?",
            "options": ["Creating new data", "Removing errors and inconsistencies", "Analyzing trends", "Visualizing data"],
            "correctAnswer": "Removing errors and inconsistencies"
        },
        {
            "question": "What is a missing value?",
            "options": ["A zero value", "An empty or null data point", "A duplicate value", "An outlier"],
            "correctAnswer": "An empty or null data point"
        },
        {
            "question": "What does mean represent?",
            "options": ["Most frequent value", "Average of all values", "Middle value when sorted", "Most extreme value"],
            "correctAnswer": "Average of all values"
        },
        {
            "question": "What is median?",
            "options": ["Average of values", "Middle value in sorted data", "Most frequent value", "Sum of all values"],
            "correctAnswer": "Middle value in sorted data"
        },
        {
            "question": "What is data visualization?",
            "options": ["Representing data graphically", "Storing data", "Cleaning data", "Analyzing text"],
            "correctAnswer": "Representing data graphically"
        },
        {
            "question": "What is an outlier?",
            "options": ["A normal data point", "A value significantly different from others", "A missing value", "A duplicate value"],
            "correctAnswer": "A value significantly different from others"
        },
        {
            "question": "What is a dataframe?",
            "options": ["A single column", "A 2D labeled data structure", "A chart type", "A database"],
            "correctAnswer": "A 2D labeled data structure"
        },
        {
            "question": "What is exploratory data analysis?",
            "options": ["Final reporting", "Initial investigation of data", "Data cleaning only", "Model building"],
            "correctAnswer": "Initial investigation of data"
        },
        {
            "question": "What does correlation show?",
            "options": ["Causation between variables", "Relationship strength between variables", "Data distribution", "Missing values"],
            "correctAnswer": "Relationship strength between variables"
        },
        {
            "question": "What is normalization?",
            "options": ["Making data abnormal", "Scaling data to standard range", "Removing duplicates", "Converting to text"],
            "correctAnswer": "Scaling data to standard range"
        }
    ],

    "Public Speaking": [
        {
            "question": "What is voice modulation?",
            "options": ["Speaking very loudly", "Varying pitch, pace, and volume", "Using only one tone", "Speaking very softly"],
            "correctAnswer": "Varying pitch, pace, and volume"
        },
        {
            "question": "Why is body language important?",
            "options": ["For fashion", "It conveys confidence and engagement", "To look busy", "For exercise"],
            "correctAnswer": "It conveys confidence and engagement"
        },
        {
            "question": "What is audience engagement?",
            "options": ["Ignoring the audience", "Interacting and connecting with listeners", "Speaking to the wall", "Reading notes only"],
            "correctAnswer": "Interacting and connecting with listeners"
        },
        {
            "question": "What is stage fright?",
            "options": ["Excitement about speaking", "Fear and anxiety before speaking", "Physical exhaustion", "Hunger"],
            "correctAnswer": "Fear and anxiety before speaking"
        },
        {
            "question": "What is a persuasive speech?",
            "options": ["Telling jokes", "Convincing audience to take action", "Reading facts", "Asking questions"],
            "correctAnswer": "Convincing audience to take action"
        },
        {
            "question": "Why is eye contact important?",
            "options": ["To see better", "Builds trust and connection", "To avoid seeing people", "For fashion"],
            "correctAnswer": "Builds trust and connection"
        },
        {
            "question": "What is speech structure?",
            "options": ["Random thoughts", "Organized flow with intro, body, conclusion", "Only conclusion", "Only introduction"],
            "correctAnswer": "Organized flow with intro, body, conclusion"
        },
        {
            "question": "What helps reduce nervousness?",
            "options": ["Avoiding preparation", "Practice and deep breathing", "Speaking faster", "Ignoring the audience"],
            "correctAnswer": "Practice and deep breathing"
        },
        {
            "question": "What is storytelling in speeches?",
            "options": ["Reading facts", "Using narratives to engage audience", "Asking questions", "Making jokes"],
            "correctAnswer": "Using narratives to engage audience"
        },
        {
            "question": "What is a call to action?",
            "options": ["Requesting specific audience response", "Ending the speech", "Thanking people", "Introducing yourself"],
            "correctAnswer": "Requesting specific audience response"
        }
    ],

    "Spanish": [
        {
            "question": "What does 'Hola' mean?",
            "options": ["Goodbye", "Hello", "Thank you", "Please"],
            "correctAnswer": "Hello"
        },
        {
            "question": "What is the Spanish word for 'Thank you'?",
            "options": ["Por favor", "Hola", "Gracias", "Adiós"],
            "correctAnswer": "Gracias"
        },
        {
            "question": "Which is a Spanish verb?",
            "options": ["Casa", "Comer", "Mesa", "Libro"],
            "correctAnswer": "Comer"
        },
        {
            "question": "What does 'Buenos días' mean?",
            "options": ["Good evening", "Good morning", "Good night", "Good afternoon"],
            "correctAnswer": "Good morning"
        },
        {
            "question": "What is the plural of 'libro'?",
            "options": ["Libros", "Libroes", "Libras", "Libres"],
            "correctAnswer": "Libros"
        },
        {
            "question": "What does 'por favor' mean?",
            "options": ["Excuse me", "Please", "Thank you", "You're welcome"],
            "correctAnswer": "Please"
        },
        {
            "question": "Which article is masculine?",
            "options": ["La", "Las", "El", "Los"],
            "correctAnswer": "El"
        },
        {
            "question": "What is 'comer'?",
            "options": ["To drink", "To eat", "To sleep", "To run"],
            "correctAnswer": "To eat"
        },
        {
            "question": "What does 'sí' mean?",
            "options": ["No", "Yes", "Maybe", "Why"],
            "correctAnswer": "Yes"
        },
        {
            "question": "What language family does Spanish belong to?",
            "options": ["Germanic", "Romance", "Slavic", "Asian"],
            "correctAnswer": "Romance"
        }
    ],

    "German": [
        {
            "question": "What does 'Hallo' mean?",
            "options": ["Goodbye", "Hello", "Thank you", "Please"],
            "correctAnswer": "Hello"
        },
        {
            "question": "Which article is used for 'Mädchen'?",
            "options": ["Der", "Die", "Das", "Den"],
            "correctAnswer": "Das"
        },
        {
            "question": "What does 'Danke' mean?",
            "options": ["Please", "Hello", "Thank you", "Goodbye"],
            "correctAnswer": "Thank you"
        },
        {
            "question": "What is the German word for 'House'?",
            "options": ["Auto", "Haus", "Baum", "Wasser"],
            "correctAnswer": "Haus"
        },
        {
            "question": "Which article is masculine?",
            "options": ["Die", "Das", "Der", "Den"],
            "correctAnswer": "Der"
        },
        {
            "question": "What does 'Guten Morgen' mean?",
            "options": ["Good evening", "Good morning", "Good night", "Good afternoon"],
            "correctAnswer": "Good morning"
        },
        {
            "question": "What is the plural of 'Auto'?",
            "options": ["Autos", "Autoes", "Auten", "Autas"],
            "correctAnswer": "Autos"
        },
        {
            "question": "What does 'bitte' mean?",
            "options": ["Thank you", "Please", "Hello", "Goodbye"],
            "correctAnswer": "Please"
        },
        {
            "question": "What is the verb 'sein'?",
            "options": ["To have", "To be", "To go", "To eat"],
            "correctAnswer": "To be"
        },
        {
            "question": "What language family is German from?",
            "options": ["Romance", "Slavic", "Germanic", "Asian"],
            "correctAnswer": "Germanic"
        }
    ],

    "French": [
        {
            "question": "What does 'Bonjour' mean?",
            "options": ["Goodbye", "Hello", "Thank you", "Please"],
            "correctAnswer": "Hello"
        },
        {
            "question": "What is the French word for 'Thank you'?",
            "options": ["S'il vous plaît", "Bonjour", "Merci", "Au revoir"],
            "correctAnswer": "Merci"
        },
        {
            "question": "Which article is feminine?",
            "options": ["Le", "La", "Les", "Un"],
            "correctAnswer": "La"
        },
        {
            "question": "What does 'oui' mean?",
            "options": ["No", "Yes", "Maybe", "Why"],
            "correctAnswer": "Yes"
        },
        {
            "question": "What is the plural of 'livre'?",
            "options": ["Livres", "Livre", "Livras", "Livrons"],
            "correctAnswer": "Livres"
        },
        {
            "question": "What does 'au revoir' mean?",
            "options": ["Hello", "Please", "Goodbye", "Thank you"],
            "correctAnswer": "Goodbye"
        },
        {
            "question": "What is a French verb?",
            "options": ["Maison", "Manager", "Table", "Livre"],
            "correctAnswer": "Manager"
        },
        {
            "question": "What does 'non' mean?",
            "options": ["Yes", "No", "Maybe", "Why"],
            "correctAnswer": "No"
        },
        {
            "question": "What language family is French from?",
            "options": ["Germanic", "Slavic", "Romance", "Asian"],
            "correctAnswer": "Romance"
        },
        {
            "question": "What does 's'il vous plaît' mean?",
            "options": ["Thank you", "Hello", "Please", "Goodbye"],
            "correctAnswer": "Please"
        }
    ],

    "Photography": [
        {
            "question": "What does ISO control?",
            "options": ["Aperture size", "Sensor sensitivity to light", "Shutter speed", "Focus distance"],
            "correctAnswer": "Sensor sensitivity to light"
        },
        {
            "question": "What is aperture?",
            "options": ["Shutter speed", "Lens opening size", "ISO setting", "Focus ring"],
            "correctAnswer": "Lens opening size"
        },
        {
            "question": "What is shutter speed?",
            "options": ["Lens opening", "How long shutter stays open", "Sensor sensitivity", "Focus distance"],
            "correctAnswer": "How long shutter stays open"
        },
        {
            "question": "What is depth of field?",
            "options": ["Image brightness", "Area in focus", "Color accuracy", "Image size"],
            "correctAnswer": "Area in focus"
        },
        {
            "question": "What is the exposure triangle?",
            "options": ["ISO, aperture, shutter speed", "Red, green, blue", "Width, height, depth", "Focus, zoom, macro"],
            "correctAnswer": "ISO, aperture, shutter speed"
        },
        {
            "question": "What does a low ISO do?",
            "options": ["Makes image brighter", "Reduces noise, less sensitive", "Increases shutter speed", "Changes colors"],
            "correctAnswer": "Reduces noise, less sensitive"
        },
        {
            "question": "What is composition?",
            "options": ["Camera settings", "Arrangement of elements in frame", "Image processing", "Lens selection"],
            "correctAnswer": "Arrangement of elements in frame"
        },
        {
            "question": "What is rule of thirds?",
            "options": ["Using three cameras", "Dividing frame into thirds for composition", "Taking three photos", "Three exposure settings"],
            "correctAnswer": "Dividing frame into thirds for composition"
        },
        {
            "question": "What does aperture affect?",
            "options": ["Shutter speed", "Depth of field and light", "ISO sensitivity", "Image size"],
            "correctAnswer": "Depth of field and light"
        },
        {
            "question": "What is white balance?",
            "options": ["Image brightness", "Color temperature adjustment", "Focus accuracy", "Image sharpness"],
            "correctAnswer": "Color temperature adjustment"
        }
    ],

    "Video Editing": [
        {
            "question": "What is a timeline?",
            "options": ["Video camera", "Sequence of clips over time", "Video effects", "Audio settings"],
            "correctAnswer": "Sequence of clips over time"
        },
        {
            "question": "What does frame rate mean?",
            "options": ["Video quality", "Frames per second", "Video length", "File size"],
            "correctAnswer": "Frames per second"
        },
        {
            "question": "What is a transition?",
            "options": ["Video clip", "Effect between clips", "Audio track", "Text overlay"],
            "correctAnswer": "Effect between clips"
        },
        {
            "question": "What is color grading?",
            "options": ["Adding text", "Adjusting colors and tones", "Changing speed", "Adding effects"],
            "correctAnswer": "Adjusting colors and tones"
        },
        {
            "question": "What is trimming a clip?",
            "options": ["Making it louder", "Cutting unwanted parts", "Adding effects", "Changing speed"],
            "correctAnswer": "Cutting unwanted parts"
        },
        {
            "question": "What is rendering?",
            "options": ["Recording video", "Processing final video file", "Adding transitions", "Editing audio"],
            "correctAnswer": "Processing final video file"
        },
        {
            "question": "What is a cut?",
            "options": ["Video effect", "Instant transition between clips", "Audio adjustment", "Color change"],
            "correctAnswer": "Instant transition between clips"
        },
        {
            "question": "What does FPS stand for?",
            "options": ["First Person Shooter", "Frames Per Second", "Fast Processing Speed", "File Playback System"],
            "correctAnswer": "Frames Per Second"
        },
        {
            "question": "What is video resolution?",
            "options": ["Video length", "Image size in pixels", "Frame rate", "File format"],
            "correctAnswer": "Image size in pixels"
        },
        {
            "question": "What is a keyframe?",
            "options": ["Main video clip", "Point defining animation change", "Audio marker", "Transition point"],
            "correctAnswer": "Point defining animation change"
        }
    ],

    "Graphic Design": [
        {
            "question": "What is typography?",
            "options": ["Color selection", "Art of arranging text", "Image editing", "Layout design"],
            "correctAnswer": "Art of arranging text"
        },
        {
            "question": "What is color theory?",
            "options": ["Using only black", "Study of color relationships", "Digital tools", "Print techniques"],
            "correctAnswer": "Study of color relationships"
        },
        {
            "question": "What is contrast?",
            "options": ["Using same colors", "Difference between elements", "Small text", "Large images"],
            "correctAnswer": "Difference between elements"
        },
        {
            "question": "What is alignment?",
            "options": ["Making things crooked", "Arranging elements consistently", "Using random positions", "Ignoring spacing"],
            "correctAnswer": "Arranging elements consistently"
        },
        {
            "question": "What is whitespace?",
            "options": ["Filled space", "Empty space in design", "Colored areas", "Text areas"],
            "correctAnswer": "Empty space in design"
        },
        {
            "question": "What is branding?",
            "options": ["Company logo only", "Creating consistent identity", "Product packaging", "Marketing campaigns"],
            "correctAnswer": "Creating consistent identity"
        },
        {
            "question": "What is hierarchy?",
            "options": ["Equal importance", "Organizing by importance", "Random arrangement", "Same sizes"],
            "correctAnswer": "Organizing by importance"
        },
        {
            "question": "What is vector design?",
            "options": ["Pixel-based images", "Scalable path-based graphics", "Photo editing", "3D modeling"],
            "correctAnswer": "Scalable path-based graphics"
        },
        {
            "question": "What is raster design?",
            "options": ["Vector graphics", "Pixel-based images", "Text design", "Logo creation"],
            "correctAnswer": "Pixel-based images"
        },
        {
            "question": "What is balance in design?",
            "options": ["Making things uneven", "Visual equilibrium", "Using one color", "Ignoring composition"],
            "correctAnswer": "Visual equilibrium"
        }
    ],

    "Mobile Development": [
        {
            "question": "What is an APK?",
            "options": ["Android application package", "iOS app file", "Mobile database", "App store"],
            "correctAnswer": "Android application package"
        },
        {
            "question": "What is an app lifecycle?",
            "options": ["App design process", "Stages from creation to end", "User interface", "App testing"],
            "correctAnswer": "Stages from creation to end"
        },
        {
            "question": "What is a mobile UI?",
            "options": ["App code", "User interface for mobile", "Database structure", "Server backend"],
            "correctAnswer": "User interface for mobile"
        },
        {
            "question": "What is an API?",
            "options": ["Application Programming Interface", "App interface", "App package", "User interface"],
            "correctAnswer": "Application Programming Interface"
        },
        {
            "question": "What is cross-platform development?",
            "options": ["One platform only", "Apps working on multiple platforms", "Web only apps", "Native only apps"],
            "correctAnswer": "Apps working on multiple platforms"
        },
        {
            "question": "What is Android?",
            "options": ["iOS version", "Mobile operating system", "App store", "Programming language"],
            "correctAnswer": "Mobile operating system"
        },
        {
            "question": "What is iOS?",
            "options": ["Android version", "Web browser", "Programming tool", "Apple mobile OS"],
            "correctAnswer": "Apple mobile OS"
        },
        {
            "question": "What is a mobile emulator?",
            "options": ["Real device", "Software simulating mobile device", "App store", "Development tool"],
            "correctAnswer": "Software simulating mobile device"
        },
        {
            "question": "What is app deployment?",
            "options": ["Writing code", "Publishing app to stores", "Testing app", "Designing UI"],
            "correctAnswer": "Publishing app to stores"
        },
        {
            "question": "What is responsive design?",
            "options": ["Fixed size layouts", "Adapting to different screens", "Mobile only", "Web only"],
            "correctAnswer": "Adapting to different screens"
        }
    ],

    "Game Development": [
        {
            "question": "What is a game loop?",
            "options": ["Main update cycle", "Player character", "Game menu", "Game ending",],
            "correctAnswer": "Main update cycle"
        },
        {
            "question": "What is collision detection?",
            "options": ["Player movement", "Detecting object intersections", "Sound effects", "Graphics rendering"],
            "correctAnswer": "Detecting object intersections"
        },
        {
            "question": "What is a game engine?",
            "options": ["Game character", "Game console", "Software framework for games", "Player controller"],
            "correctAnswer": "Software framework for games"
        },
        {
            "question": "What is player input?",
            "options": ["Game graphics", "User controls and actions", "Sound design", "Level design"],
            "correctAnswer": "User controls and actions"
        },
        {
            "question": "What is physics in games?",
            "options": ["Game rules", "Simulating real-world physics", "Player health", "Game scoring"],
            "correctAnswer": "Simulating real-world physics"
        },
        {
            "question": "What is FPS in games?",
            "options": ["First Person Shooter", "Player Speed", "Game Points", "Frames Per Second"],
            "correctAnswer": "Frames Per Second"
        },
        {
            "question": "What is level design?",
            "options": ["Character creation", "Creating game environments", "Sound mixing", "Code writing"],
            "correctAnswer": "Creating game environments"
        },
        {
            "question": "What is AI in games?",
            "options": ["Non-player character behavior", "Artificial Intelligence", "Game graphics", "Player controls"],
            "correctAnswer": "Non-player character behavior"
        },
        {
            "question": "What is animation?",
            "options": ["Game music", "Creating movement sequences", "Level design", "Player input"],
            "correctAnswer": "Creating movement sequences"
        },
        {
            "question": "What is game testing?",
            "options": ["Writing code", "Finding and fixing bugs", "Creating graphics", "Writing story"],
            "correctAnswer": "Finding and fixing bugs"
        }
    ]
};
const predefinedQuestions = Object.fromEntries(
    Object.entries(RAW_QUESTIONS).map(([k, v]) => [
        normalizeKey(k),
        v
    ])
)
/**
 * Skill guides mapping for better AI prompt generation
 */
const skillGuides = {
    "Python Programming": `
Focus on:
- Variables & data types
- Lists, tuples, sets, dictionaries
- Loops & conditionals
- Functions & scope
- OOP basics
- Exceptions
- List comprehensions
`,
    "React Development": `
Focus on:
- JSX
- Components & props
- useState, useEffect
- Event handling
- Conditional rendering
- Lists & keys
- Basic hooks
`,
    "Machine Learning": `
Focus on:
- Supervised vs unsupervised learning
- Regression & classification
- Overfitting & underfitting
- Train-test split
- Evaluation metrics
- Feature scaling
`,
    "UI/UX Design": `
Focus on:
- UX vs UI
- Design thinking
- Wireframes vs prototypes
- Accessibility
- User research
- Heuristics
`,
    "Data Analysis": `
Focus on:
- Data cleaning
- Exploratory analysis
- Statistical measures
- Data visualization
- Missing values
- Outliers
`,
    "Public Speaking": `
Focus on:
- Voice modulation
- Body language
- Audience engagement
- Stage fright management
- Speech structure
- Storytelling
`,
    "Spanish": `
Focus on:
- Basic greetings
- Common verbs
- Articles and gender
- Numbers and time
- Family vocabulary
- Food and drinks
`,
    "German": `
Focus on:
- Basic greetings
- Articles and cases
- Common verbs
- Numbers and time
- Family vocabulary
- Food and drinks
`,
    "French": `
Focus on:
- Basic greetings
- Articles and gender
- Common verbs
- Numbers and time
- Family vocabulary
- Food and drinks
`,
    "Photography": `
Focus on:
- Exposure triangle
- Composition rules
- Lighting basics
- Camera settings
- Post-processing
`,
    "Video Editing": `
Focus on:
- Timeline editing
- Transitions
- Color grading
- Audio mixing
- Export settings
`,
    "Graphic Design": `
Focus on:
- Typography
- Color theory
- Layout principles
- Design software
- Branding basics
`,
    "Mobile Development": `
Focus on:
- App lifecycle
- UI/UX for mobile
- Platform differences
- APIs and data
- Testing and deployment
`,
    "Game Development": `
Focus on:
- Game loops
- Physics basics
- Game engines
- Player input
- Level design
`
};

/**
 * Get skill guide for a given skill
 * @param {string} skillName - The name of the skill
 * @returns {object} Skill guide object with topics and difficulty
 */
function getSkillGuide(skillName) {
    return skillGuides[skillName] || `${skillName} fundamentals and core concepts`;
}
/**
 * Generate questions for a skill using AI
 * @param {string} skillName - The name of the skill
 * @param {number} count - Number of questions to generate (default: 10)
 * @returns {Promise<Array>} Array of question objects
 */
export async function generateQuestionsForSkill(skillName, count = 10) {
    // First check if we have predefined questions for this skill
    if (predefinedQuestions[skillName]) {
        console.log(`Using predefined questions for ${skillName}`);
        return normalizeQuestions(predefinedQuestions[skillName].slice(0, count));
    }

    if (openai) {
        // Use OpenAI to generate real questions
        try {
            const skillGuide = getSkillGuide(skillName);
            const prompt = `
You are a strict professional examiner.

Generate exactly 10 REAL multiple - choice questions to assess whether a person is qualified to TEACH the skill: ${skillName}.

ABSOLUTE RULES(FAIL IF BROKEN):
- Questions MUST be specific and factual
    - Questions MUST directly test real knowledge of ${skillName}
- DO NOT use abstract wording like "key concept"
    - DO NOT use placeholders like "first option", "second option"
        - DO NOT use the words: sample, mock, example
            - Every question must have ONE clearly correct answer
                - Questions must feel like real assessment or interview questions

Use ONLY the following topic boundaries:
${skillGuide}

Question format rules:
- Exactly 4 options (actual descriptive text, not letters)
    - Only ONE correct answer
        - Beginner to intermediate difficulty
            - No explanations
                - No filler text

Return ONLY valid JSON.
NO markdown.
NO extra text.

JSON format:
[
    {
        "question": "string",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "A"
    }
]`;

            const genericPatterns = [
                "key concept",
                "first option",
                "second option",
                "third option",
                "fourth option",
                "basic concept",
                "intermediate topic",
                "advanced feature"
            ];

            function isGeneric(q) {
                const text = (q.question + " " + q.options.join(" ")).toLowerCase();
                return genericPatterns.some(p => text.includes(p));
            }

            let questions;
            let attempts = 0;

            while (attempts < 3) {
                attempts++;

                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.2
                });

                questions = JSON.parse(response.choices[0].message.content);

                if (!questions.some(isGeneric)) break;
            }

            if (questions.some(isGeneric)) {
                throw new Error("AI generated generic questions after 3 attempts");
            }

            return normalizeQuestions(questions);
        } catch (error) {
            console.error('Error generating questions with OpenAI:', error);
            // Fall back to mock questions
            return normalizeQuestions(generateMockQuestions(skillName, count));
        }
    } else {
        // OpenAI not configured, use mock questions
        console.log(`OpenAI not configured, returning mock questions for ${skillName}`);
        return normalizeQuestions(generateMockQuestions(skillName, count));
    }
}

/**
 * Generate mock questions for development/testing when OpenAI is not configured
 * @param {string} skillName - The name of the skill
 * @param {number} count - Number of questions to generate
 * @returns {Array} Array of mock question objects
 */
function generateMockQuestions(skillName, count = 10) {
    const skillGuide = getSkillGuide(skillName);
    const mockQuestions = [];
    const letters = ['A', 'B', 'C', 'D'];

    // Predefined mock questions for different skills
    const mockData = {
        "Python Programming": [
            {
                question: "What is the correct way to define a function in Python?",
                options: ["def myFunction():", "function myFunction():", "func myFunction():", "define myFunction():"],
                correctAnswer: "A"
            },
            {
                question: "Which data type is mutable in Python?",
                options: ["tuple", "string", "list", "int"],
                correctAnswer: "C"
            }
        ],
        "React Development": [
            {
                question: "What hook is used to manage state in functional components?",
                options: ["useEffect", "useState", "useContext", "useReducer"],
                correctAnswer: "B"
            },
            {
                question: "What does JSX stand for?",
                options: ["JavaScript XML", "JavaScript Extension", "JSON XML", "Java Syntax Extension"],
                correctAnswer: "A"
            }
        ]
    };

    const skillMocks = mockData[skillName] || [];

    for (let i = 0; i < count; i++) {
        if (i < skillMocks.length) {
            mockQuestions.push(skillMocks[i]);
        }
        else {
            throw new Error(`No mock questions for skill: ${skillName}`);
        }

    }
    return mockQuestions.slice(0, count);
}

/**
 * Check if OpenAI API key is configured
 * @returns {boolean} True if API key is available
 */
export function isAIConfigured() {
    return !!process.env.OPENAI_API_KEY;
}