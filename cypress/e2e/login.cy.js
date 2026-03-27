describe('Fluxo de Autenticação (Login)', () => {
  it('Deve fazer login com sucesso e ir para o Dashboard', () => {
    cy.intercept('POST', '**/login').as('chamadaDeLogin');
    cy.visit('http://localhost:5173');
    cy.get('input[type="email"]').type('tharciosantos09@gmail.com');
    cy.get('input[type="password"]').type('12345');
    cy.get('button[type="submit"]').click();
    cy.wait('@chamadaDeLogin', { timeout: 30000 }).then((interceptacao) => {
      expect(interceptacao.response.statusCode).to.eq(200);
    });
    cy.url().should('include', '/dashboard');
    cy.contains('Usuários Cadastrados').should('be.visible');
  });
})