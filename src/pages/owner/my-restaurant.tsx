import React, { Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
  myRestaurant,
  myRestaurantVariables,
} from '../../__generated/myRestaurant';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($myRestaurantInput: MyRestaurantInput!) {
    myRestaurant(input: $myRestaurantInput) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        myRestaurantInput: {
          id: +id,
        },
      },
    }
  );
  console.log(data);
  return (
    <Fragment>
      <div
        className='bg-gray-500 bg-center bg-cover py-20'
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`,
        }}
      ></div>

      <Helmet>{data?.myRestaurant.restaurant?.name + ' | Nuber eats'}</Helmet>
      <div className='container mt-4'>
        <span className='text-2xl font-semibold mb'>
          {data?.myRestaurant.restaurant?.name}
        </span>
        <div className='flex mt-2'>
          <Link
            to={`/restaurant/${id}/add-dish`}
            className='mr-8 text-white bg-gray-800 py-3 px-10'
          >
            Add Dish &rarr;
          </Link>
          <Link to={''} className='text-white bg-lime-600 py-3 px-10'>
            Buy Promotion &rarr;
          </Link>
        </div>
        <div className='mt-10'>
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <span className='text-xl mb-5'>Please upload a dish</span>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
};
