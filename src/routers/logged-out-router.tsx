import React from 'react';
import { useForm } from 'react-hook-form';
import { isLoggedInVar } from '../apollo';

interface IForm {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  const { register, watch, handleSubmit, errors } = useForm<IForm>();
  const onSubmit = () => {
    console.log(watch('email'));
  };
  const onInvalid = () => {
    console.log(errors);
    console.log('Cannot do it');
  };
  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          {errors.email?.message && (
            <span className='text-red-400'>{errors.email.message}</span>
          )}
          {errors.email?.type === 'validate' && (
            <span className='text-red-400'>Only Gmail allowed</span>
          )}
          <input
            ref={register({
              required: 'This field is required.',
              validate: (email: string) => email.includes('@gmail.com'),
            })}
            type='email'
            name='email'
            placeholder='email'
          />
        </div>
        <div>
          <input
            ref={register({
              required: true,
            })}
            type='password'
            name='password'
            placeholder='password'
          />
        </div>
        <button className='bg-yellow-300 text-white'>Sumit</button>
      </form>
    </div>
  );
};
