export const APP_CONSTANTS = {
  APP_NAME: "FlipWise",
  SCORE_LEVELS: {
    HARD: 1,
    MEDIUM: 2,
    EASY: 3,
  },
  SCORE_LABELS: {
    1: "Hard",
    2: "Medium",
    3: "Easy",
  },
  SCORE_COLORS: {
    1: "error",
    2: "warning",
    3: "success",
  },
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MIN_INPUT_LENGTH: 1,
  },
  DEMO_USER: {
    EMAIL: "user@example.com",
    PASSWORD: "user1234",
  },
};

export const formatCardCount = (count) => {
  if (count === 0) return "No cards";
  if (count === 1) return "1 card";
  return `${count} cards`;
};

export const getScoreColor = (score) => {
  return APP_CONSTANTS.SCORE_COLORS[score] || "default";
};

export const getScoreLabel = (score) => {
  return APP_CONSTANTS.SCORE_LABELS[score] || "Unknown";
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  EMAIL_REGISTER: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
};

export const createValidationRules = (type = "login") => {
  return {
    email: {
      required: "Email address is required",
      pattern: {
        value: type === "register" ? VALIDATION_PATTERNS.EMAIL_REGISTER : VALIDATION_PATTERNS.EMAIL,
        message: "Please enter a valid email address",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: APP_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH,
        message: `Password must be at least ${APP_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH} characters long`,
      },
    },
    confirmPassword: {
      required: "Please confirm your password",
    },
    front: {
      required: "Question is required",
      minLength: {
        value: 1,
        message: "Question cannot be empty",
      },
      maxLength: {
        value: 100,
        message: "Question must be 100 characters or less",
      },
    },
    back: {
      required: "Answer is required",
      minLength: {
        value: 1,
        message: "Answer cannot be empty",
      },
      maxLength: {
        value: 500,
        message: "Answer must be 500 characters or less",
      },
    },
    name: {
      required: "Folder name is required",
      minLength: {
        value: APP_CONSTANTS.VALIDATION.MIN_INPUT_LENGTH,
        message: "Folder name cannot be empty",
      },
    },
  };
};

export const createCardValidationRules = (existingCards = []) => {
  return {
    front: {
      required: "Question is required",
      minLength: {
        value: 1,
        message: "Question cannot be empty",
      },
      maxLength: {
        value: 100,
        message: "Question must be 100 characters or less",
      },
      validate: {
        notEmpty: (value) => {
          const trimmed = value?.trim();
          return (trimmed && trimmed.length > 0) || "Question cannot be empty";
        },
        uniqueFront: (value, formValues) => {
          const trimmed = value?.trim().toLowerCase();
          if (!trimmed) return true;

          const duplicate = existingCards.find((card) => card.front?.toLowerCase().trim() === trimmed);

          return !duplicate || `A card with this question already exists in this folder`;
        },
      },
    },
    back: {
      required: "Answer is required",
      minLength: {
        value: 1,
        message: "Answer cannot be empty",
      },
      maxLength: {
        value: 500,
        message: "Answer must be 500 characters or less",
      },
      validate: {
        notEmpty: (value) => {
          const trimmed = value?.trim();
          return (trimmed && trimmed.length > 0) || "Answer cannot be empty";
        },
        uniquePair: (value, formValues) => {
          const frontTrimmed = formValues.front?.trim().toLowerCase();
          const backTrimmed = value?.trim().toLowerCase();

          if (!frontTrimmed || !backTrimmed) return true;

          const duplicate = existingCards.find((card) => card.front?.toLowerCase().trim() === frontTrimmed && card.back?.toLowerCase().trim() === backTrimmed);

          return !duplicate || `This exact card (question and answer) already exists in this folder`;
        },
      },
    },
  };
};

export * from "./styles";
