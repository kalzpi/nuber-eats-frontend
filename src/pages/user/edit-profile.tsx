import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { useMe } from '../../hooks/useMe';
import {
  editProfileMutation,
  editProfileMutationVariables,
} from '../../__generated/editProfileMutation';

interface IFormProps {
  email?: string;
  password?: string;
}

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfileMutation($editProfileInput: EditProfileInput!) {
    editProfile(input: $editProfileInput) {
      ok
      error
    }
  }
`;

export const EditProfile = () => {
  const { data: userData, refetch } = useMe();
  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    defaultValues: {
      email: userData?.me.email,
    },
    mode: 'onChange',
  });

  const client = useApolloClient();
  const onCompleted = async (data: editProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              email
              isVerified
            }
          `,
          data: {
            email: newEmail,
            isVerified: false,
          },
        });
      }
    }
  };
  const [editProfileMutation, { loading, data }] = useMutation<
    editProfileMutation,
    editProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfileMutation({
      variables: {
        editProfileInput: {
          email,
          ...(password !== '' && { password }),
        },
      },
    });
  };
  return (
    <div className='mt-52 flex flex-col justify-center items-center'>
      <Helmet>
        <title>Edit Profile | Nuber eats</title>
      </Helmet>
      <h4 className='font-semibold text-2xl mb-3'>Edit Profile</h4>
      <form
        action=''
        className='grid max-w-screen-sm gap-3 mt-5 mb-5 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          ref={register({
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name='email'
          type='email'
          placeholder='Email'
          className='input'
        />
        <input
          ref={register}
          name='password'
          type='password'
          placeholder='Password'
          className='input'
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText='Save Profile'
        />
      </form>
    </div>
  );
};
