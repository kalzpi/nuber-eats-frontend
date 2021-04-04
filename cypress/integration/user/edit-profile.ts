describe('Edit Pofile', () => {
  const user = cy;

  beforeEach(() => {
    // @ts-ignore
    user.login('react3@test.com', '1234');
    user.wait(1000);
  });

  it('can go to /edit-profile using the header', () => {
    user
      .get('a[href="/edit-profile"]')
      .click()
      .title()
      .should('eq', 'Edit Profile | Nuber eats');
  });
  it('can change email', () => {
    user.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'editProfileMutation') {
        req.body.variables.editProfileInput.email = 'react3@test.com';
      }
      console.log(req.body);
    });
    user.get('a[href="/edit-profile"]').click();
    user.findByPlaceholderText(/email/i).clear().type('new@test.com');
    user.findByRole('button').click();
  });
});
