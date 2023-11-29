describe('User API Operations', () => {
  describe('POST /users', () => {
    it('should create a user with valid details', () => {
      cy.request('POST', 'http://localhost:4000/users/register', {
        name: 'Johhn Doe',
        email: 'johhne@example.com',
        _id: '1',
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', 'Johhn Doe');
      });
    });

    it('should not create a user with an existing email', () => {
      // Assuming 'johhne@example.com' already exists
      cy.request({
        method: 'POST',
        url: 'http://localhost:4000/users/register',
        failOnStatusCode: false,
        body: {
          name: 'Jaane Doe',
          email: 'johhne@example.com',
          _id: '2',
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

});