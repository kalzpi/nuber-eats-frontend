import React from 'react';

interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  extraPrice?: number | null;
  addOptionToItem: (dishId: number, optionName: any) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
  dishId: number;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  dishId,
  isSelected,
  name,
  extraPrice,
  addOptionToItem,
  removeOptionFromItem,
}) => {
  const onClick = () => {
    if (isSelected) {
      return removeOptionFromItem(dishId, name);
    } else {
      return addOptionToItem(dishId, name);
    }
  };
  return (
    <span
      onClick={onClick}
      className={`flex items-center border border-gray-50 ${
        isSelected && 'border-gray-700'
      }`}
    >
      <h6 className='mr-2'>{name}</h6>
      {extraPrice && <h6 className='text-sm opacity-75'>({extraPrice})</h6>}
    </span>
  );
};
