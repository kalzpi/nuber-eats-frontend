import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { Category } from '../pages/client/category';
import { Restaurants } from '../pages/client/restaurants';
import { Search } from '../pages/client/search';
import { RestaurantDetail } from '../pages/client/restaurant';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { CreateRestaurant } from '../pages/owner/create-restaurant';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { AddDish } from '../pages/owner/add-dish';
import { Order } from '../pages/order';

const clientRoutes = [
  { path: '/', component: <Restaurants /> },
  { path: '/search', component: <Search /> },
  { path: '/category/:slug', component: <Category /> },
  { path: '/restaurant/:id', component: <RestaurantDetail /> },
];

const commonRoutes = [
  { path: '/confirm', component: <ConfirmEmail /> },
  { path: '/edit-profile', component: <EditProfile /> },
  { path: '/orders/:id', component: <Order /> },
];

const ownerRoutes = [
  { path: '/', component: <MyRestaurants /> },
  { path: '/create-restaurant', component: <CreateRestaurant /> },
  { path: '/restaurant/:id', component: <MyRestaurant /> },
  { path: '/restaurant/:restaurantId/add-dish', component: <AddDish /> },
];

export const LoggedInRouter: React.FC = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <span className='font-semibold text-xl tracking-wide'>Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === 'Client' &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {data.me.role === 'Owner' &&
          ownerRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} exact>
            {route.component}
          </Route>
        ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
