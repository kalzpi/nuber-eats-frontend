/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MyRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: myRestaurant
// ====================================================

export interface myRestaurant_myRestaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface myRestaurant_myRestaurant_restaurant_menu_options_choices {
  __typename: "DishChoice";
  name: string;
  extraPrice: number | null;
}

export interface myRestaurant_myRestaurant_restaurant_menu_options {
  __typename: "DishOption";
  name: string;
  extraPrice: number | null;
  choices: myRestaurant_myRestaurant_restaurant_menu_options_choices[] | null;
}

export interface myRestaurant_myRestaurant_restaurant_menu {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: myRestaurant_myRestaurant_restaurant_menu_options[] | null;
}

export interface myRestaurant_myRestaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: myRestaurant_myRestaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  menu: myRestaurant_myRestaurant_restaurant_menu[];
}

export interface myRestaurant_myRestaurant {
  __typename: "MyRestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: myRestaurant_myRestaurant_restaurant | null;
}

export interface myRestaurant {
  myRestaurant: myRestaurant_myRestaurant;
}

export interface myRestaurantVariables {
  myRestaurantInput: MyRestaurantInput;
}
