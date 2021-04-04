import { ApolloProvider } from '@apollo/client';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import { Login } from '../login';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { LOGIN_MUTATION } from '../login';

describe('<Login />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <HelmetProvider>
          <BrowserRouter>
            <ApolloProvider client={mockedClient}>
              <Login />
            </ApolloProvider>
          </BrowserRouter>
        </HelmetProvider>
      );
    });
  });
  it('should render OK', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Login | Nuber eats');
    });
  });
  it('displays email validation errors', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    await waitFor(() => {
      userEvent.type(email, 'this@wont');
    });
    let errorMessgae = getByRole('alert');
    expect(errorMessgae).toHaveTextContent('Please enter a valid email');
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessgae = getByRole('alert');
    expect(errorMessgae).toHaveTextContent(/email is required/i);
  });

  it('displays password required errors', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole('button');
    await waitFor(() => {
      userEvent.type(email, 'test@test.com');
      userEvent.click(submitBtn);
    });
    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('Password is required');
  });

  it('submits form and calls mutation', async () => {
    const formData = {
      email: 'test@test.com',
      password: '1234',
    };
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole('button');

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: { ok: true, token: 'XXX', error: 'mutation-error' },
      },
    });

    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    jest.spyOn(Storage.prototype, 'setItem');
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });

    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });
    const errorMessage = getByRole('alert');

    expect(errorMessage).toHaveTextContent('mutation-error');
    expect(localStorage.setItem).toHaveBeenCalledWith('nuber-token', 'XXX');
  });
});
