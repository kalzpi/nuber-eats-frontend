import React from 'react';

interface IFormErrorProps {
  errorMessage: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => {
  return (
    <span role='alert' className='fomr-medium text-red-400'>
      {errorMessage}
    </span>
  );
};
