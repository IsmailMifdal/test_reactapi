describe('Home page spec', () => {
  it('deployed react app to localhost', () => {
    cy.visit('http://localhost:3000')
    cy.contains('1 user(s) already registered')

  })
})

describe('Tests en mode Offline', () => {
  // Remplissage du formulaire avant de soumettre
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
    cy.get('input[name="nom"]').type('Doe');
    cy.get('input[name="prenom"]').type('John');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="dateNaissance"]').type('2000-01-01');
    cy.get('input[name="ville"]').type('Paris');
    cy.get('input[name="codePostal"]').type('75001');
    cy.get('input[name="password"]').type('123456');
  });

  it('devrait se comporter correctement en ligne', function () {
    if (Cypress.env('offline')) {
      this.skip();
    }

    cy.intercept('POST', '**/users', {
      statusCode: 201,
      body: { message: 'Utilisateur créé' }
    }).as('syncRequest');

    cy.get('[data-cy="btn-sync"]').click();
    cy.wait('@syncRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);

    });
    cy.contains('Inscription réussie');
  });

  it('devrait afficher un message d\'erreur quand le réseau est coupé', function () {
    if (!Cypress.env('offline')) {
      this.skip(); // Évite un faux positif en mode online
    }

    cy.log('Mode offline activé !');

    cy.intercept('POST', '/users', { forceNetworkError: true }).as('syncRequest');

    cy.get('[data-cy="btn-sync"]').click();

    cy.wait('@syncRequest');
    cy.contains('Erreur lors de l\'inscription : Network Error');
  });
});