import React, { Component } from 'react'
import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false
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
    // alert('You continue!');
    this.setState({loading: true});

    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Ray Templo',
        address: {
          street: '1 Infinite Loop',
          zipCode: '08857',
          country: 'USA'
        },
        email: 'rtemplo@gmail.com',
      },
      deliveryMethod: 'fastest'
    }

    axios.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false, purchasing: false });
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

    let orderSummary = <OrderSummary 
      ingredients={this.state.ingredients} 
      price={this.state.totalPrice}
      purchaseCancelled={this.purchaseCancelHandler}
      purchaseContinued={this.purchaseContinueHandler} />;

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls 
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          price={this.state.totalPrice}
          disabledInfo={disabledInfo} 
          purchasable={this.state.purchasable} 
          purchase={this.purchaseHandler} />
      </Aux>
    )
  }
}

export default BurgerBuilder;
