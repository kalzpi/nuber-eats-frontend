import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { LOCALSTORAGE_TOKEN } from './constants';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const wsLink = new WebSocketLink({
  uri: 'wss://nuber-eats-backend1234.herokuapp.com/graphql',
  reconnect: true,
  connectionParams: {
    'x-jwt': authTokenVar() || '',
  },
});

const httpLink = createHttpLink({
  uri: 'https://nuber-eats-backend1234.herokuapp.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: { ...headers, 'x-jwt': authTokenVar() || '' },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
