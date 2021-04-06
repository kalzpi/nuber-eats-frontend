import React from 'react';
interface IDishProps {
  name: string;
  price: number;
  description: string;
}
export const Dish: React.FC<IDishProps> = ({ name, price, description }) => {
  return (
    <div className='py-15 px-8 pt-4 pb-8 border hover:border-gray-800 transition-all'>
      <div className='mb-5'>
        <h3 className='text-lg font-semibold'>{name}</h3>
        <h4 className='font-medium'>{description}</h4>
      </div>
      <span className=''>{price}</span>
    </div>
  );
};
