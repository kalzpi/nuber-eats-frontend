describe('Sign Up', () => {
  const user = cy;
  it('should see signup page', () => {
    user
      .visit('/')
      .get('.text-lime-500')
      .click()
      .title()
      .should('eq', 'Signup | Nuber eats');
  });

  it('should see email / password validation error', () => {
    user
      .visit('/')
      .get('.text-lime-500')
      .click()
      .get('[name="email"]')
      .type('wont@work')
      .get('.fomr-medium')
      .should('have.text', 'Please enter a valid email')
      .get('[name="email"]')
      .clear()
      .get('.fomr-medium')
      .should('have.text', 'Email is required')
      .get('[name="email"]')
      .type('react3@test.com')
      .get('[name="password"]')
      .type('123')
      .get('.fomr-medium')
      .should('have.text', 'Password must be more than 4 chars.')
      .get('[name="password"]')
      .clear()
      .get('.fomr-medium')
      .should('have.text', 'Password is required');
  });

  it('should be able to create account', () => {
    user.intercept('http://localhost:4000/graphql', (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === 'createAccountMutation') {
        req.reply((res) => {
          res.send({
            fixture: 'auth/signup.json',
          });
        });
      }
    });

    user
      .visit('/signup')
      .get('[name="email"]')
      .type('realmail2@test.com')
      .get('[name="password"]')
      .type('realmail2@test.com');
    user
      .findByRole('button')
      .click()
      .wait(1500)
      // @ts-ignore
      .login('realmail2@test.com', 'realmail2@test.com');
  });
});
