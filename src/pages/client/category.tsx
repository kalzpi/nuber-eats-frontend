import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
  categoryQuery,
  categoryQueryVariables,
} from '../../__generated/categoryQuery';

interface ICategoryParams {
  slug: string;
}

const CATEGORY_QUERY = gql`
  query categoryQuery($categoryInput: CategoryInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    category(input: $categoryInput) {
      error
      ok
      totalPages
      totalItems
      page
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Category: React.FC = () => {
  const [page, setPage] = useState(1);
  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<categoryQuery, categoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        categoryInput: {
          page,
          slug: params.slug,
        },
      },
    }
  );
  const onNextPageClick = () => {
    setPage((cur) => cur + 1);
  };
  const onPreviousPageClick = () => {
    setPage((cur) => cur - 1);
  };

  return (
    <div>
      <Helmet>
        <title>Category | Nuber Eats</title>
      </Helmet>
      <div className='max-w-screen-xl mx-auto mt-8'>
        <ScrollContainer className='scroll-container flex md:justify-around max-w-sm md:max-w-full mx-auto'>
          {data?.allCategories.categories?.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`}>
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
            </Link>
          ))}
        </ScrollContainer>
        <div className='grid md:grid-cols-3 gap-y-10 gap-x-5 mt-10'>
          {data?.category.restaurants &&
            data?.category.restaurants.map((restaurant) => (
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
            Page {page} of {data?.category.totalPages}
          </span>
          {page !== data?.category.totalPages && (
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
