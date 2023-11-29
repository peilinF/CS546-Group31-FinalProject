describe('EventOfDate Page Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/events/date/?page=1&date=2023-11-16&state=New-Jersey&city=New-York-City'); // Adjust URL based on application's routing
    });
  
    it('successfully loads EventOfDate page', () => {
      cy.wait(10);
      it('should display the event cards', () => {
        cy.get('.event-by-date');
      });
    });
  
    it('handles pagination correctly', () => {
      // Simulate clicking on a pagination button
      // Assert that the page content updates correctly
    });
  
    it('displays data after loading', () => {
      // Wait for the loading to disappear
      // Assert that the data is displayed
    });
  
    it('handles errors gracefully', () => {
      // Simulate an error response from the server
      // Assert that the error message is displayed
    });
});