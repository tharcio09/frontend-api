describe('Fluxo da Plataforma Linktree', () => {

  it('Deve fazer login com sucesso e carregar o novo Dashboard', () => {
    cy.intercept('POST', '**/login').as('chamadaDeLogin');

    cy.visit('http://localhost:5173');
    cy.get('input[type="email"]').type('tharciosantos09@gmail.com');
    cy.get('input[type="password"]').type('12345');
    cy.get('button[type="submit"]').click();

    cy.wait('@chamadaDeLogin', { timeout: 30000 }).then((interceptacao) => {
      expect(interceptacao.response.statusCode).to.eq(200);
    });
    cy.url().should('include', '/dashboard');
    cy.contains('Meu Painel').should('be.visible');
    cy.contains('Mudar Minha Foto').should('be.visible');
    cy.contains('button', 'Adicionar Link').should('be.visible');
  });

  it('Deve adicionar e depois excluir um novo link com sucesso no perfil', () => {
    cy.visit('http://localhost:5173');
    cy.get('input[type="email"]').type('tharciosantos09@gmail.com');
    cy.get('input[type="password"]').type('12345');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // 1. Mapeamos as chamadas da API (Criação e Exclusão)
    cy.intercept('POST', '**/usuario/link').as('criacaoDeLink');
    cy.intercept('DELETE', '**/usuario/link/*').as('exclusaoDeLink');

    // Usamos um nome específico para o teste não esbarrar em links reais
    const tituloTeste = 'Link Automatizado Cypress';

    // 2. Criação do Link
    cy.get('input[placeholder="Título (ex: Meu GitHub)"]').type(tituloTeste);
    cy.get('input[placeholder="URL (ex: https://github.com/tharcio09)"]').type('https://github.com/tharcio09');
    cy.contains('button', 'Adicionar Link').click();

    cy.wait('@criacaoDeLink').then((interceptacao) => {
      expect(interceptacao.response.statusCode).to.eq(201);
    });

    cy.contains('Link adicionado!').should('be.visible');
    cy.contains('a', tituloTeste).should('have.attr', 'href', 'https://github.com/tharcio09');

    // ---------------------------------------------------------
    // 3. FASE DE LIMPEZA (TEARDOWN) - Excluir o link criado
    // ---------------------------------------------------------

    // O Cypress aceita automaticamente alertas/confirmações do navegador
    cy.on('window:confirm', () => true);

    // Acha exatamente o link que acabamos de criar, sobe para a div pai e clica na lixeira
    cy.contains('a', tituloTeste)
      .parent()
      .find('button[title="Excluir link"]')
      .click();

    // 4. Validação da Exclusão
    cy.wait('@exclusaoDeLink').then((interceptacao) => {
      expect(interceptacao.response.statusCode).to.eq(200);
    });

    cy.contains('Link excluído com sucesso!').should('be.visible');

    // Garantimos que o link de teste realmente sumiu da tela
    cy.contains('a', tituloTeste).should('not.exist');
  });

});