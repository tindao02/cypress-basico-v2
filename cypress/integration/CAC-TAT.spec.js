/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
  this.beforeEach(() => {
    cy.visit('./src/index.html');
  })

  it('verifica o título da aplicação', function() {
    cy.title()
      .should('be.equal', 'Central de Atendimento ao Cliente TAT');
  });

  it('Aula 02 - Testes', () => {
    cy.get('#firstName')
      .should('be.visible')
      .type('Teste Aula 02')
      .should('have.value', 'Teste Aula 02');
  });

  it('Preenche os campos obrigatórios e envia o formulário', () => {
    const longText = 'Non et nostrud minim ipsum eu ipsum tempor. Qui eu reprehenderit non proident consequat dolor excepteur voluptate irure. Adipisicing nisi ut duis ex culpa occaecat sit veniam irure.';
    
    cy.get('#firstName').type('Manoel')
    cy.get('#lastName').type('Morais')
    cy.get('#email').type('testes@gmail.com')
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible')
    cy.get('.success > strong').should('have.text', 'Mensagem enviada com sucesso.')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Manoel')
    cy.get('#lastName').type('Morais')
    cy.get('#email').type('testes@gmail,com')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
    cy.get('.error > strong').should('have.text', 'Valide os campos obrigatórios!')
  })

  it('Campo telefonico continua vazio quando preenchido com valor não-numérico', () => {
    cy.get('#phone')
      .should('be.visible')
      .should('have.attr', 'type', 'number')
      .type('abcdef -+/;,.')
      .should('be.empty')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Manoel')
    cy.get('#lastName').type('Morais')
    cy.get('#email').type('testes@gmail.com')
    cy.get('#phone').not('.required')
    cy.get('.phone-label-span').not('.visible')
    cy.get('#phone-checkbox').check()
    cy.get('#phone').should('have.attr', 'required')
    cy.get('.phone-label-span').should('be.visible')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
    cy.get('.error > strong').should('have.text', 'Valide os campos obrigatórios!')    
    
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Teste')
      .should('have.value', 'Teste')
      .clear()
      .should('be.empty')

      cy.get('#lastName')
      .type('Teste')
      .should('have.value', 'Teste')
      .clear()
      .should('be.empty')

      cy.get('#email')
      .type('Teste@gmail.com')
      .should('have.value', 'Teste@gmail.com')
      .clear()
      .should('be.empty')

      cy.get('#phone')
      .type('123456789')
      .should('have.value', '123456789')
      .clear()
      .should('be.empty')

      cy.get('#open-text-area')
      .type('123456789')
      .should('have.value', '123456789')
      .clear()
      .should('be.empty')

    })
  
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
    cy.get('.error > strong').should('have.text', 'Valide os campos obrigatórios!')
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
    cy.get('.success > strong').should('have.text', 'Mensagem enviada com sucesso.')
  })

});
