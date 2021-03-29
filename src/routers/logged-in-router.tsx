import { useQuery, gql } from '@apollo/client';
import React from 'react';
import { meQuery } from '../__generated/meQuery';

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
  if (!data || loading || error) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <span className='font-semibold text-xl tracking-wide'>Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <h1>{data.me.role}</h1>
    </div>
  );
};
