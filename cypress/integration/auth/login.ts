describe('Log In', () => {
  const user = cy;
  it('should see login page', () => {
    user.visit('/').title().should('eq', 'Login | Nuber eats');
  });

  it('can see email / password validation errors', () => {
    user.visit('/');
    user.findByPlaceholderText(/email/i).type('bad@email');
    user.findByRole('alert').should('have.text', 'Please enter a valid email');
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole('alert').should('have.text', 'Email is required');
    user.findByPlaceholderText(/email/i).type('owner@test.com');
    user.findByPlaceholderText(/password/i).type('123');
    user
      .findByRole('alert')
      .should('have.text', 'Password must be more than 4 chars.');
    user.findByPlaceholderText(/password/i).clear();
    user.findByRole('alert').should('have.text', 'Password is required');
  });

  it('can fill out the form', () => {
    // @ts-ignore
    user.login('react3@test.com', '1234');
  });
});
