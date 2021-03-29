import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import Helmet from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import nuberLogo from '../images/logo.svg';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated/loginMutation';

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
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
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ILoginForm>({
    mode: 'onChange',
  });
  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      console.log(token);
      isLoggedInVar(true);
    }
  };

  const [loginMutation, { loading, data: loginMutationResult }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className='h-screen flex items-center flex-col mt-10 lg:mt-28'>
      <Helmet>
        <title>Login | Nuber eats</title>
      </Helmet>
      <div className='w-full max-w-screen-sm flex flex-col items-center px-5'>
        <img src={nuberLogo} alt='' className='w-60 mb-5' />
        <h4 className='w-full font-semibold text-left text-3xl mb-10'>
          Welcome back
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
          <Button
            actionText='Log In'
            loading={loading}
            canClick={formState.isValid}
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult?.login.error} />
          )}
        </form>
        <div className=''>
          New to Nuber?{' '}
          <Link to='/signup' className='text-lime-500 hover:underline'>
            Create an account
          </Link>{' '}
        </div>
      </div>
    </div>
  );
};
