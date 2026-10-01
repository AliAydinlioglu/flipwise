import folder from "../../repository/folder";
import jwtUse from "../../core/jwtUse";
import { jwts } from "./0000_user";

let folder_ids: number[] = [];

const seed = async () => {
  // add the entries
  folder_ids = (await folder.createItems([
    // User 0 (John Doe) - Private folders
    { name: "Math Basics", public_boolean: 0, user_id: jwtUse.getUserID(jwts[0]) },
    { name: "Spanish Vocabulary", public_boolean: 0, user_id: jwtUse.getUserID(jwts[0]) },
    { name: "Russian Language", public_boolean: 0, user_id: jwtUse.getUserID(jwts[0]) },
    { name: "Programming Concepts", public_boolean: 0, user_id: jwtUse.getUserID(jwts[0]) },

    // User 1 (Rosalind Myers) - Mix of public and private
    { name: "French Essentials", public_boolean: 1, user_id: jwtUse.getUserID(jwts[1]) },
    { name: "Biology Study Guide", public_boolean: 1, user_id: jwtUse.getUserID(jwts[1]) },
    { name: "Chemistry Formulas", public_boolean: 0, user_id: jwtUse.getUserID(jwts[1]) },

    // User 2 (So Mi) - Public folders
    { name: "Physics Constants", public_boolean: 1, user_id: jwtUse.getUserID(jwts[2]) },
    { name: "World History", public_boolean: 1, user_id: jwtUse.getUserID(jwts[2]) },

    // User 3 (John Smith) - Programming focus
    { name: "JavaScript Fundamentals", public_boolean: 1, user_id: jwtUse.getUserID(jwts[3]) },
    { name: "React Hooks", public_boolean: 1, user_id: jwtUse.getUserID(jwts[3]) },
    { name: "Node.js Concepts", public_boolean: 0, user_id: jwtUse.getUserID(jwts[3]) },

    // User 4 (Maria Garcia) - Languages
    { name: "German Vocabulary", public_boolean: 1, user_id: jwtUse.getUserID(jwts[4]) },
    { name: "Italian Phrases", public_boolean: 1, user_id: jwtUse.getUserID(jwts[4]) },
    { name: "Portuguese Basics", public_boolean: 0, user_id: jwtUse.getUserID(jwts[4]) },

    // User 5 (David Chen) - Computer Science
    { name: "Data Structures", public_boolean: 1, user_id: jwtUse.getUserID(jwts[5]) },
    { name: "Algorithms", public_boolean: 1, user_id: jwtUse.getUserID(jwts[5]) },
    { name: "Database Concepts", public_boolean: 0, user_id: jwtUse.getUserID(jwts[5]) },

    // User 6 (Sarah Johnson) - Medical/Biology
    { name: "Human Anatomy", public_boolean: 1, user_id: jwtUse.getUserID(jwts[6]) },
    { name: "Medical Terminology", public_boolean: 1, user_id: jwtUse.getUserID(jwts[6]) },
    { name: "Pharmacology", public_boolean: 0, user_id: jwtUse.getUserID(jwts[6]) },

    // User 7 (Mike Brown) - Physics & Engineering
    { name: "Thermodynamics", public_boolean: 1, user_id: jwtUse.getUserID(jwts[7]) },
    { name: "Electromagnetic Theory", public_boolean: 1, user_id: jwtUse.getUserID(jwts[7]) },
    { name: "Quantum Mechanics", public_boolean: 0, user_id: jwtUse.getUserID(jwts[7]) },

    // User 8 (Emily Davis) - Chemistry
    { name: "Organic Chemistry", public_boolean: 1, user_id: jwtUse.getUserID(jwts[8]) },
    { name: "Periodic Table", public_boolean: 1, user_id: jwtUse.getUserID(jwts[8]) },
    { name: "Chemical Reactions", public_boolean: 0, user_id: jwtUse.getUserID(jwts[8]) },

    // User 9 (Alex Wilson) - History & Geography
    { name: "Ancient Civilizations", public_boolean: 1, user_id: jwtUse.getUserID(jwts[9]) },
    { name: "European Capitals", public_boolean: 1, user_id: jwtUse.getUserID(jwts[9]) },
    { name: "American History", public_boolean: 0, user_id: jwtUse.getUserID(jwts[9]) },

    // User 10 (Lina Anderson) - Literature & Arts
    { name: "Shakespeare Quotes", public_boolean: 1, user_id: jwtUse.getUserID(jwts[10]) },
    { name: "Art History", public_boolean: 1, user_id: jwtUse.getUserID(jwts[10]) },
    { name: "Poetry Analysis", public_boolean: 0, user_id: jwtUse.getUserID(jwts[10]) },

    // User 11 (Carlos Martinez) - Business & Economics
    { name: "Business Terms", public_boolean: 1, user_id: jwtUse.getUserID(jwts[11]) },
    { name: "Economic Principles", public_boolean: 1, user_id: jwtUse.getUserID(jwts[11]) },
    { name: "Marketing Strategies", public_boolean: 0, user_id: jwtUse.getUserID(jwts[11]) },
  ])) as number[]; // Add type assertion here
};

export { seed, folder_ids }; // We cannot use export default here because of the way knex handles migrations.
