/// <reference types="cypress" />

/**
 * Testing for Sign In Page
 *
 * 0. whether client routes '/signin' endpoint correctly
 *
 * Integration
 * 1. should all elements are displayed correctly
 * 2. should all elements interact correctly
 *
 *
 *
 * E2E
 * 1. should users login properly
 *  1-1. credentials login
 *  1-2. oAuth login (not available)
 *
 * 2. should client / server correctly deals with the not appropriate login attempt
 *  2-1. user does not exists
 *  2-2. incorrect form of userinfo
 *  2-3. password / email not match
 */

describe("0. Routing test", () => {
  it("/signin, should route signin page", () => {
    cy.visit("/signin");
  });
});

describe("1. Page Layouts Test", () => {
  beforeEach(() => {
    cy.visit("/signin");
  });

  it("Title is correctly displayed", () => {
    cy.get("h1").contains("Sign In");
  });

  it("Form element exists and has correct child nodes", () => {
    // if all elements exist
    cy.get("form").children().should("have.length", 9);
    // email input & label
    cy.get("input[id=email]")
      .should("exist")
      .should("have.attr", "placeholder", "type in your email");
    cy.get("label[for=email]").should("exist").should("have.text", "Email");
    // password input & label
    cy.get("input[id=password]")
      .should("exist")
      .should("have.attr", "placeholder", "type in your password");
    cy.get("label[for=password]").should("exist");
    // confirm label & input should not exists
    cy.get("input[id=confirm]").should("not.exist");
    cy.get("label[for=confirm]").should("not.exist");
    // submit button should exist
    cy.get("button").should("exist").contains("Sign In");
    // oAuth SVG should exist
    cy.get("svg[data-testid=GitHubIcon]").should("exist");
    cy.get("svg[data-testid=GoogleIcon]").should("exist");
    // Sign Up Link should exist
    cy.get("a").should("exist").should("have.text", "Don't have an account?");
    cy.get("a").invoke("attr", "href").should("eq", "/signup");
  });
});

describe("2. Interaction Test", () => {
  beforeEach(() => {
    cy.visit("/signin");
  });

  // Label Elements are connected correctly with inputs
  it("when labels clicked, associated input should be focused", () => {
    cy.get("label[for=email]").click();
    cy.get("input[id=email]").should("be.focused");

    cy.get("label[for=password]").click();
    cy.get("input[id=password]").should("be.focused");
  });

  // Input Elements typing tests
  it("when type in something into input, it should have the same value", () => {
    cy.get("input[id=email]")
      .type("abcdABCD1234!@#$%")
      .should("have.value", "abcdABCD1234!@#$%");
    cy.get("input[id=password]")
      .type("abcdABCD1234!@#$%")
      .should("have.value", "abcdABCD1234!@#$%");
  });

  // Button click tests
  it("buttons should be locked after a user tried to login", () => {
    cy.intercept(
      {
        url: "/api/auth/**",
      },
      (req) => {
        req.reply((res) => {
          res.delay = 5000;
        });
      }
    );
    cy.get("input[id=email]")
      .type("abcdABCD1234!@#$%")
      .should("have.value", "abcdABCD1234!@#$%");
    cy.get("input[id=password]")
      .type("abcdABCD1234!@#$%")
      .should("have.value", "abcdABCD1234!@#$%");
    cy.get("button").click().click();
    cy.on("fail", (err) => {
      expect(err.message).to.include("pointer-events: none");
    });
  });
});

// it is currently not possible to integrate oAuth 2.0(w NextAuth) tests with cypress
describe("3. Login Test", () => {
  beforeEach(() => {
    cy.visit("/signin");
  });

  it("Login with valid test email and password", () => {
    const email = Cypress.env("TEST_EMAIL") as string;
    const password = Cypress.env("TEST_PW") as string;
    cy.loginCredentials(email, password);
  });

  it("Login should be failed if invalid userinfo", () => {
    const email = "dontexist@test.com";
    const password = "1234";
    cy.get("input[id=email]").type(email);
    cy.get("input[id=password]").type(password);
    cy.get("button")
      .click()
      .then(() => {
        cy.get("form").should("have.css", "animation");
        cy.get("p[id=err_message]").should(
          "have.text",
          "User does not exists."
        );
      });
  });

  it("Login should be failed when the password is incorrect", () => {
    const email = Cypress.env("TEST_EMAIL") as string;
    const password = "not_correct";
    cy.get("input[id=email]").type(email);
    cy.get("input[id=password]").type(password);
    cy.get("button")
      .click()
      .then(() => {
        cy.get("form").should("have.css", "animation");
        cy.get("p[id=err_message]").should(
          "have.text",
          "Email or Password is incorrect"
        );
      });
  });
});
