/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
Cypress.Commands.add("loginCredentials", (email: string, password: string) => {
  cy.clearAllCookies();
  cy.visit("/signin");
  cy.get("input[id=email]").type(email);
  cy.get("input[id=password]").type(password);
  cy.get("button")
    .click()
    .then(() => {
      cy.getCookie("next-auth.callback-url").should("exist");
      cy.get("button").should("have.text", "logout");
    });
});
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
declare namespace Cypress {
  interface Chainable {
    loginCredentials(email: string, password: string): Chainable<void>;
  }
}
