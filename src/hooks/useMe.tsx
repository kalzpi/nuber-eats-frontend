import { gql, useQuery } from '@apollo/client';
import { meQuery } from '../__generated/meQuery';

export const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      isVerified
    }
  }
`;

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY);
};
