import { useQuery, gql } from '@apollo/client';
import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { Restaurants } from '../pages/client/restaurants';
import { meQuery } from '../__generated/meQuery';

const ClientRoutes = [
  <Route path='/' exact>
    <Restaurants />
  </Route>,
];

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      isVerified
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
  console.log(data?.me.role);
  if (!data || loading || error) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <span className='font-semibold text-xl tracking-wide'>Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Switch>
        {data.me.role === 'Client' && ClientRoutes}
        <Redirect to='/' />
      </Switch>
    </Router>
  );
};
