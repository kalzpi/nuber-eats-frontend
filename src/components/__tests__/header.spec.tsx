import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../header';
import { ME_QUERY } from '../../hooks/useMe';

describe('<Header />', () => {
  it('should renders OK with props', async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: '',
                    role: '',
                    isVerified: true,
                  },
                },
              },
            },
          ]}
        >
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </MockedProvider>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(queryByText('Please verify your email.')).toBeNull();
    });
  });

  it('should renders verify banner', async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: '',
                    role: '',
                    isVerified: false,
                  },
                },
              },
            },
          ]}
        >
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </MockedProvider>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText('Please verify your email.');
    });
  });
});
