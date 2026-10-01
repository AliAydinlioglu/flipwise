import { GLOBAL_TIMEOUT } from "../support/config";

describe("Study Mode", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe("Public Folder Study", () => {
    it("should start study mode from public folders", () => {
      cy.visit("/public-folders");

      cy.contains("Community Folders", { timeout: GLOBAL_TIMEOUT }).should("be.visible");

      // Check if there are folders to study
      cy.get("body").then(($body) => {
        if ($body.find('button:contains("Study")').length > 0) {
          // Start study mode
          cy.get("button").contains("Study").first().click();

          // Study dialog should open
          cy.get('[role="dialog"]', { timeout: GLOBAL_TIMEOUT }).should("be.visible");
          cy.contains("Study").should("be.visible");

          // Should show flashcard interface
          cy.get("button").contains("Show Answer").should("be.visible");
        }
      });
    });

    it("should navigate through flashcards", () => {
      cy.visit("/public-folders");

      cy.get("body").then(($body) => {
        if ($body.find('button:contains("Study")').length > 0) {
          cy.get("button").contains("Study").first().click();

          cy.get('[role="dialog"]').should("be.visible");

          // Show answer
          cy.get("button").contains("Show Answer").click();

          // Should show navigation buttons
          cy.get('[role="dialog"]').within(() => {
            cy.get('button[aria-label*="Next"]').should("be.visible");
            cy.get('button[aria-label*="Previous"]').should("be.visible");
          });

          // Navigate to next card
          cy.get('button[aria-label*="Next"]').click();
          cy.get("button").contains("Show Answer").should("be.visible");
        }
      });
    });

    it("should close study mode", () => {
      cy.visit("/public-folders");

      cy.get("body").then(($body) => {
        if ($body.find('button:contains("Study")').length > 0) {
          cy.get("button").contains("Study").first().click();

          cy.get('[role="dialog"]').should("be.visible");

          // Close the dialog
          cy.get('[role="dialog"]').within(() => {
            cy.get('button[aria-label="close"]').click();
          });

          // Dialog should be closed
          cy.get('[role="dialog"]').should("not.exist");
        }
      });
    });
  });

  describe("Authenticated Study Mode", () => {
    beforeEach(() => {
      // Login for authenticated tests
      cy.visit("/login");
      cy.get('input[name="email"]').type("user@example.com");
      cy.get('input[name="password"]').type("user1234");
      cy.get('button[type="submit"]').click();

      cy.url({ timeout: GLOBAL_TIMEOUT }).should("not.include", "/login");

      // Wait for something unique to the logged-in UI
      cy.contains("Welcome to FlipWise", { timeout: GLOBAL_TIMEOUT }).should("be.visible");

      // Now wait for navbar profile to exist
      cy.get('[data-cy="navbar-profile"]', { timeout: GLOBAL_TIMEOUT }).should("be.visible");
    });

    it("should show progress during study", () => {
      // Use existing folder or public folder
      cy.visit("/public-folders");

      cy.get("body").then(($body) => {
        if ($body.find('button:contains("Study")').length > 0) {
          cy.get("button").contains("Study").first().click();

          cy.get('[role="dialog"]').should("be.visible");

          // Should show some progress indicator
          cy.get('[role="dialog"]').within(() => {
            // Look for progress indicators like "1/5" or progress bar
            cy.get("body").should("contain.text", "/");
          });
        }
      });
    });
  });
});
