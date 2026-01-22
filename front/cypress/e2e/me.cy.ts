describe('Me Spec', () => {
  it('Me', () => {
    cy.login("test@test.com", "test!1234")
    cy.intercept('GET', '/api/user/2', {
      statusCode: 200,
      body: {
        id: 2,
        email: "test@test.com",
        lastName: "Test",
        firstName: "Test",
        admin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }).as('user');
    cy.get('[routerlink="me"]').click();
    cy.wait('@user');
    cy.contains("User information")
  })
});
