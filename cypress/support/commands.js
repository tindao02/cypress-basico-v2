Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
    cy.get('#firstName').type('Manoel')
    cy.get('#lastName').type('Morais')
    cy.get('#email').type('testes@gmail.com')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()
}) 