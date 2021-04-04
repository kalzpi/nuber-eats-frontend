import { ApolloProvider } from '@apollo/client';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { Signup, CREATE_ACCOUNT_MUTATION } from '../signup';
import { render, waitFor, RenderResult } from '../../test-utils';
import { CreateAccountInput, UserRole } from '../../__generated/globalTypes';

const mockPush = jest.fn();

jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom');
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe('<Signup />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Signup />
        </ApolloProvider>
      );
    });
  });
  it('renders OK', async () => {
    await waitFor(() => expect(document.title).toBe('Signup | Nuber eats'));
  });
  it('renders validation errors', async () => {
    const formData: CreateAccountInput = {
      email: 'test@test.com',
      password: '1234',
      role: UserRole.Client,
    };
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole('button');

    await waitFor(() => {
      userEvent.type(email, 'wont@work');
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('Please enter a valid email');

    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('Email is required');

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.click(submitBtn);
    });

    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('Password is required');
  });
  it('submit mutation with form values', async () => {
    const formData: CreateAccountInput = {
      email: 'test@test.com',
      password: '1234',
      role: UserRole.Client,
    };
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole('button');

    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: 'mutation-error',
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    );
    jest.spyOn(window, 'alert').mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    expect(window.alert).toHaveBeenCalledWith('Account Created! Log in now!');

    const errorMessage = getByRole('alert');
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(errorMessage).toHaveTextContent('mutation-error');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
