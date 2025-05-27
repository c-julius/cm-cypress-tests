Cypress.Commands.add('login', () => {
    cy.visit('/login');
    cy.get('input[type=email]').type('admin@example.com');
    cy.get('input[type=password]').type('password');
    cy.get('button[type=submit]').click();
});
