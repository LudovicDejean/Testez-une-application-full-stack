// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(email: string, password: string): typeof login;
  }
}
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
//
function login(email: string, password: string): void {
    const isAdmin = email === "yoga@studio.com";
    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: isAdmin ? 1 : 2,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: isAdmin,
      },
    }).as("login");

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [  {
        "id": 1,
        "name": "Session 1",
        "date": new Date(),
        "teacher_id": 1,
        "description": "Session 1 desc",
        "users": [],
        "createdAt": new Date(),
        "updatedAt": new Date()
    },
    {
        "id": 2,
        "name": "Session 2",
        "date": new Date(),
        "teacher_id": 1,
        "description": "Session 2 desc",
        "users": [],
        "createdAt": new Date(),
        "updatedAt": new Date()
    }]).as('session')

    cy.get('input[formControlName=email]').type(email)
    cy.get('input[formControlName=password]').type(`${password}{enter}{enter}`)
    cy.wait("@session")
}

Cypress.Commands.add('login', login);
