/// <reference types="Cypress" />

let _a = () => {
  cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
}

describe('Central de Atendimento ao Cliente TAT', function() {
  this.beforeEach(() => {
    cy.visit('./src/index.html');
  })

  it('verifica o título da aplicação', () => {
    cy.title()
      .should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('Preenche o campo nome e verifica se está correto', () => {
    cy.get('#firstName')
      .should('be.visible')
      .should('be.empty')
      .type('Primeiro Nome')
      .should('have.value', 'Primeiro Nome')
  })

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

    it('seleciona um produto (YouTube) por seu texto', () => {
      cy.get('select#product')
        .select('YouTube')
        .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
      cy.get('select#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
      cy.get('select#product')
        .select(1)
        .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', () => {
      cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('have.value', 'feedback')
        .should('be.checked')
    })

    it('marca cada tipo de atendimento', () => {
      cy.get('input[type="radio"][name="atendimento-tat"]')
        .should('have.length', 3)
        .each($radio => cy.wrap($radio)
                          .check()
                          .should('be.checked'))
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
      cy.get('input[type="checkbox"]')
        .check()
        .last()
        // .eq(1)
        .uncheck()
        .not('be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
      cy.get('input[type="file"]')
      .should('be.empty')
      .selectFile('./cypress/fixtures/example.json')
      .should(input => expect(input[0].files[0].name).to.equal('example.json'))
    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
      cy.get('input[type="file"]')
      .should('be.empty')
      .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
      .should(input => expect(input[0].files[0].name).to.equal('example.json'))
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
      cy.fixture('example.json').as('sampleFile')
      cy.get('input[type="file"]')
        .selectFile('@sampleFile')
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
      cy.get('#privacy a')
        .should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
      _a()
    })

})

