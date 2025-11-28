describe('Not-found spec', () => {
  it('not-found', () => {
    cy.visit('/nopageexist');
    cy.url().should('include', '404');
  });
});
