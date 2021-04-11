import React, { Fragment, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
  restaurantQuery,
  restaurantQueryVariables,
  restaurantQuery_restaurant_restaurant_menu_options,
} from '../../__generated/restaurantQuery';
import { Dish } from '../../components/dish';
import { CreateOrderItemInput } from '../../__generated/globalTypes';
import { DishOption } from '../../components/dish-option';
import {
  createOrder,
  createOrderVariables,
} from '../../__generated/createOrder';

interface IRestaurantParams {
  id: string;
}

const RESTAURANT_QUERY = gql`
  query restaurantQuery($restaurantInput: RestaurantInput!) {
    restaurant(input: $restaurantInput) {
      error
      ok
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      error
      ok
      orderId
    }
  }
`;

export const RestaurantDetail: React.FC = () => {
  const params = useParams<IRestaurantParams>();

  const { data, loading } = useQuery<restaurantQuery, restaurantQueryVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        restaurantInput: {
          restaurantId: +params.id,
        },
      },
    }
  );

  const [orderStarted, setOrderStarted] = useState(false);

  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

  const triggerStartOrder = () => {
    setOrderStarted(true);
  };

  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };

  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };

  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };

  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };
  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };
  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((oldOption) => oldOption.name === optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...current,
        ]);
      }
    }
  };

  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
        ...current,
      ]);
    }
  };
  const history = useHistory();
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (ok) {
      alert('order created');
      history.push(`/orders/${orderId}`);
    }
  };

  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, { onCompleted });

  const triggerConfirmOrder = () => {
    if (orderItems.length === 0) {
      alert("Can't place emtpy order");
      return;
    }
    const ok = window.confirm('You are about to place an order');
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
  };

  return (
    <div>
      <div
        className='bg-gray-500 bg-center bg-cover py-28'
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
        }}
      >
        <div className='bg-white py-8 w-4/12 pl-32'>
          <h4 className='text-2xl font-semibold mb-2'>
            {data?.restaurant.restaurant?.name}
          </h4>
          <h5 className='text-xs font-extralight mb-1'>
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className='text-xs font-extralight'>
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className='container mt-10 flex flex-col items-end'>
        {!orderStarted && (
          <button onClick={triggerStartOrder} className='btn px-5'>
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className='flex items-center'>
            <button
              onClick={triggerCancelOrder}
              className='btn px-5 bg-black text-white mr-2'
            >
              Cancel Order
            </button>
            <button onClick={triggerConfirmOrder} className='btn px-5'>
              Confirm Order
            </button>
          </div>
        )}

        {data?.restaurant.restaurant?.menu.length === 0 ? (
          <span className='text-xl mb-5'>Please upload a dish</span>
        ) : (
          <div className='w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10'>
            {data?.restaurant.restaurant?.menu.map((item) => (
              <Dish
                id={item.id}
                isSelected={isSelected(item.id)}
                orderStarted={orderStarted}
                addItemToOrder={addItemToOrder}
                removeFromOrder={removeFromOrder}
                key={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                isCustomer={true}
                options={item.options}
              >
                {item.options?.map((option, index) => (
                  <DishOption
                    key={index}
                    dishId={item.id}
                    addOptionToItem={addOptionToItem}
                    removeOptionFromItem={removeOptionFromItem}
                    isSelected={isOptionSelected(item.id, option.name)}
                    name={option.name}
                    extraPrice={option.extraPrice}
                  />
                ))}
              </Dish>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
