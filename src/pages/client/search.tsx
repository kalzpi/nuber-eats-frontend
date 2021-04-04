import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router';
import { Restaurant } from '../../components/restaurant';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import {
  searchRestaurant,
  searchRestaurantVariables,
} from '../../__generated/searchRestaurant';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($searchRestaurantInput: SearchRestaurantInput!) {
    searchRestaurant(input: $searchRestaurantInput) {
      error
      ok
      totalPages
      page
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface ISearchFormProps {
  searchTerm: string;
}

export const Search: React.FC = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const history = useHistory();
  const [queryCall, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const query = location.search.split('?term=')[1];
    console.log(query);
    if (!query) {
      return history.replace('/');
    }
    queryCall({
      variables: {
        searchRestaurantInput: {
          page: 1,
          query,
        },
      },
    });
  }, [history, location, queryCall]);

  const { register, handleSubmit, getValues } = useForm<ISearchFormProps>();

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();

    history.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    });
  };

  console.log(data);
  const onNextPageClick = () => {
    setPage((cur) => cur + 1);
  };
  const onPreviousPageClick = () => {
    setPage((cur) => cur - 1);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <form
        className='bg-gray-800 w-full py-40 flex justify-center items-center'
        onSubmit={handleSubmit(onSearchSubmit)}
      >
        <input
          ref={register({ required: true, min: 3 })}
          name='searchTerm'
          type='Search'
          placeholder='Search restaurants...'
          className='input rounded-md border-0 w-3/4 md:w-3/12'
        />
      </form>
      <div className='max-w-screen-xl mx-auto mt-8'>
        <div className='grid md:grid-cols-3 gap-y-10 gap-x-5 mt-10 overflow-hidden'>
          {data?.searchRestaurant.restaurants &&
            data?.searchRestaurant.restaurants.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id.toString()}
                name={restaurant.name}
                coverImage={restaurant.coverImage}
                categoryName={restaurant.category?.name}
              />
            ))}
        </div>
        <div className='flex justify-center items-center mt-10'>
          {page > 1 && (
            <button
              onClick={onPreviousPageClick}
              className='focus:outline-none font-semibold text-2xl'
            >
              &larr;
            </button>
          )}
          <span className='mx-5'>
            Page {page} of {data?.searchRestaurant.totalPages}
          </span>
          {page !== data?.searchRestaurant.totalPages && (
            <button
              onClick={onNextPageClick}
              className='focus:outline-none font-semibold text-2xl'
            >
              &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
