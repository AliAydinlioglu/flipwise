// Global configuration constants for Cypress tests
export const GLOBAL_TIMEOUT = 10000; // 10 seconds timeout for most operations

// Test data constants
export const TEST_USER = {
  EMAIL: "demo@example.com",
  PASSWORD: "password123",
  INVALID_EMAIL: "fake@nonexistent.com",
  INVALID_PASSWORD: "wrongpass",
};

export const TEST_FOLDER = {
  NAME: "Test Folder",
  DESCRIPTION: "A test folder for Cypress testing",
};

export const TEST_CARD = {
  FRONT: "What is React?",
  BACK: "A JavaScript library for building user interfaces",
};
