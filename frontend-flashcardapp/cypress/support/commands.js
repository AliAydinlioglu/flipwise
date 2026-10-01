Cypress.Commands.add("login", (email, password) => {
  Cypress.log({
    displayName: "login",
  });

  cy.intercept("/api/sessions").as("login");

  cy.visit("http://localhost:5173/login");

  cy.get("[data-cy=email_input]").clear();
  cy.get("[data-cy=email_input]").type(email);

  cy.get("[data-cy=password_input]").clear();
  cy.get("[data-cy=password_input]").type(password);

  cy.get("[data-cy=submit_btn]").click();
  cy.wait("@login");
});

Cypress.Commands.add("logout", () => {
  Cypress.log({
    displayName: "logout",
  });

  cy.visit("http://localhost:5173");
  cy.get("[data-cy=logout_btn]").click();
});

// Custom command for tab navigation in accessibility tests
Cypress.Commands.add("tab", { prevSubject: "optional" }, (subject) => {
  return subject ? cy.wrap(subject).trigger("keydown", { key: "Tab" }) : cy.get("body").trigger("keydown", { key: "Tab" });
});

// Custom command to check if element is focused
Cypress.Commands.add("shouldBeFocused", { prevSubject: true }, (subject) => {
  return cy.wrap(subject).should("have.focus");
});
