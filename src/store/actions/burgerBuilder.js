import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (ingName) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: ingName
  };
}

export const remIngredient = (ingName) => {
  return {
    type: actionTypes.REM_INGREDIENT,
    ingredientName: ingName
  };
}

const sortIngredients = (dbIngredients) => {
  const sortedIngredients = {salad: 0, bacon: 0, cheese: 0, meat: 0};

  for (let i in sortedIngredients) {
    sortedIngredients[i] = dbIngredients[i]
  }

  return sortedIngredients;
}

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients
  };
}

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  }
}

export const initIngredient = () => {
  return dispatch => {
    axios.get('https://react16-burgerproject.firebaseio.com/ingredients.json')
    .then(response => {
      dispatch(setIngredients(sortIngredients(response.data)));
      //dispatch(setIngredients(response.data));
    })
    .catch(error => {
      dispatch(fetchIngredientsFailed());
    });
  }
};