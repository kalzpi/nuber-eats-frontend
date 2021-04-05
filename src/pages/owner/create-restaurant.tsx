import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
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
  file: FileList;
}

export const CreateRestaurant = () => {
  const onCompleted = (data: createRestaurantMutation) => {
    const {
      createRestaurant: { ok, error },
    } = data;
    if (ok) {
      setUploading(false);
    }
  };

  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurantMutation,
    createRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, { onCompleted });

  const [uploading, setUploading] = useState<boolean>(false);

  const {
    register,
    getValues,
    formState,
    errors,
    handleSubmit,
  } = useForm<IFormProps>({ mode: 'onChange' });

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append('file', actualFile);
      const { url: coverImage } = await (
        await fetch('http://localhost:4000/uploads', {
          method: 'POST',
          body: formBody,
        })
      ).json();
      createRestaurantMutation({
        variables: {
          createRestaurantInput: {
            name,
            categoryName,
            address,
            coverImage,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container flex flex-col items-center mt-32'>
      <Helmet>Create Restaurant | Nuber eats</Helmet>
      <h1 className=''>Add Restaurant</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5'
      >
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
        <div className=''>
          <input
            ref={register({ required: true })}
            type='file'
            name='file'
            className=''
            accept='image/'
          />
        </div>
        <Button
          loading={uploading}
          actionText='Create Restaurant'
          canClick={formState.isValid}
        />
        {data?.createRestaurant.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
