context('Login Page', () => {
  beforeEach(() => {
      cy.visit('localhost:3000/login')
  })

  it('Google Sign-In button should be clickable', () => {
      cy.get('.social-signin').within(() => {
          cy.get('.MuiSvgIcon-root').should('be.visible').click();
      });
  
  it('Google Sign-In button should trigger a popup', () => {
    cy.window().then((win) => {
      const spy = cy.spy(win, 'open').as('windowOpen');
      cy.get('.social-signin').within(() => {
            cy.get('.MuiSvgIcon-root').click();
      });
      cy.get('@windowOpen').should('be.called');
    });
  });
    
  });

  it('Clicking on Sign Up should navigate to the registration page', () => {
      cy.get('.group').within(() => {
          cy.contains('Sign Up').click();
      });
      cy.url().should('eq', 'http://localhost:3000/register');
  });
});
