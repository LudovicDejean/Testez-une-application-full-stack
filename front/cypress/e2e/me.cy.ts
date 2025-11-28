describe('Me Spec', () => {
  it('Me', () => {
    cy.login("test@test.com", "test!1234")
    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/2',
      },
      [ {
        "id": "1",
        "email": "test@test.com",
        "lastName": "Test",
        "firstName": "Test",
        "admin": false,
        "createdAt": new Date(),
        "updatedAt": new Date()
      }]).as('user')
    cy.get('[routerlink="me"]').click();
    cy.wait('@user');
    cy.contains("User information")
  })
});
