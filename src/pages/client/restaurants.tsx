import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useHistory } from 'react-router';
import { Restaurant } from '../../components/restaurant';
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from '../../__generated/restaurantsPageQuery';

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($restaurantsInput: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }
    restaurants(input: $restaurantsInput) {
      ok
      error
      totalPages
      totalItems
      items {
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      restaurantsInput: {
        page,
      },
    },
  });
  const onNextPageClick = () => {
    setPage((cur) => cur + 1);
  };
  const onPreviousPageClick = () => {
    setPage((cur) => cur - 1);
  };
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    });
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className='bg-gray-800 w-full py-40 flex justify-center items-center'
      >
        <input
          ref={register({ required: true, min: 3 })}
          name='searchTerm'
          type='Search'
          placeholder='Search restaurants...'
          className='input rounded-md border-0 w-3/4 md:w-3/12'
        />
      </form>
      {!loading && (
        <div className='max-w-screen-xl mx-auto mt-8'>
          <ScrollContainer className='scroll-container flex md:justify-around max-w-sm md:max-w-full mx-auto'>
            {data?.allCategories.categories?.map((category) => (
              <div
                key={category.id}
                className='flex flex-col group items-center cursor-pointer mx-3'
              >
                <div
                  className='w-14 h-14 bg-cover opacity-70 group-hover:opacity-100 rounded-full'
                  style={{ backgroundImage: `url(${category.coverImage})` }}
                ></div>
                <span className='text-sm mt-1'>{category.name}</span>
              </div>
            ))}
          </ScrollContainer>

          <div className='grid md:grid-cols-3 gap-y-10 gap-x-5 mt-10'>
            {data?.restaurants.items?.map((restaurant) => (
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
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages && (
              <button
                onClick={onNextPageClick}
                className='focus:outline-none font-semibold text-2xl'
              >
                &rarr;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
