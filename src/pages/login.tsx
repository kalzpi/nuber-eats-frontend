import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated/loginMutation';

const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      ok
      error
      token
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();
  const [loginMutation, { loading, data, error }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION);
  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        email,
        password,
      },
    });
  };

  return (
    <span className='h-screen flex items-center justify-center bg-gray-800'>
      <div className='bg-white w-full max-w-lg pt-5 pb-7 rounded-lg text-center'>
        <h3 className='text-2xl text-gray-800'>Log In</h3>
        <form
          className='grid gap-3 mt-5 px-5'
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            ref={register({ required: 'Email is required' })}
            name='email'
            required
            type='email'
            className='input'
            placeholder='Email'
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          <input
            ref={register({ required: 'Password is required', minLength: 5 })}
            name='password'
            required
            type='password'
            className='input'
            placeholder='Password'
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password.message} />
          )}
          {errors.password?.type === 'minLength' && (
            <FormError errorMessage='Password must be more than 5 chars.' />
          )}
          <button className='btn'>Log in</button>
        </form>
      </div>
    </span>
  );
};
