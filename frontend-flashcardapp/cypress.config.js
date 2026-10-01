import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // Your Vite dev server URL
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // Disable video recording for faster tests
    screenshotOnRunFailure: false, // Enable for debugging
    defaultCommandTimeout: 1000,
    pageLoadTimeout: 1000,
    requestTimeout: 1000,
    responseTimeout: 1000,
    // Better terminal output
    reporter: "spec",
    reporterOptions: {
      verbose: true,
    },
  },
});
