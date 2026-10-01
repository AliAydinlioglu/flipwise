import jwtUse from "../../core/jwtUse";
import scoreaboard from "../../repository/score";
import { jwts } from "./0000_user";
import { card_ids } from "./0002_card";

const seed = async () => {
  // add the entries - Creating realistic study patterns for users
  await scoreaboard.createItems([
    // User 0 (John Doe) - Active studier with varied performance
    { score: 1, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[0] }, // Math
    { score: 2, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[1] },
    { score: 3, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[2] },
    { score: 2, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[3] },
    { score: 1, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[4] },
    { score: 3, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[5] },

    { score: 2, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[6] }, // Spanish
    { score: 3, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[7] },
    { score: 2, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[8] },
    { score: 1, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[9] },

    { score: 1, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[13] }, // Russian
    { score: 1, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[14] },
    { score: 2, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[15] },

    // User 1 (Rosalind Myers) - Excels in languages and biology
    { score: 3, user_id: jwtUse.getUserID(jwts[1]), card_id: card_ids[20] }, // French
    { score: 3, user_id: jwtUse.getUserID(jwts[1]), card_id: card_ids[21] },
    { score: 3, user_id: jwtUse.getUserID(jwts[1]), card_id: card_ids[22] },
    { score: 2, user_id: jwtUse.getUserID(jwts[1]), card_id: card_ids[23] },

    { score: 3, user_id: jwtUse.getUserID(jwts[1]), card_id: card_ids[25] }, // Biology
    { score: 3, user_id: jwtUse.getUserID(jwts[1]), card_id: card_ids[26] },
    { score: 2, user_id: jwtUse.getUserID(jwts[1]), card_id: card_ids[27] },
    { score: 3, user_id: jwtUse.getUserID(jwts[1]), card_id: card_ids[28] },

    // User 2 (So Mi) - Physics expert
    { score: 3, user_id: jwtUse.getUserID(jwts[2]), card_id: card_ids[33] }, // Physics
    { score: 3, user_id: jwtUse.getUserID(jwts[2]), card_id: card_ids[34] },
    { score: 3, user_id: jwtUse.getUserID(jwts[2]), card_id: card_ids[35] },
    { score: 2, user_id: jwtUse.getUserID(jwts[2]), card_id: card_ids[36] },

    { score: 2, user_id: jwtUse.getUserID(jwts[2]), card_id: card_ids[37] }, // History
    { score: 3, user_id: jwtUse.getUserID(jwts[2]), card_id: card_ids[38] },
    { score: 2, user_id: jwtUse.getUserID(jwts[2]), card_id: card_ids[39] },

    // User 3 (John Smith) - Programming focus
    { score: 3, user_id: jwtUse.getUserID(jwts[3]), card_id: card_ids[41] }, // JavaScript
    { score: 3, user_id: jwtUse.getUserID(jwts[3]), card_id: card_ids[42] },
    { score: 2, user_id: jwtUse.getUserID(jwts[3]), card_id: card_ids[43] },
    { score: 3, user_id: jwtUse.getUserID(jwts[3]), card_id: card_ids[44] },

    { score: 2, user_id: jwtUse.getUserID(jwts[3]), card_id: card_ids[45] }, // React
    { score: 3, user_id: jwtUse.getUserID(jwts[3]), card_id: card_ids[46] },
    { score: 2, user_id: jwtUse.getUserID(jwts[3]), card_id: card_ids[47] },

    // User 4 (Maria Garcia) - Language learner
    { score: 2, user_id: jwtUse.getUserID(jwts[4]), card_id: card_ids[51] }, // German
    { score: 3, user_id: jwtUse.getUserID(jwts[4]), card_id: card_ids[52] },
    { score: 2, user_id: jwtUse.getUserID(jwts[4]), card_id: card_ids[53] },

    { score: 3, user_id: jwtUse.getUserID(jwts[4]), card_id: card_ids[55] }, // Italian
    { score: 3, user_id: jwtUse.getUserID(jwts[4]), card_id: card_ids[56] },
    { score: 2, user_id: jwtUse.getUserID(jwts[4]), card_id: card_ids[57] },

    // User 5 (David Chen) - Computer Science student
    { score: 3, user_id: jwtUse.getUserID(jwts[5]), card_id: card_ids[62] }, // Data Structures
    { score: 3, user_id: jwtUse.getUserID(jwts[5]), card_id: card_ids[63] },
    { score: 2, user_id: jwtUse.getUserID(jwts[5]), card_id: card_ids[64] },
    { score: 3, user_id: jwtUse.getUserID(jwts[5]), card_id: card_ids[65] },

    { score: 3, user_id: jwtUse.getUserID(jwts[5]), card_id: card_ids[66] }, // Algorithms
    { score: 2, user_id: jwtUse.getUserID(jwts[5]), card_id: card_ids[67] },
    { score: 3, user_id: jwtUse.getUserID(jwts[5]), card_id: card_ids[68] },

    // User 6 (Sarah Johnson) - Medical student
    { score: 3, user_id: jwtUse.getUserID(jwts[6]), card_id: card_ids[72] }, // Anatomy
    { score: 3, user_id: jwtUse.getUserID(jwts[6]), card_id: card_ids[73] },
    { score: 2, user_id: jwtUse.getUserID(jwts[6]), card_id: card_ids[74] },

    { score: 3, user_id: jwtUse.getUserID(jwts[6]), card_id: card_ids[75] }, // Medical Terms
    { score: 3, user_id: jwtUse.getUserID(jwts[6]), card_id: card_ids[76] },
    { score: 2, user_id: jwtUse.getUserID(jwts[6]), card_id: card_ids[77] },

    // User 7 (Mike Brown) - Physics & Engineering
    { score: 3, user_id: jwtUse.getUserID(jwts[7]), card_id: card_ids[80] }, // Thermodynamics
    { score: 2, user_id: jwtUse.getUserID(jwts[7]), card_id: card_ids[81] },

    { score: 3, user_id: jwtUse.getUserID(jwts[7]), card_id: card_ids[82] }, // Electromagnetic
    { score: 2, user_id: jwtUse.getUserID(jwts[7]), card_id: card_ids[83] },

    // User 8 (Emily Davis) - Chemistry
    { score: 3, user_id: jwtUse.getUserID(jwts[8]), card_id: card_ids[86] }, // Organic Chemistry
    { score: 3, user_id: jwtUse.getUserID(jwts[8]), card_id: card_ids[87] },

    { score: 3, user_id: jwtUse.getUserID(jwts[8]), card_id: card_ids[88] }, // Periodic Table
    { score: 3, user_id: jwtUse.getUserID(jwts[8]), card_id: card_ids[89] },
    { score: 3, user_id: jwtUse.getUserID(jwts[8]), card_id: card_ids[90] },
    { score: 2, user_id: jwtUse.getUserID(jwts[8]), card_id: card_ids[91] },

    // User 9 (Alex Wilson) - History enthusiast
    { score: 3, user_id: jwtUse.getUserID(jwts[9]), card_id: card_ids[95] }, // Ancient Civilizations
    { score: 2, user_id: jwtUse.getUserID(jwts[9]), card_id: card_ids[96] },

    { score: 3, user_id: jwtUse.getUserID(jwts[9]), card_id: card_ids[97] }, // European Capitals
    { score: 3, user_id: jwtUse.getUserID(jwts[9]), card_id: card_ids[98] },
    { score: 3, user_id: jwtUse.getUserID(jwts[9]), card_id: card_ids[99] },
    { score: 2, user_id: jwtUse.getUserID(jwts[9]), card_id: card_ids[100] },

    // User 10 (Lina Anderson) - Literature lover
    { score: 3, user_id: jwtUse.getUserID(jwts[10]), card_id: card_ids[104] }, // Shakespeare
    { score: 3, user_id: jwtUse.getUserID(jwts[10]), card_id: card_ids[105] },

    // User 11 (Carlos Martinez) - Business student
    { score: 3, user_id: jwtUse.getUserID(jwts[11]), card_id: card_ids[111] }, // Business Terms

    // User 0 studying physics (User 2's folder)
    { score: 1, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[33] },
    { score: 2, user_id: jwtUse.getUserID(jwts[0]), card_id: card_ids[34] },

    // User 3 studying French (User 1's folder)
    { score: 2, user_id: jwtUse.getUserID(jwts[3]), card_id: card_ids[20] },
    { score: 2, user_id: jwtUse.getUserID(jwts[3]), card_id: card_ids[21] },

    // User 4 studying Biology (User 1's folder)
    { score: 2, user_id: jwtUse.getUserID(jwts[4]), card_id: card_ids[25] },
    { score: 1, user_id: jwtUse.getUserID(jwts[4]), card_id: card_ids[26] },

    // User 5 studying JavaScript (User 3's folder)
    { score: 3, user_id: jwtUse.getUserID(jwts[5]), card_id: card_ids[41] },
    { score: 3, user_id: jwtUse.getUserID(jwts[5]), card_id: card_ids[42] },
  ]);
};

export { seed }; // We cannot use export default here because of the way knex handles migrations.
