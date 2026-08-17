describe('Fluxo da Plataforma Linktree', () => {

  it('Deve fazer login com sucesso e carregar o novo Dashboard', () => {
    cy.intercept('POST', '**/login').as('chamadaDeLogin');

    cy.visit('/');
    cy.get('input[type="email"]').type('tharciosantos09@gmail.com');
    cy.get('input[type="password"]').type('12345');
    cy.get('button[type="submit"]').click();

    cy.wait('@chamadaDeLogin', { timeout: 30000 }).then((interceptacao) => {
      expect(interceptacao.response.statusCode).to.eq(200);
    });
    cy.url().should('include', '/dashboard');
    cy.contains('DevLinks').should('be.visible');
    cy.contains('Trocar Foto').should('exist');
    cy.contains('button', 'Adicionar Link').should('be.visible');
  });

  it('Deve adicionar e depois excluir um novo link com sucesso no perfil', () => {
    cy.intercept('POST', '**/login').as('chamadaDeLogin');

    cy.visit('/');
    cy.get('input[type="email"]').type('tharciosantos09@gmail.com');
    cy.get('input[type="password"]').type('12345');
    cy.get('button[type="submit"]').click();

    cy.wait('@chamadaDeLogin', { timeout: 30000 });
    cy.url().should('include', '/dashboard');

    // 1. Mapeamos as chamadas da API (Criacao e Exclusao)
    cy.intercept('POST', '**/usuario/link').as('criacaoDeLink');
    cy.intercept('DELETE', '**/usuario/link/*').as('exclusaoDeLink');

    // Usamos um nome especifico para o teste nao esbarrar em links reais
    const tituloTeste = 'Link Automatizado Cypress';

    // 2. Criacao do Link
    cy.get('input[placeholder*="Título"]').type(tituloTeste);
    cy.get('input[placeholder*="github.com"]').type('https://github.com/tharciosantos');
    cy.contains('button', 'Adicionar Link').click();

    cy.wait('@criacaoDeLink').then((interceptacao) => {
      expect(interceptacao.response.statusCode).to.eq(201);
    });

    cy.contains('Link adicionado com sucesso!').should('be.visible');
    cy.contains(tituloTeste).should('be.visible');

    // ---------------------------------------------------------
    // 3. FASE DE LIMPEZA (TEARDOWN) - Excluir o link criado
    // ---------------------------------------------------------

    // O Cypress aceita automaticamente alertas/confirmacoes do navegador
    cy.on('window:confirm', () => true);

    // Acha exatamente o link que acabamos de criar e clica em Excluir
    cy.contains(tituloTeste)
      .closest('.border')
      .find('button')
      .contains('Excluir')
      .click();

    // 4. Validacao da Exclusao
    cy.wait('@exclusaoDeLink').then((interceptacao) => {
      expect(interceptacao.response.statusCode).to.eq(200);
    });

    cy.contains('Link excluído com sucesso!').should('be.visible');

    // Garantimos que o link de teste realmente sumiu da tela
    cy.contains(tituloTeste).should('not.exist');
  });

});
