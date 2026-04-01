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

  it('Deve adicionar um novo link com sucesso no perfil', () => {
    cy.visit('http://localhost:5173');
    cy.get('input[type="email"]').type('tharciosantos09@gmail.com');
    cy.get('input[type="password"]').type('12345');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    cy.intercept('POST', '**/usuario/link').as('criacaoDeLink');

    cy.get('input[placeholder="Título (ex: Meu GitHub)"]').type('Meu Portfólio');
    cy.get('input[placeholder="URL (ex: https://github.com/tharcio09)"]').type('https://github.com/tharcio09');

    cy.contains('button', 'Adicionar Link').click();

    cy.wait('@criacaoDeLink').then((interceptacao) => {
      expect(interceptacao.response.statusCode).to.eq(201);
    });

    cy.contains('Link adicionado!').should('be.visible');
    cy.contains('a', 'Meu Portfólio').should('be.visible').and('have.attr', 'href', 'https://github.com/tharcio09');
  });

});