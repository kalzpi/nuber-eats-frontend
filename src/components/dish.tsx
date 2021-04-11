import React from 'react';
import { restaurantQuery_restaurant_restaurant_menu_options } from '../__generated/restaurantQuery';

interface IDishProps {
  id?: number;
  name: string;
  price: number;
  description: string;
  isCustomer?: boolean;
  orderStarted?: boolean;
  isSelected?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  options?: restaurantQuery_restaurant_restaurant_menu_options[] | null;
}
export const Dish: React.FC<IDishProps> = ({
  id = 0,
  name,
  price,
  description,
  isCustomer = false,
  orderStarted = false,
  options,
  isSelected = false,
  addItemToOrder,
  removeFromOrder,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      } else if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };
  return (
    <div
      className={`py-15 px-8 pt-4 pb-8 border hover:border-gray-800 transition-all cursor-pointer ${
        isSelected && 'border-lime-500 bg-lime-50'
      }`}
    >
      <div className='mb-5'>
        <h3 className='text-lg font-semibold flex justify-between items-center'>
          {name}
          {orderStarted && (
            <button className='btn py-1 px-2 text-sm' onClick={onClick}>
              {isSelected ? 'Remove' : 'Add'}
            </button>
          )}
        </h3>
        <h4 className='font-medium'>{description}</h4>
      </div>
      <span className=''>{price}</span>
      {isCustomer && options && options.length !== 0 && (
        <div className='mt-3'>
          <h5 className='my-3 font-medium'>Dish Options</h5>
          {dishOptions}
        </div>
      )}
    </div>
  );
};
