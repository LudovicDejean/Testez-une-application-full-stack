describe('Register spec', () => {
    it('should register successfull', () => {
        cy.visit('/register');
        cy.intercept('POST', '/api/auth/register', {}).as("reg");

        cy.get('input[formControlName=firstName]').type('Test');
        cy.get('input[formControlName=lastName]').type('TEST');
        cy.get('input[formControlName=email]').type('test@mail.com');
        cy.get('input[formControlName=password]').type('password{enter}{enter}');
        cy.wait("@reg");

        cy.url().should('include', '/login');
    });
    it('Register should fail', () => {
        cy.visit('/register');
        cy.get('input[formControlName=firstName]').type('Test');
        cy.get('input[formControlName=lastName]').type('TESTsihtasiohetnasiohetn');
        cy.get('input[formControlName=email]').type('test');
        cy.get('input[formControlName=password]').type('password{enter}{enter}');
        cy.get(".mat-form-field-invalid").should('contain.text', "Email");
    });
});
