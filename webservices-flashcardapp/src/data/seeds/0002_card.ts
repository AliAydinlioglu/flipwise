import card from "../../repository/card";
import { folder_ids } from "./0001_folder";

let card_ids: number[] = [];

const seed = async () => {
  // add the entries
  card_ids = (await card.createItems([
    // Math Basics (folder 0)
    { front: "1 + 1", back: "2", folder_id: folder_ids[0] },
    { front: "2 × 3", back: "6", folder_id: folder_ids[0] },
    { front: "12 ÷ 4", back: "3", folder_id: folder_ids[0] },
    { front: "5²", back: "25", folder_id: folder_ids[0] },
    { front: "√16", back: "4", folder_id: folder_ids[0] },
    { front: "What is π (pi) approximately?", back: "3.14159", folder_id: folder_ids[0] },

    // Spanish Vocabulary (folder 1)
    { front: "Hello", back: "Hola", folder_id: folder_ids[1] },
    { front: "Goodbye", back: "Adiós", folder_id: folder_ids[1] },
    { front: "Thank you", back: "Gracias", folder_id: folder_ids[1] },
    { front: "Dog", back: "Perro", folder_id: folder_ids[1] },
    { front: "Cat", back: "Gato", folder_id: folder_ids[1] },
    { front: "House", back: "Casa", folder_id: folder_ids[1] },
    { front: "Car", back: "Coche", folder_id: folder_ids[1] },

    // Russian Language (folder 2)
    { front: "Hello", back: "Привет", folder_id: folder_ids[2] },
    { front: "Thank you", back: "Спасибо", folder_id: folder_ids[2] },
    { front: "Yes", back: "Да", folder_id: folder_ids[2] },
    { front: "No", back: "Нет", folder_id: folder_ids[2] },
    { front: "Water", back: "Вода", folder_id: folder_ids[2] },

    // Programming Concepts (folder 3)
    { front: "What does HTML stand for?", back: "HyperText Markup Language", folder_id: folder_ids[3] },
    { front: "What is CSS used for?", back: "Styling web pages", folder_id: folder_ids[3] },
    { front: "What does API stand for?", back: "Application Programming Interface", folder_id: folder_ids[3] },
    { front: "What is a variable in programming?", back: "A container for storing data values", folder_id: folder_ids[3] },

    // French Essentials (folder 4)
    { front: "Good morning", back: "Bonjour", folder_id: folder_ids[4] },
    { front: "Good evening", back: "Bonsoir", folder_id: folder_ids[4] },
    { front: "Please", back: "S'il vous plaît", folder_id: folder_ids[4] },
    { front: "Excuse me", back: "Excusez-moi", folder_id: folder_ids[4] },
    { front: "The sun", back: "Le soleil", folder_id: folder_ids[4] },
    { front: "The moon", back: "La lune", folder_id: folder_ids[4] },

    // Biology Study Guide (folder 5)
    { front: "What is photosynthesis?", back: "Process by which plants convert sunlight into energy", folder_id: folder_ids[5] },
    { front: "What is DNA?", back: "Deoxyribonucleic acid - genetic material", folder_id: folder_ids[5] },
    { front: "What is mitosis?", back: "Cell division resulting in two identical cells", folder_id: folder_ids[5] },
    { front: "What are chromosomes?", back: "Thread-like structures containing DNA", folder_id: folder_ids[5] },

    // Chemistry Formulas (folder 6)
    { front: "Water formula", back: "H₂O", folder_id: folder_ids[6] },
    { front: "Carbon dioxide formula", back: "CO₂", folder_id: folder_ids[6] },
    { front: "Sodium chloride formula", back: "NaCl", folder_id: folder_ids[6] },
    { front: "Methane formula", back: "CH₄", folder_id: folder_ids[6] },

    // Physics Constants (folder 7)
    { front: "Speed of light in vacuum", back: "299,792,458 m/s", folder_id: folder_ids[7] },
    { front: "Gravitational acceleration on Earth", back: "9.81 m/s²", folder_id: folder_ids[7] },
    { front: "Planck's constant", back: "6.626 × 10⁻³⁴ J⋅s", folder_id: folder_ids[7] },
    { front: "Electron charge", back: "1.602 × 10⁻¹⁹ C", folder_id: folder_ids[7] },

    // World History (folder 8)
    { front: "When did World War II end?", back: "1945", folder_id: folder_ids[8] },
    { front: "Who painted the Mona Lisa?", back: "Leonardo da Vinci", folder_id: folder_ids[8] },
    { front: "When was the Berlin Wall torn down?", back: "1989", folder_id: folder_ids[8] },
    { front: "Who was the first person on the moon?", back: "Neil Armstrong", folder_id: folder_ids[8] },

    // JavaScript Fundamentals (folder 9)
    { front: "How do you declare a variable in JavaScript?", back: "let variableName = value", folder_id: folder_ids[9] },
    { front: "What is a function in JavaScript?", back: "A block of code that performs a task", folder_id: folder_ids[9] },
    { front: "What does JSON stand for?", back: "JavaScript Object Notation", folder_id: folder_ids[9] },
    { front: "How do you create an array in JavaScript?", back: "let arr = [] or new Array()", folder_id: folder_ids[9] },

    // React Hooks (folder 10)
    { front: "What is useState used for?", back: "Managing state in functional components", folder_id: folder_ids[10] },
    { front: "What is useEffect used for?", back: "Handling side effects in components", folder_id: folder_ids[10] },
    { front: "What is useContext used for?", back: "Accessing context values in components", folder_id: folder_ids[10] },

    // Node.js Concepts (folder 11)
    { front: "What is Node.js?", back: "JavaScript runtime built on Chrome's V8 engine", folder_id: folder_ids[11] },
    { front: "What is npm?", back: "Node Package Manager", folder_id: folder_ids[11] },
    { front: "What is Express.js?", back: "Web application framework for Node.js", folder_id: folder_ids[11] },

    // German Vocabulary (folder 12)
    { front: "Hello", back: "Hallo", folder_id: folder_ids[12] },
    { front: "Thank you", back: "Danke", folder_id: folder_ids[12] },
    { front: "Good morning", back: "Guten Morgen", folder_id: folder_ids[12] },
    { front: "How are you?", back: "Wie geht es dir?", folder_id: folder_ids[12] },

    // Italian Phrases (folder 13)
    { front: "Hello", back: "Ciao", folder_id: folder_ids[13] },
    { front: "Thank you", back: "Grazie", folder_id: folder_ids[13] },
    { front: "Good morning", back: "Buongiorno", folder_id: folder_ids[13] },
    { front: "How much?", back: "Quanto costa?", folder_id: folder_ids[13] },

    // Portuguese Basics (folder 14)
    { front: "Hello", back: "Olá", folder_id: folder_ids[14] },
    { front: "Thank you", back: "Obrigado", folder_id: folder_ids[14] },
    { front: "Good morning", back: "Bom dia", folder_id: folder_ids[14] },

    // Data Structures (folder 15)
    { front: "What is an array?", back: "A collection of elements stored in contiguous memory", folder_id: folder_ids[15] },
    { front: "What is a linked list?", back: "A linear data structure with nodes containing data and pointers", folder_id: folder_ids[15] },
    { front: "What is a stack?", back: "LIFO (Last In First Out) data structure", folder_id: folder_ids[15] },
    { front: "What is a queue?", back: "FIFO (First In First Out) data structure", folder_id: folder_ids[15] },

    // Algorithms (folder 16)
    { front: "What is Big O notation?", back: "Mathematical notation for algorithm complexity", folder_id: folder_ids[16] },
    { front: "What is binary search?", back: "Efficient search algorithm for sorted arrays", folder_id: folder_ids[16] },
    { front: "What is bubble sort?", back: "Simple sorting algorithm that repeatedly steps through list", folder_id: folder_ids[16] },

    // Database Concepts (folder 17)
    { front: "What is SQL?", back: "Structured Query Language", folder_id: folder_ids[17] },
    { front: "What is a primary key?", back: "Unique identifier for database records", folder_id: folder_ids[17] },
    { front: "What is normalization?", back: "Process of organizing data to reduce redundancy", folder_id: folder_ids[17] },

    // Human Anatomy (folder 18)
    { front: "How many bones are in the human body?", back: "206", folder_id: folder_ids[18] },
    { front: "What is the largest organ?", back: "Skin", folder_id: folder_ids[18] },
    { front: "How many chambers does the heart have?", back: "4", folder_id: folder_ids[18] },

    // Medical Terminology (folder 19)
    { front: "What does 'cardio' refer to?", back: "Heart", folder_id: folder_ids[19] },
    { front: "What does 'hepat' refer to?", back: "Liver", folder_id: folder_ids[19] },
    { front: "What does 'neuro' refer to?", back: "Nervous system", folder_id: folder_ids[19] },

    // Pharmacology (folder 20)
    { front: "What is aspirin used for?", back: "Pain relief and anti-inflammatory", folder_id: folder_ids[20] },
    { front: "What is insulin used for?", back: "Regulating blood sugar in diabetes", folder_id: folder_ids[20] },

    // Continue with more folders...
    // Thermodynamics (folder 21)
    { front: "First law of thermodynamics", back: "Energy cannot be created or destroyed", folder_id: folder_ids[21] },
    { front: "What is entropy?", back: "Measure of disorder in a system", folder_id: folder_ids[21] },

    // Electromagnetic Theory (folder 22)
    { front: "What is Coulomb's law?", back: "Force between charges is proportional to product of charges", folder_id: folder_ids[22] },
    { front: "What is Faraday's law?", back: "Changing magnetic field induces electric field", folder_id: folder_ids[22] },

    // Quantum Mechanics (folder 23)
    { front: "What is Schrödinger's equation?", back: "Fundamental equation of quantum mechanics", folder_id: folder_ids[23] },
    { front: "What is wave-particle duality?", back: "Matter exhibits both wave and particle properties", folder_id: folder_ids[23] },

    // Organic Chemistry (folder 24)
    { front: "What is a benzene ring?", back: "Aromatic hydrocarbon with formula C₆H₆", folder_id: folder_ids[24] },
    { front: "What is isomerism?", back: "Compounds with same formula but different structure", folder_id: folder_ids[24] },

    // Periodic Table (folder 25)
    { front: "Symbol for Gold", back: "Au", folder_id: folder_ids[25] },
    { front: "Symbol for Silver", back: "Ag", folder_id: folder_ids[25] },
    { front: "Symbol for Iron", back: "Fe", folder_id: folder_ids[25] },
    { front: "Atomic number of Carbon", back: "6", folder_id: folder_ids[25] },

    // Chemical Reactions (folder 26)
    { front: "What is combustion?", back: "Reaction with oxygen producing heat and light", folder_id: folder_ids[26] },
    { front: "What is oxidation?", back: "Loss of electrons", folder_id: folder_ids[26] },

    // Ancient Civilizations (folder 27)
    { front: "Capital of Ancient Egypt", back: "Memphis (Old Kingdom), Thebes (New Kingdom)", folder_id: folder_ids[27] },
    { front: "Who built Machu Picchu?", back: "Inca civilization", folder_id: folder_ids[27] },

    // European Capitals (folder 28)
    { front: "Capital of France", back: "Paris", folder_id: folder_ids[28] },
    { front: "Capital of Germany", back: "Berlin", folder_id: folder_ids[28] },
    { front: "Capital of Italy", back: "Rome", folder_id: folder_ids[28] },
    { front: "Capital of Spain", back: "Madrid", folder_id: folder_ids[28] },

    // American History (folder 29)
    { front: "When was the Declaration of Independence signed?", back: "July 4, 1776", folder_id: folder_ids[29] },
    { front: "Who was the first U.S. President?", back: "George Washington", folder_id: folder_ids[29] },

    // Shakespeare Quotes (folder 30)
    { front: "To be or not to be, that is the...", back: "question", folder_id: folder_ids[30] },
    { front: "All the world's a...", back: "stage", folder_id: folder_ids[30] },

    // Poetry Analysis (folder 32)
    { front: "What is a sonnet?", back: "14-line poem with specific rhyme scheme", folder_id: folder_ids[32] },
    { front: "What is alliteration?", back: "Repetition of initial consonant sounds", folder_id: folder_ids[32] },

    // Business Terms (folder 33)
    { front: "What is ROI?", back: "Return on Investment", folder_id: folder_ids[33] },
    { front: "What is B2B?", back: "Business to Business", folder_id: folder_ids[33] },

    // Economic Principles (folder 34)
    { front: "What is supply and demand?", back: "Economic model of price determination", folder_id: folder_ids[34] },
    { front: "What is inflation?", back: "General increase in prices over time", folder_id: folder_ids[34] },
  ])) as number[];
};

export { seed, card_ids }; // We cannot use export default here because of the way knex handles migrations.
