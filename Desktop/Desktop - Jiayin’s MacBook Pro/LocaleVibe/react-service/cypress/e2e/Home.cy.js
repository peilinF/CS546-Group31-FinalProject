context('Navigation', () => {
    beforeEach(() => {
      cy.visit('localhost:3000')
      cy.get('button').contains('Login').click()
    })

    it('cy.reload() - reload the page', () => {
      cy.reload()
  
      // reload the page without using the cache
      cy.reload(true)
    })
  
    it('cy.visit() - visit the login page', () => {
      // Visit any sub-domain of your current domain
  
      // Pass options to the visit
      cy.visit('localhost:3000/login', {
        timeout: 50000, // increase total time for the visit to resolve
        onBeforeLoad (contentWindow) {
          // contentWindow is the remote page's window object
          expect(typeof contentWindow === 'object').to.be.true
        },
        onLoad (contentWindow) {
          // contentWindow is the remote page's window object
          expect(typeof contentWindow === 'object').to.be.true
        },
      })
    })

    it('cy.visit() - visit the home page', () => {
    // Visit any sub-domain of your current domain

    // Pass options to the visit
    cy.visit('localhost:3000', {
        timeout: 50000, // increase total time for the visit to resolve
        onBeforeLoad (contentWindow) {
        // contentWindow is the remote page's window object
        expect(typeof contentWindow === 'object').to.be.true
        },
        onLoad (contentWindow) {
        // contentWindow is the remote page's window object
        expect(typeof contentWindow === 'object').to.be.true
        },
    })
    })
})
  