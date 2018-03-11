import React, { Component } from 'react'
import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  state = {
    ingredients: {salad: 0, bacon: 0, cheese: 0, meat: 0},
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  /*
  Define ingredients above anyway so that we an set an order to the ingredients here
   instead of having Firebase keys dictate it through its own alphanumeric sort.
  Loop through the firebase return and match to the ingredients here
  */

  sortIngredients (dbIngredients) {
    const sortedIngredients = Object.assign({}, this.state.ingredients);

    for (let i in sortedIngredients) {
      sortedIngredients[i] = dbIngredients[i]
    }

    this.setState({ingredients: sortedIngredients});
  }

  componentDidMount () {
    axios.get('https://react16-burgerproject.firebaseio.com/ingredients.json')
      .then(response => {
        // this.setState({ingredients: response.data})
        this.sortIngredients(response.data);
      })
      .catch(error => {
        this.setState({error: true});
      });
  }

  updatePurchaseState () {
    const ingredientsSum = Object.values(this.state.ingredients).reduce((acc, curr) => acc+= curr);
    this.setState({purchasable: ingredientsSum > 0});
    // console.log(`ingredientsSum: ${ingredientsSum}`);
  }

  addIngredientHandler = (type) => {
    // const oldCount = this.state.ingredients[type];
    // const updatedCount = oldCount + 1;
    // const updatedIngredients = {
    //   ...this.state.ingredients
    // };
    // updatedIngredients[type] = updatedCount;
    // const priceAddition = INGREDIENT_PRICES[type];
    // const oldPrice = this.state.totalPrice;
    // const newPrice = oldPrice + priceAddition;
    // this.setState({totalPrice: newPrice, ingredients: updatedIngredients});

    //streamlined - use prevState object from React
    this.setState(prevState => {
      prevState.ingredients[type] += 1;
      return {
        totalPrice: prevState.totalPrice + INGREDIENT_PRICES[type], 
        ingredients: prevState.ingredients
      };
    }, this.updatePurchaseState);

  }

  removeIngredientHandler = (type) => {
    if (this.state.ingredients[type] === 0) {return;}
    this.setState(prevState => {
      prevState.ingredients[type] -= 1;
      return {
        totalPrice: prevState.totalPrice - INGREDIENT_PRICES[type], 
        ingredients: prevState.ingredients
      };
    }, this.updatePurchaseState);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }
    queryParams.push('price=' + this.state.totalPrice.toFixed(2));
    const queryString = queryParams.join('&');

    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString
    });
  }

  render() {
    //Disable less button when ingredient type is already zero
    //copy to new object so we don't violate immutability principles
    const disabledInfo = {...this.state.ingredients};
    
    //overwrite numeric value to simple true/false conditions
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients could not be loaded!</p> : <Spinner />;

    if (this.state.ingredients) {
      
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls 
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            price={this.state.totalPrice}
            disabledInfo={disabledInfo} 
            purchasable={this.state.purchasable} 
            purchase={this.purchaseHandler} />
        </Aux>
      );

      orderSummary = <OrderSummary 
        ingredients={this.state.ingredients} 
        price={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} />;
      
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }    

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios);
