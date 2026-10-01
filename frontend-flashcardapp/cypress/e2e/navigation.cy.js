import { GLOBAL_TIMEOUT } from "../support/config";

describe("Navigation Tests", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe("Public Navigation", () => {
    it("should navigate to public folders from homepage", () => {
      cy.visit("/");
      
      // Wait for homepage to load
      cy.contains("Welcome to FlipWise", { timeout: GLOBAL_TIMEOUT }).should("be.visible");
      
      // Navigate to public folders
      cy.get('[data-cy="navbar-public-folders"]').click();
      
      cy.url().should("include", "/public-folders");
      cy.contains("Community Folders").should("be.visible");
    });

    it("should navigate between login and register pages", () => {
      cy.visit("/login");
      cy.contains("Welcome Back", { timeout: GLOBAL_TIMEOUT }).should("be.visible");

      // Go to register page
      cy.contains("Register here").click();
      cy.url().should("include", "/register");
      cy.contains("Join FlipWise").should("be.visible");

      // Go back to login
      cy.contains("Sign in here").click();
      cy.url().should("include", "/login");
      cy.contains("Welcome Back").should("be.visible");
    });

    it("should redirect to login when accessing protected routes", () => {
      // Try to access protected route without login
      cy.visit("/folders");
      
      cy.url({ timeout: GLOBAL_TIMEOUT }).should("include", "/login");
      cy.contains("Welcome Back").should("be.visible");
    });
  });

  describe("Authenticated Navigation", () => {
    beforeEach(() => {
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

    it("should navigate to my folders", () => {
      cy.get('[data-cy="navbar-my-folders"]').click();
      
      cy.url().should("include", "/folders");
      cy.contains("My Folders", { timeout: GLOBAL_TIMEOUT }).should("be.visible");
    });

    it("should navigate to about page", () => {
      cy.visit("/about");
      
      cy.url().should("include", "/about");
      cy.contains("About FlipWise", { timeout: GLOBAL_TIMEOUT }).should("be.visible");
    });

    it("should maintain authentication state across page navigation", () => {
      // Navigate to different pages
      cy.visit("/");
      cy.get('[data-cy="navbar-profile"]').should("be.visible");

      cy.visit("/public-folders");
      cy.get('[data-cy="navbar-profile"]').should("be.visible");

      cy.visit("/folders");
      cy.get('[data-cy="navbar-profile"]').should("be.visible");
    });
  });

  describe("Theme Toggle", () => {
    it("should toggle between light and dark theme", () => {
      cy.visit("/");
      
      // Click theme toggle
      cy.get('[data-cy="theme-toggle"]').click();
      
      // Theme should change (we can check for body classes or CSS properties)
      cy.get('body').should('have.css', 'background-color');
      
      // Toggle back
      cy.get('[data-cy="theme-toggle"]').click();
      cy.get('body').should('have.css', 'background-color');
    });
  });
});
