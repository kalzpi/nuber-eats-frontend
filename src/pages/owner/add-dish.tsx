import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
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
  [key: string]: string;
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
    setValue,
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
    const { name, price, description, ...rest } = getValues();
    const optionObjs = optionsNumber.map((theId) => ({
      name: rest[`optionName-${theId}`],
      extraPrice: +rest[`optionExtra-${theId}`],
    }));
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: optionObjs,
        },
      },
    });
    history.goBack();
  };

  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };
  const onDeleteOptionClick = (optionId: number) => {
    setOptionsNumber((cur) => cur.filter((id) => id !== optionId));
    // setValue(`optionName-${optionId}`, '');
    // setValue(`optionExtra-${optionId}`, '');
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
        <div className='my-10'>
          <h4 className='font-medium mb-3 text-lg'>Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className='cursor-pointer text-white bg-gray-800 py-1 px-2 mt-4'
          >
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className='mt-5'>
                <input
                  ref={register({ required: 'Option name is required' })}
                  type='text'
                  name={`optionName-${id}`}
                  placeholder='Option name'
                  className='py-2 px-4 focus:outline-none focus:border-gray-600 border-2'
                />
                <input
                  ref={register}
                  type='number'
                  min={0}
                  name={`optionExtra-${id}`}
                  placeholder='Extra Price'
                  className='py-2 px-4 focus:outline-none focus:border-gray-600 border-2'
                />
                <span
                  onClick={() => onDeleteOptionClick(id)}
                  className='cursor-pointer text-white bg-red-500 ml-3 py-1 px-2'
                >
                  Delete
                </span>
              </div>
            ))}
        </div>
        <Button
          actionText='Create Dish'
          loading={loading}
          canClick={formState.isValid}
        />
      </form>
    </div>
  );
};
