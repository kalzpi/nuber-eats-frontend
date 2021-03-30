import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <Helmet>
        <title>Not Found | Nuber eats</title>
      </Helmet>
      <h2 className='text-2xl font-bold mb-3'>Page not found</h2>
      <h4 className='text-lg mb-2'>
        The page you're looking for does not exist or has moved.
      </h4>
      <Link className='hover:underline text-lime-600' to='/'>
        Go to home
      </Link>
    </div>
  );
};
