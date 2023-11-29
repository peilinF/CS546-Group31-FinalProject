describe('User Profile', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    
    cy.window().then((window) => {
      const dbNames = ['firebaseLocalStorageDb']; 
      dbNames.forEach(dbName => {
        window.indexedDB.deleteDatabase(dbName);
      });
    });
    

    cy.visit('http://localhost:3000/login');
    cy.intercept('POST', '**/identitytoolkit/**').as('firebaseAuth');
    cy.get('input[type="text"]').type('test@example.com');
    cy.get('input[type="password"]').type('Password@123');
    cy.get('form').submit();
    cy.url().should('include', '/');
    cy.get('.welcome').click();
    cy.url().should('include', '/profile');
  });


  
  beforeEach(() => {
    cy.url().then((url) => {
      if (!url.includes('/profile')) {
        cy.visit('http://localhost:3000/profile');
      }
    });
  });


  // afterEach(() => {
  //   cy.request('POST', 'http://localhost:4000/users/profile/register', {
  //     userId: 'userId',
  //     name: 'testuser',
  //     email: 'test@example.com'
  //   });
  // });


  // it('displays the username and email information on the profile page', () => {
  //   cy.get('.user-profile h2').should('contain', 'testuser');
  //   cy.get('.user-profile p').should('contain', 'test@example.com');
  // });



  it('allows the user to change their profile picture and username', () => {
    cy.contains('Edit Profile').click();
    cy.get('.ant-modal').should('be.visible');
    cy.get('input[name="imageURL"]').should('exist').attachFile('profileImgTest.jpg');
    cy.get('input[placeholder="Name"]').clear().type('newusername');
    cy.contains('button', 'OK').click();
    cy.wait(1000);
    cy.get('.user-profile').should('contain', 'newusername');
  });




  it('navigates through paginated events', () => {
    cy.url().should('include', '/profile');
    
    cy.contains('Events').click();
    cy.wait(1000); 
    //cy.get('Tabs.TabPane[tab="Events"]').click();

    cy.get('.ant-pagination').should('exist');
    //cy.get('.ant-pagination').should('be.visible');
    cy.get('.ant-pagination').find('li').contains('2').click();
    cy.wait(1000); 

    cy.get('.event-by-date-card').should('have.length', 10);
  });
  



  it('navigates through paginated comments', () => {
    cy.url().should('include', '/profile');

    cy.contains('Comments').click();
    cy.wait(1000);
  
    cy.get('.ant-pagination').should('exist');
    cy.get('.ant-pagination').find('li').contains('2').click({ force: true });

    cy.wait(1000);
  
    cy.get('.event-by-date-card').should('have.length', 20);
  });
});
