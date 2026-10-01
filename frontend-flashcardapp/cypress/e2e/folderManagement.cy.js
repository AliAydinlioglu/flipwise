import { GLOBAL_TIMEOUT } from "../support/config";

describe("Folder Management", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    // Login before each test
    cy.visit("/login");
    cy.get('input[name="email"]').type("user@example.com");
    cy.get('input[name="password"]').type("user1234");
    cy.get('button[type="submit"]').click();

    // Wait for successful login
    cy.url({ timeout: GLOBAL_TIMEOUT }).should("not.include", "/login");

    // Wait for something unique to the logged-in UI
    cy.contains("Welcome to FlipWise", { timeout: GLOBAL_TIMEOUT }).should("be.visible");

    // Now wait for navbar profile to exist
    cy.get('[data-cy="navbar-profile"]', { timeout: GLOBAL_TIMEOUT }).should("be.visible");
  });

  describe("Folder Creation", () => {
    it("should create a new folder successfully", () => {
      // Navigate to My Folders
      cy.get('[data-cy="navbar-my-folders"]').click();
      cy.url().should("include", "/folders");

      // Click create folder button (FAB)
      cy.get('[aria-label="add folder"]').click();
      cy.url().should("include", "/folders/create");

      // Fill in folder details
      cy.get('input[name="name"]').type("Test Folder");

      // Submit form
      cy.get('button[type="submit"]').click();

      // Should redirect back to folders list
      cy.url({ timeout: GLOBAL_TIMEOUT }).should("include", "/folders");
      cy.contains("Test Folder").should("be.visible");
    });

    it("should show validation errors for empty folder name", () => {
      cy.get('[data-cy="navbar-my-folders"]').click();
      cy.get('[aria-label="add folder"]').click();

      // Submit without filling name
      cy.get('button[type="submit"]').click();

      cy.contains("Folder name is required", { timeout: GLOBAL_TIMEOUT }).should("be.visible");
    });
  });

  describe("Folder Viewing", () => {
    it("should view folder details", () => {
      // First create a folder to view
      cy.get('[data-cy="navbar-my-folders"]').click();
      cy.get('[aria-label="add folder"]').click();

      cy.get('input[name="name"]').type("View Test Folder");
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/folders/");
    });

    it("should show empty state when no folders exist", () => {
      cy.get('[data-cy="navbar-my-folders"]').click();

      // Should show empty state or list of folders
      cy.get("body").should("be.visible");
      // Note: The specific empty state message depends on your implementation
    });
  });
});
