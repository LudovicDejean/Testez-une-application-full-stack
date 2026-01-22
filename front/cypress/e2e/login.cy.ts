describe('Login spec', () => {
  it('Login Admin', () => {
    cy.login("yoga@studio.com", "test!1234");
    cy.url().should('include', '/sessions');
  });

  it('Login User', () => {
    cy.login('test@test.com', "test1234");
    cy.url().should('include', '/sessions');

  });
  it('Login Fail', () => {
    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 400,
    }).as("login");
    cy.get('input[formControlName=email]').type("test@test.com");
    cy.get('input[formControlName=password]').type(`test{enter}{enter}`);
    cy.wait("@login");
    cy.get('.error').should('contain', "An error occurred");
  });
});
