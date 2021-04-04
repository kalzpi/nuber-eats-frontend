import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import {
  restaurantQuery,
  restaurantQueryVariables,
} from '../../__generated/restaurantQuery';

interface IRestaurantParams {
  id: string;
}

const RESTAURANT_QUERY = gql`
  query restaurantQuery($restaurantInput: RestaurantInput!) {
    restaurant(input: $restaurantInput) {
      error
      ok
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const RestaurantDetail: React.FC = () => {
  const params = useParams<IRestaurantParams>();

  const { data, loading } = useQuery<restaurantQuery, restaurantQueryVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        restaurantInput: {
          restaurantId: +params.id,
        },
      },
    }
  );
  return (
    <div>
      <div
        className='bg-gray-500 bg-center bg-cover py-40'
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
        }}
      >
        <div className='bg-white py-8 w-4/12 pl-32'>
          <h4 className='text-2xl font-semibold mb-2'>
            {data?.restaurant.restaurant?.name}
          </h4>
          <h5 className='text-xs font-extralight mb-1'>
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className='text-xs font-extralight'>
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
    </div>
  );
};
