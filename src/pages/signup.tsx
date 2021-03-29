import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import nuberLogo from '../images/logo.svg';
import {
  createAccountMutation,
  createAccountMutationVariables,
} from '../__generated/createAccountMutation';
import { UserRole } from '../__generated/globalTypes';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ISignupForm {
  email: string;
  password: string;
  role: UserRole;
}

export const Signup = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ISignupForm>({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client,
    },
  });

  const history = useHistory();

  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      //redirect user to login page
      alert('Account Created! Log in now!');
      history.push('/');
    }
  };

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );
  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role },
        },
      });
    }
  };

  return (
    <div className='h-screen flex items-center flex-col mt-10 lg:mt-28'>
      <Helmet>
        <title>Signup | Nuber eats</title>
      </Helmet>
      <div className='w-full max-w-screen-sm flex flex-col items-center px-5'>
        <img src={nuberLogo} className='w-60 mb-5' />
        <h4 className='w-full font-semibold text-left text-3xl mb-10'>
          Let's get started
        </h4>
        <form
          className='grid gap-3 mt-5 w-full mb-3'
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            ref={register({
              required: 'Email is required',
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name='email'
            required
            type='email'
            className='input transition-colors'
            placeholder='Email'
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage={'Please enter a valid email'} />
          )}
          <input
            ref={register({ required: 'Password is required', minLength: 4 })}
            name='password'
            required
            type='password'
            className='input transition-colors'
            placeholder='Password'
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password.message} />
          )}
          {errors.password?.type === 'minLength' && (
            <FormError errorMessage='Password must be more than 4 chars.' />
          )}
          <select
            name='role'
            ref={register({ required: true })}
            className='input'
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            actionText='Sign Up'
            loading={loading}
            canClick={formState.isValid}
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div className=''>
          Already have an account?{' '}
          <Link to='/' className='text-lime-500 hover:underline'>
            Login
          </Link>{' '}
        </div>
      </div>
    </div>
  );
};
