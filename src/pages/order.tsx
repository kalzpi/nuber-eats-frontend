import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import React, { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { FULL_ORDER_FRAGMENT } from '../fragments';
import { useMe } from '../hooks/useMe';
import { getOrder, getOrderVariables } from '../__generated/getOrder';
import { editOrder, editOrderVariables } from '../__generated/editOrder';
import { OrderStatus, UserRole } from '../__generated/globalTypes';
import {
  orderUpdates,
  orderUpdatesVariables,
} from '../__generated/orderUpdates';

interface IParams {
  id: string;
}

const GET_ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER_MUTATION = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdateInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const Order = () => {
  const params = useParams<IParams>();
  const { data: userData } = useMe();
  const [editOrderMutation] = useMutation<editOrder, editOrderVariables>(
    EDIT_ORDER_MUTATION
  );
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER_QUERY,
    {
      variables: {
        input: {
          id: +params.id,
        },
      },
    }
  );

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +params.id,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data]);

  const onBtnClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: +params.id,
          status: newStatus,
        },
      },
    });
  };

  return (
    <div className='container mt-20 flex justify-center'>
      <Helmet>
        <title>Order #{params.id} | Nuber eats</title>
      </Helmet>
      <div className='border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center'>
        <h4 className='bg-gray-800 w-full py-5 text-white text-center text-xl'>
          Order #{params.id}
        </h4>
        <h5 className='p-5 pt-10 text-3xl text-center '>
          ${data?.getOrder.order?.total}
        </h5>
        <div className='p-5 text-xl grid gap-6'>
          <div className='border-t pt-5 border-gray-700'>
            Prepared By:{' '}
            <span className='font-medium'>
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className='border-t pt-5 border-gray-700 '>
            Deliver To:{' '}
            <span className='font-medium'>
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className='border-t border-b py-5 border-gray-700'>
            Driver:{' '}
            <span className='font-medium'>
              {data?.getOrder.order?.driver?.email || 'Not yet.'}
            </span>
          </div>
          {userData?.me.role === UserRole.Client && (
            <span className=' text-center mt-5 mb-3  text-2xl text-lime-600'>
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <Fragment>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  className='btn'
                  onClick={() => onBtnClick(OrderStatus.Cooking)}
                >
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  className='btn'
                  onClick={() => onBtnClick(OrderStatus.Cooked)}
                >
                  Order Cooked
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Pending &&
                data?.getOrder.order?.status !== OrderStatus.Cooking && (
                  <span className=' text-center mt-5 mb-3  text-2xl text-lime-600'>
                    Status: {data?.getOrder.order?.status}
                  </span>
                )}
            </Fragment>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <Fragment>
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <button
                  className='btn'
                  onClick={() => onBtnClick(OrderStatus.PickedUp)}
                >
                  Picked Up
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button
                  className='btn'
                  onClick={() => onBtnClick(OrderStatus.Delivered)}
                >
                  Delivered
                </button>
              )}
            </Fragment>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <span className=' text-center mt-5 mb-3  text-2xl text-lime-600'>
              Thank you for your service!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
