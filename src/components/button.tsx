import classNames from 'classnames';
import React from 'react';

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => {
  const className = classNames(
    'text-white py-3 mt-2 transition-colors text-lg font-medium focus:outline-none',
    loading ? '' : '',
    canClick
      ? 'bg-lime-500 hover:bg-lime-600'
      : 'bg-gray-300 pointer-events-none'
  );
  return (
    <button className={className}>{loading ? 'Loading' : actionText}</button>
  );
};
