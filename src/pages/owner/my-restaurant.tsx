import React, { Fragment, useEffect } from 'react';
import { gql, useQuery, useSubscription } from '@apollo/client';
import { useHistory, useParams } from 'react-router';
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from '../../fragments';
import {
  myRestaurant,
  myRestaurantVariables,
} from '../../__generated/myRestaurant';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Dish } from '../../components/dish';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryPie,
  VictoryVoronoiContainer,
  VictoryLine,
  VictoryZoomContainer,
  VictoryTheme,
  VictoryLabel,
} from 'victory';
import { pendingOrders } from '../../__generated/pendingOrders';

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($myRestaurantInput: MyRestaurantInput!) {
    myRestaurant(input: $myRestaurantInput) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        myRestaurantInput: {
          id: +id,
        },
      },
    }
  );

  const { data: subscriptionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION
  );
  const history = useHistory();
  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData]);

  return (
    <Fragment>
      <div
        className='bg-gray-500 bg-center bg-cover py-20'
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`,
        }}
      ></div>

      <Helmet>{data?.myRestaurant.restaurant?.name + ' | Nuber eats'}</Helmet>
      <div className='container mt-4'>
        <span className='text-2xl font-semibold mb'>
          {data?.myRestaurant.restaurant?.name}
        </span>
        <div className='flex mt-2'>
          <Link
            to={`/restaurant/${id}/add-dish`}
            className='mr-8 text-white bg-gray-800 py-3 px-10'
          >
            Add Dish &rarr;
          </Link>
          <Link to={''} className='text-white bg-lime-600 py-3 px-10'>
            Buy Promotion &rarr;
          </Link>
        </div>
        <div className='mt-10'>
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <span className='text-xl mb-5'>Please upload a dish</span>
          ) : (
            <div className='grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10'>
              {data?.myRestaurant.restaurant?.menu.map((item) => (
                <Dish
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                />
              ))}
            </div>
          )}
        </div>
        <div className='mt-20'>
          <h4 className='text-center text-2xl font-semibold'>Sales</h4>
          <div className='max-w-screen-lg w-full mx-auto'>
            <VictoryChart
              width={window.innerWidth}
              theme={VictoryTheme.material}
              height={700}
              containerComponent={<VictoryZoomContainer />}
              domainPadding={50}
              padding={150}
            >
              <VictoryLine
                labels={({ datum }) => `KRW ${datum.y}`}
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation='natural'
                style={{ data: { strokeWidth: 3, stroke: 'blue' } }}
                labelComponent={<VictoryLabel renderInPortal dy={-10} />}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal dy={20} />}
                tickFormat={(tick) => new Date(tick).toLocaleDateString('kr')}
                style={{ tickLabels: { fontSize: 15, angle: 45 } }}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
