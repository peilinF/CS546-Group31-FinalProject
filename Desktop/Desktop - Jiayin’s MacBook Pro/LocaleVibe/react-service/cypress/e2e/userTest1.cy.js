describe('User API Operations', () => {
  describe('User Validation', () => {
    // Test for Email validation
    it('should fail to create a user with invalid email', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:4000/users/register',
        failOnStatusCode: false,
        body: {
          name: 'Invalid Email User',
          email: 1234502, // Invalid email
          _id: '3',
        },
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    // Test updating a user with invalid id
    it('should fail to update a user with invalid id', () => {
      cy.request({
        method: 'PATCH',
        url: 'http://localhost:4000/users/invalidid', // Invalid ID
        failOnStatusCode: false,
        body: {
          name: 'Should Fail',
        },
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 500]);
      });
    });

  });

});

