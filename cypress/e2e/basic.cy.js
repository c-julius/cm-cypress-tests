/// <reference types="cypress" />

describe('Login and Dashboard', () => {
  it('Shows the login form and logs in', () => {
    cy.visit('/login');
    cy.get('input[type=email]').type('admin@example.com');
    cy.get('input[type=password]').type('password');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Total Companies');
    cy.contains('Total Employees');
  });
});

describe('Companies', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Can view the company list', () => {
    // Click the `Companies` button
    cy.get('a.nav-link').contains(/companies/i).click();
    // Check if the company list is displayed
    cy.contains('Companies');
    cy.get('table').should('exist');
    // Ensure the table has some rows
    cy.get('table tbody tr').should('have.length.greaterThan', 1);
  });

  it('Can add and delete a company', () => {
    // Click the `Companies` button
    cy.get('a.nav-link').contains(/companies/i).click();

    // Wait for the list to load
    cy.get('table tbody tr').should('have.length.greaterThan', 1);
    // Ensure test data is not present
    cy.contains('Test Co').should('not.exist');

    // Click the `Add Company` button
    cy.get('a.btn').contains(/add company/i).click();
    cy.get('input[name="name"]').type('Test Co');
    cy.get('input[name="abn"]').type('12345678901');
    cy.get('input[type=email]').type('testco@example.com');
    cy.get('input[name="address"]').type('123 Test St');
    cy.get('button[type=submit]').contains(/add company/i).click();
    cy.contains('Company added successfully').should('exist');
    cy.contains('Test Co');

    // Return to the company list
    cy.get('a.nav-link').contains(/companies/i).click();
    // Click the delete button for the newly added company
    cy.get('table tbody tr').contains('Test Co').parent().parent().find('button').contains(/delete/i).click();
    // Confirm the deletion (JS confirm dialog)
    cy.on('window:confirm', () => true);
    // Check if the company was deleted
    cy.contains('Company deleted successfully').should('exist');
    cy.get('table tbody tr').should('have.length.greaterThan', 1);
    cy.contains('Test Co').should('not.exist');
  });
});

describe('Employees', () => {
    beforeEach(() => {
        cy.login();
    });
    
    it('Can view employees of a company', () => {
        // Click the `Companies` button
        cy.get('a.nav-link').contains(/companies/i).click();
        // Click on the first company in the list
        cy.get('table tbody tr').first().find('td a').contains(/view/i).click();
        // Check if the employee list is displayed
        cy.contains('Employees');
        cy.get('table[name=employees]').should('exist');
        // Ensure the table has some rows
        cy.get('table[name=employees] tbody tr').should('have.length.greaterThan', 1);
    });
    
    it('Can add and delete an employee', () => {
        // Click the `Companies` button
        cy.get('a.nav-link').contains(/companies/i).click();
        // Click on the first company in the list
        cy.get('table tbody tr').first().find('td a').contains(/view/i).click();

        // Wait for the employee list to load
        cy.get('table[name=employees] tbody tr').should('have.length.greaterThan', 1);
        // Ensure test data is not present
        cy.contains('JohnTest DoeTest').should('not.exist');

        // Click the `Add Employee` button
        cy.get('a.btn').contains(/add employee/i).click();
        cy.get('input[name="first_name"]').type('JohnTest');
        cy.get('input[name="last_name"]').type('DoeTest');
        cy.get('input[type=email]').type('test@test.com');
        cy.get('input[name="address"]').type('123 Test St');
        cy.get('button[type=submit]').contains(/add employee/i).click();
        cy.contains('Employee added successfully').should('exist');
        cy.contains('JohnTest DoeTest');
        // Return to the employee list via the same company
        cy.get('a.nav-link').contains(/companies/i).click();
        cy.get('table tbody tr').first().find('td a').contains(/view/i).click();
        // Ensure the employee was added
        cy.get('table[name=employees] tbody tr').should('have.length.greaterThan', 1);
        cy.contains('JohnTest DoeTest').should('exist');
        // Click the delete button for the newly added employee
        cy.get('table[name=employees] tbody tr').contains('JohnTest DoeTest').parent().parent().find('button').contains(/delete/i).click();
        // Confirm the deletion (JS confirm dialog)
        cy.on('window:confirm', () => true);
        // Check if the employee was deleted
        cy.contains('Employee deleted successfully').should('exist');
        cy.get('table[name=employees] tbody tr').should('have.length.greaterThan', 1);
        cy.contains('JohnTest DoeTest').should('not.exist');
    });
});