/// <reference types="cypress" />

/**
 * Testing for Sign Up Page
 *
 * 0. whether client routes '/signin' endpoint correctly
 *
 * Integration
 * 1. should all elements are displayed correctly
 * 2. should all elements interact correctly
 *
 * E2E
 * 1. should users signup properly
 *  1-1. credentials sign up, redirect correctly
 *  1-2. after sign up, user should be able to login with the account
 *
 * 2. should client / server correctly deals with the not appropriate sign up attempt
 *  2-1. empty email
 *  2-1. wrong email type
 *  2-3. empty password
 *  2-4. wrong password
 *  2-5. wrong confirm
 */

describe("0. Routing test", () => {
  it("/signup, should route sign up page", () => {
    cy.visit("/signup");
  });
});

describe("1. Page Layouts Test", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("Title is correctly displayed", () => {
    cy.get("h1").contains("Sign Up");
  });

  it("Form element exists and has correct child nodes", () => {
    // if all elements exist
    cy.wait(500);
    cy.get("form").children().should("have.length", 13);
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
    cy.get("input[id=confirm]").should("exist");
    cy.get("label[for=confirm]").should("exist");
    // submit button should exist
    cy.get("button").should("exist").contains("Sign Up");
    // oAuth SVG should exist
    cy.get("svg[data-testid=GitHubIcon]").should("exist");
    cy.get("svg[data-testid=GoogleIcon]").should("exist");
  });
});

describe("2. Interaction Test", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  // Label Elements are connected correctly with inputs
  it("When labels clicked, associated input should be focused", () => {
    cy.get("label[for=email]").click();
    cy.get("input[id=email]").should("be.focused");

    cy.get("label[for=password]").click();
    cy.get("input[id=password]").should("be.focused");
  });

  // Input Elements typing tests
  it("When type in something into input, it should have the same value", () => {
    cy.get("input[id=email]")
      .type("abcdABCD1234!@#$%")
      .should("have.value", "abcdABCD1234!@#$%");
    cy.get("input[id=password]")
      .type("abcdABCD1234!@#$%")
      .should("have.value", "abcdABCD1234!@#$%");
    cy.get("input[id=confirm]")
      .type("abcdABCD1234!@#$")
      .should("have.value", "abcdABCD1234!@#$");
  });
  // Buttons click tests
  it("Buttons should be locked after, a user tried to login", () => {
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
    cy.get("input[id=email]").type(Cypress.env("TEST_EMAIL") as string);
    cy.get("input[id=password]").type(Cypress.env("TEST_PW") as string);
    cy.get("input[id=confirm]").type(Cypress.env("TEST_PW") as string);
    cy.get("button").click().click();
    cy.on("fail", (err) => {
      expect(err.message).to.include("pointer-events: none");
    });
  });
});

describe("3. Input validation test", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("Empty email input should be alerted and prevent sending request", () => {
    cy.wait(500);
    cy.get("input[id=email]").should("not.have.value").focus();
    cy.get("#email_valid_info").should(
      "have.text",
      "Email cannot be left empty"
    );
    cy.get("button").click();
    cy.get("#err_message").should(
      "have.text",
      "Your sign up information is not in correct form, check your information."
    );
  });

  it("Wrong email input should be alerted and prevent sending request", () => {
    cy.wait(500);
    cy.get("input[id=email]")
      .type("not_an_email")
      .should("have.value", "not_an_email");
    cy.get("#email_valid_info").should(
      "have.text",
      "Email is not valid email form"
    );
    cy.get("button").click();
    cy.get("#err_message").should(
      "have.text",
      "Your sign up information is not in correct form, check your information."
    );
  });

  it("Correct email input should not be alerted", () => {
    cy.wait(500);
    cy.get("input[id=email]")
      .type(Cypress.env("TEST_EMAIL") as string)
      .should("have.value", Cypress.env("TEST_EMAIL") as string);
    cy.get("#email_valid_info").should("not.be.visible");
  });

  it("Empty password input should be alerted and prevent sending request", () => {
    cy.wait(500);
    cy.get("input[id=password]").should("not.have.value").focus();
    cy.get("#password_valid_info").should(
      "have.text",
      "Password cannot be left empty"
    );
    cy.get("button").click();
    cy.get("#err_message").should(
      "have.text",
      "Your sign up information is not in correct form, check your information."
    );
  });

  it("Wrong password length should be alerted and prevent sending request", () => {
    cy.wait(500);
    cy.get("input[id=email]")
      .type(Cypress.env("TEST_EMAIL") as string)
      .should("have.value", Cypress.env("TEST_EMAIL") as string);
    cy.get("input[id=password]").type("01234").should("have.value", "01234");
    cy.get("#password_valid_info").should(
      "have.text",
      "Password must be 6~16 characters"
    );
    cy.get("button").click();
    cy.get("#err_message").should(
      "have.text",
      "Your sign up information is not in correct form, check your information."
    );
    cy.get("input[id=password]").clear();
    cy.get("input[id=password]")
      .type("01234567891234567")
      .should("have.value", "01234567891234567");
    cy.get("#password_valid_info").should(
      "have.text",
      "Password must be 6~16 characters"
    );
    cy.get("button").click();
    cy.get("#err_message").should(
      "have.text",
      "Your sign up information is not in correct form, check your information."
    );
  });

  it("Wrong password form should be alerted and prevent sending request", () => {
    cy.wait(500);
    cy.get("input[id=password]").type("englishonly");
    cy.get("#password_valid_info").should(
      "have.text",
      "Password should be a combination of number, alphabet, special characters(!@#$%^*+=-)"
    );
    cy.get("button").click();
    cy.get("#err_message").should(
      "have.text",
      "Your sign up information is not in correct form, check your information."
    );
    cy.get("input[id=password]").clear().type("012345678");
    cy.get("#password_valid_info").should(
      "have.text",
      "Password should be a combination of number, alphabet, special characters(!@#$%^*+=-)"
    );
    cy.get("button").click();
    cy.get("#err_message").should(
      "have.text",
      "Your sign up information is not in correct form, check your information."
    );
    cy.get("input[id=password]").clear().type("english012");
    cy.get("#password_valid_info").should(
      "have.text",
      "Password should be a combination of number, alphabet, special characters(!@#$%^*+=-)"
    );
    cy.get("button").click();
    cy.get("#err_message").should(
      "have.text",
      "Your sign up information is not in correct form, check your information."
    );
  });

  it("Correct password input should not be alerted", () => {
    cy.wait(500);
    cy.get("input[id=password]")
      .type("1234qwerty!")
      .should("have.value", "1234qwerty!");
    cy.get("#password_valid_info").should("not.be.visible");
  });

  it("If password confrim not match with password should be alerted and prevent requesting", () => {
    cy.wait(500);
    cy.get("input[id=password]")
      .type("1234qwerty!")
      .should("have.value", "1234qwerty!");
    cy.get("input[id=confirm]")
      .type("notequal")
      .should("have.value", "notequal");
    cy.get("#confirm_valid_info").should(
      "have.text",
      "Password confirm is not same with the password"
    );
    cy.get("button").click();
    cy.get("#err_message").should(
      "have.text",
      "Your sign up information is not in correct form, check your information."
    );
  });
});

describe("4. Sign Up Test", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("If every inputs are valid, user can create an account with the info", () => {
    type UserIdResponse = {
      result: {
        data: {
          json: {
            data: {
              userId: string;
            };
          };
        };
      };
    };

    cy.intercept({
      url: "/api/trpc/signup**",
    }).as("signup");

    cy.task("dbResetForSignUp", { email: "testemail@gmail.com" }).then(
      (res) => {
        if (res) {
          cy.log("Exisiting user deleted successfuly for test");
        } else {
          cy.log("User does not exist. Test can continue");
        }
      }
    );
    cy.get("input[id=email]")
      .type("testemail@gmail.com")
      .should("have.value", "testemail@gmail.com");
    cy.get("input[id=password]")
      .type("valid1234!")
      .should("have.value", "valid1234!");
    cy.get("input[id=confirm]")
      .type("valid1234!")
      .should("have.value", "valid1234!");
    cy.get("#email_valid_info").should("not.be.visible");
    cy.get("#password_valid_info").should("not.be.visible");
    cy.get("#confirm_valid_info").should("not.be.visible");
    cy.get("button").click();
    cy.wait("@signup").then(({ response }) => {
      const body = response.body as [UserIdResponse];
      const { userId } = body[0].result.data.json.data;
      cy.url().should("include", userId);
    });
  });

  it("If a user already exists, user cannot sign up with the email", () => {
    cy.get("input[id=email]")
      .type(Cypress.env("TEST_EMAIL") as string)
      .should("have.value", Cypress.env("TEST_EMAIL") as string);
    cy.get("input[id=password]")
      .type("1234qwerty!")
      .should("have.value", "1234qwerty!");
    cy.get("input[id=confirm]")
      .type("1234qwerty!")
      .should("have.value", "1234qwerty!");
    cy.get("button").click();
    cy.get("#err_message").should(
      "have.text",
      "The account already has signed up"
    );
  });
});
