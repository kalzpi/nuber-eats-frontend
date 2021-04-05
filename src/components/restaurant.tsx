import React from 'react';
import { Link } from 'react-router-dom';

interface IRestaurantProps {
  id: string;
  coverImage: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImage,
  name,
  categoryName,
}) => {
  return (
    <Link to={`restaurant/${id}`}>
      <div className='flex flex-col'>
        <div
          className='py-28 bg-center bg-cover mb-2'
          style={{ backgroundImage: `url(${coverImage})` }}
        ></div>
        <h3 className='text-lg font-semibold'>{name}</h3>
        <span className='border-t py-2 mt-3 border-gray-200 text-xs opacity-50'>
          {categoryName}
        </span>
      </div>
    </Link>
  );
};
