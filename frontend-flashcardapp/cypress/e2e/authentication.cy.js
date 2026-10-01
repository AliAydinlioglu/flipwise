import { GLOBAL_TIMEOUT, TEST_USER } from "../support/config";

describe("Fake Email Login Test", () => {
  beforeEach(() => {
    // Clear login data to ensure clean state
    cy.clearLocalStorage();
    cy.clearCookies();

    // Visit the login page
    cy.visit("/login");

    // Wait for the page to load
    cy.contains("Welcome Back", { timeout: GLOBAL_TIMEOUT }).should("be.visible");
  });

  it("should show error when user tries to login with fake email", () => {
    // Enter fake email and valid password format
    cy.get('input[name="email"]').type(TEST_USER.INVALID_EMAIL);
    cy.get('input[name="password"]').type(TEST_USER.PASSWORD);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the login attempt to complete and check for error
    cy.contains("No user found", { timeout: GLOBAL_TIMEOUT }).should("be.visible");

    // Verify we're still on login page (not redirected)
    cy.url().should("include", "/login");

    // Verify form is re-enabled after error
    cy.get('button[type="submit"]').should("not.be.disabled");

    // Verify inputs are re-enabled
    cy.get('input[name="email"]').should("not.be.disabled");
    cy.get('input[name="password"]').should("not.be.disabled");
  });

  it("should show form validation errors", () => {
    // Submit the form without filling any fields
    cy.get('button[type="submit"]').click();

    // Check for email validation error with timeout
    cy.contains("Email address is required", { timeout: 5000 }).should("be.visible");

    // Check for password validation error with timeout
    cy.contains("Password is required", { timeout: 5000 }).should("be.visible");

    // Check for password length error
    cy.get('input[name="password"]').clear();
    cy.get('input[name="password"]').type("1234567");
    cy.get('button[type="submit"]').click();
    cy.contains("Password must be at least 8 characters long", { timeout: 5000 }).should("be.visible");

    // Check for email format error
    cy.get('input[name="email"]').clear();
    cy.get('input[name="email"]').type("noemail");
    cy.get('button[type="submit"]').click();
    cy.contains("Please enter a valid email address", { timeout: 5000 }).should("be.visible");
  });

  it("should allow login with valid credentials", () => {
    // Enter valid email and password (using demo user from your constants)
    cy.get('input[name="email"]').type("user@example.com");
    cy.get('input[name="password"]').type("user1234");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for successful login and navigation
    cy.url({ timeout: GLOBAL_TIMEOUT }).should("not.include");

    // Should be redirected to home page
    cy.url().should("eq", "http://localhost:5173/login");
    cy.contains("Welcome to FlipWise").should("be.visible");
  });

  it("should toggle password visibility", () => {
    // Type password and verify it's hidden
    cy.get('input[name="password"]').type(TEST_USER.PASSWORD);
    cy.get('input[name="password"]').should("have.attr", "type", "password");

    // Click visibility toggle
    cy.get('[aria-label="toggle password visibility"]').click();
    cy.get('input[name="password"]').should("have.attr", "type", "text");

    // Click again to hide
    cy.get('[aria-label="toggle password visibility"]').click();
    cy.get('input[name="password"]').should("have.attr", "type", "password");
  });
});

describe("Registration Test", () => {
  beforeEach(() => {
    // Clear any existing data
    cy.clearLocalStorage();
    cy.clearCookies();

    // Visit the registration page
    cy.visit("/register");

    // Wait for the page to load
    cy.contains("Join FlipWise", { timeout: GLOBAL_TIMEOUT }).should("be.visible");
  });

  it("should show validation errors for invalid registration data", () => {
    // Submit without filling fields
    cy.get('button[type="submit"]').click();

    // Check for validation errors with timeout
    cy.contains("Email address is required", { timeout: 5000 }).should("be.visible");
    cy.contains("Password is required", { timeout: 5000 }).should("be.visible");

    // Test invalid email format
    cy.get('input[name="email"]').type("invalid-email");
    cy.get('button[type="submit"]').click();
    cy.contains("Please enter a valid email address", { timeout: 5000 }).should("be.visible");

    // Test password too short
    cy.get('input[name="email"]').clear();
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("123");
    cy.get('button[type="submit"]').click();
    cy.contains("Password must be at least 8 characters long", { timeout: 5000 }).should("be.visible");

    // Test password confirmation mismatch
    cy.get('input[name="password"]').clear();
    cy.get('input[name="password"]').type(TEST_USER.PASSWORD);
    cy.get('input[name="confirmPassword"]').type("differentpassword");
    cy.get('button[type="submit"]').click();
    cy.contains("Passwords do not match", { timeout: 5000 }).should("be.visible");
  });

  it("should show error when trying to register with existing email", () => {
    // Fill form with existing user email
    cy.get('input[name="email"]').type("user@example.com"); // Existing demo user
    cy.get('input[name="password"]').type(TEST_USER.PASSWORD);
    cy.get('input[name="confirmPassword"]').type(TEST_USER.PASSWORD);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Should show error about existing account
    cy.contains("An account with this email address already exists", { timeout: GLOBAL_TIMEOUT }).should("be.visible");

    // Should stay on registration page
    cy.url().should("include", "/register");
  });

  it("should toggle password visibility for both password fields", () => {
    // Test password field visibility toggle
    cy.get('input[name="password"]').type(TEST_USER.PASSWORD);
    cy.get('input[name="password"]').should("have.attr", "type", "password");

    cy.get('input[name="password"]').siblings().find('[aria-label*="password visibility"]').click();
    cy.get('input[name="password"]').should("have.attr", "type", "text");

    // Test confirm password field visibility toggle
    cy.get('input[name="confirmPassword"]').type(TEST_USER.PASSWORD);
    cy.get('input[name="confirmPassword"]').should("have.attr", "type", "password");

    cy.get('input[name="confirmPassword"]').siblings().find('[aria-label*="password visibility"]').click();
    cy.get('input[name="confirmPassword"]').should("have.attr", "type", "text");
  });

  it("should navigate to login page when clicking sign in link", () => {
    // Click the sign in link
    cy.contains("Sign in here").click();

    // Should navigate to login page
    cy.url().should("include", "/login");
    cy.contains("Welcome Back").should("be.visible");
  });
});

describe("Logout Test", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.visit("/login");

    cy.get('input[name="email"]').type("user@example.com");
    cy.get('input[name="password"]').type("user1234");
    cy.get('button[type="submit"]').click();

    // ✅ Wait until we're redirected to the home/dashboard
    cy.url({ timeout: GLOBAL_TIMEOUT }).should("not.include", "/login");

    // ✅ Wait for something unique to the logged-in UI
    cy.contains("Welcome to FlipWise", { timeout: GLOBAL_TIMEOUT }).should("be.visible");

    // ✅ Now wait for navbar profile to exist
    cy.get('[data-cy="navbar-profile"]', { timeout: GLOBAL_TIMEOUT }).should("be.visible");
  });

  it("logs out via avatar menu", () => {
    cy.get('[data-cy="navbar-profile"]').click();
    cy.get('[data-cy="navbar-logout"]', { timeout: 5000 }).should("be.visible").click();

    // Should be redirected to home page after logout
    cy.url({ timeout: GLOBAL_TIMEOUT }).should("eq", "http://localhost:5173/");
    cy.contains("Welcome to FlipWise").should("be.visible");
  });

  it("logs out when visiting logout route directly", () => {
    cy.visit("/logout");
    // Should be redirected to home page after logout
    cy.url({ timeout: GLOBAL_TIMEOUT }).should("eq", "http://localhost:5173/");
    cy.contains("Welcome to FlipWise").should("be.visible");
  });

  it("should logout successfully when clicking logout button in navbar", () => {
    // Click logout button in navbar
    cy.get('[data-cy="navbar-profile"]').click();
    cy.get('[data-cy="navbar-logout"]', { timeout: 5000 }).should("be.visible").click();

    // Verify logout was successful
    cy.url({ timeout: GLOBAL_TIMEOUT }).should("eq", "http://localhost:5173/");
    cy.contains("Welcome to FlipWise").should("be.visible");
    cy.get('[data-cy="navbar-profile"]').should("not.exist");
  });

  it("should clear user session and prevent access to protected routes after logout", () => {
    // Logout using the navbar button
    cy.get('[data-cy="navbar-profile"]').click();
    cy.get('[data-cy="navbar-logout"]', { timeout: 5000 }).should("be.visible").click();

    // Wait for logout
    cy.url({ timeout: GLOBAL_TIMEOUT }).should("eq", "http://localhost:5173/");

    // Try to access protected route (folders page) after logout
    cy.visit("/folders");

    // Should be redirected to login page (with redirect parameter)
    cy.url({ timeout: GLOBAL_TIMEOUT }).should("include", "/login");

    // Should not actually be on the folders route itself
    cy.url().should("not.match", /^http:\/\/localhost:5173\/folders$/);
  });

  it("should maintain logout state across page refreshes", () => {
    // Logout
    cy.get('[data-cy="navbar-profile"]').click();
    cy.get('[data-cy="navbar-logout"]').click();
    cy.url({ timeout: GLOBAL_TIMEOUT }).should("eq", "http://localhost:5173/");

    // Refresh the page
    cy.reload();

    // Should still be logged out
    cy.contains("Welcome to FlipWise").should("be.visible");
  });
});

describe("Authentication Flow Integration", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("should maintain login state across page refreshes", () => {
    // Login
    cy.visit("/login");
    cy.get('input[name="email"]').type("user@example.com");
    cy.get('input[name="password"]').type("user1234");
    cy.get('button[type="submit"]').click();

    // Navigate to home
    cy.url({ timeout: GLOBAL_TIMEOUT }).should("eq", "http://localhost:5173/");

    // Refresh the page
    cy.reload();

    // Should still be logged in
    cy.contains("Welcome to FlipWise").should("be.visible");
    cy.get('[data-cy="navbar-profile"]').should("be.visible");
  });

  it("should redirect to login page when accessing protected route while logged out", () => {
    // Try to access protected route without logging in
    cy.visit("/folders");

    // Should be redirected to login page (possibly with redirect parameter)
    cy.url({ timeout: GLOBAL_TIMEOUT }).should("include", "/login");
  });

  it("should navigate between login and register pages correctly", () => {
    // Start at login page
    cy.visit("/login");
    cy.contains("Welcome Back").should("be.visible");

    // Navigate to register
    cy.contains("Register here").click();
    cy.url().should("include", "/register");
    cy.contains("Join FlipWise").should("be.visible");

    // Navigate back to login
    cy.contains("Sign in here").click();
    cy.url().should("include", "/login");
    cy.contains("Welcome Back").should("be.visible");
  });

  it("should show demo user information on login page", () => {
    cy.visit("/login");

    // Check if demo user info is displayed
    cy.contains("Demo User:").should("be.visible");
    cy.contains("user@example.com").should("be.visible");
  });
});
