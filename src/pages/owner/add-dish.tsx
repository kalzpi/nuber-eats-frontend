import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { Button } from '../../components/button';
import { createDish, createDishVariables } from '../../__generated/createDish';
import { MY_RESTAURANT_QUERY } from './my-restaurant';

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IAddDishForm {
  name: string;
  price: string;
  description: string;
}

export const AddDish = () => {
  const history = useHistory();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<IAddDishForm>({ mode: 'onChange' });
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: { myRestaurantInput: { id: +restaurantId } },
      },
    ],
  });

  const onSubmit = () => {
    const { name, price, description } = getValues();
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
        },
      },
    });
    history.goBack();
  };
  return (
    <div className='container flex flex-col items-center mt-32'>
      <Helmet>
        <title>Add Dish | Nuber eats</title>
      </Helmet>
      <span className='font-semibold text-2xl mb-3'>Add Dish</span>
      <form
        className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5'
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          ref={register({ required: 'Name is required' })}
          type='text'
          name='name'
          className='input'
          placeholder='Name'
        />
        <input
          ref={register({ required: 'Price is required' })}
          min={0}
          type='number'
          name='price'
          className='input'
          placeholder='Price'
        />
        <input
          ref={register({ required: 'Description is required' })}
          type='text'
          name='description'
          className='input'
          placeholder='Description'
        />
        <Button
          actionText='Create Dish'
          loading={loading}
          canClick={formState.isValid}
        />
      </form>
    </div>
  );
};
