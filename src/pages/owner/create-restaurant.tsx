import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import {
  createRestaurantMutation,
  createRestaurantMutationVariables,
} from '../../__generated/createRestaurantMutation';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurantMutation(
    $createRestaurantInput: CreateRestaurantInput!
  ) {
    createRestaurant(input: $createRestaurantInput) {
      error
      ok
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

export const CreateRestaurant = () => {
  const [createRestaurantMutation, { loading, data }] = useMutation<
    createRestaurantMutation,
    createRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION);

  const {
    register,
    getValues,
    formState,
    errors,
    handleSubmit,
  } = useForm<IFormProps>({ mode: 'onChange' });
  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <div className='container'>
      <Helmet>Create Restaurant | Nuber eats</Helmet>
      <h1 className=''>Add Restaurant</h1>
      <form onSubmit={handleSubmit(onSubmit)} className=''>
        <input
          name='name'
          placeholder='Name'
          ref={register({ required: 'Name is required' })}
          type='text'
          className='input'
        />
        <input
          name='address'
          placeholder='Address'
          ref={register({ required: 'Address is required' })}
          type='text'
          className='input'
        />
        <input
          name='categoryName'
          placeholder='Category Name'
          ref={register({ required: 'Category Name is required' })}
          type='text'
          className='input'
        />
        <Button
          loading={loading}
          actionText='Create Restaurant'
          canClick={formState.isValid}
        />
      </form>
    </div>
  );
};
