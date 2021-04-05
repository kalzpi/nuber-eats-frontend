import { gql, useQuery } from '@apollo/client';

import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { myRestaurantsQuery } from '../../__generated/myRestaurantsQuery';

const MY_RESTAURANTS_QUERY = gql`
  query myRestaurantsQuery {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants: React.FC = () => {
  const { data } = useQuery<myRestaurantsQuery>(MY_RESTAURANTS_QUERY);
  const history = useHistory();

  return (
    <div className='container mt-32'>
      <Helmet>My Restaurants | Nuber eats</Helmet>
      <h2 className='text-4xl font-medium mb-10'>My Restaurants</h2>
      {data?.myRestaurants.ok && data.myRestaurants.restaurants?.length === 0 && (
        <Fragment>
          <h4 className='text-xl mb-5'>You have no restaurants</h4>
          <Link
            className='text-lime-600 hover:underline'
            to='/create-restaurant'
          >
            Click here to create a new restaurant! &rarr;
          </Link>
        </Fragment>
      )}
    </div>
  );
};
