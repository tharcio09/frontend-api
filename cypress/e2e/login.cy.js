describe('Fluxo de Autenticação (Login)', () => {
  it('Deve fazer login com sucesso e ir para o Dashboard', () => {
    cy.visit('http://localhost:5173');
    cy.get('input[type="email"]').type('tharciosantos09@gmail.com');
    cy.get('input[type="password"]').type('12345');
    cy.get('button[type="submit"]').click('');
    cy.url().should('include', '/dashboard');
    cy.contains('Usuários do Sistema:').should('be.visible');
  });
})