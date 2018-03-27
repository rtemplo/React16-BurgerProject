import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
    error: false
  }

  /*
  Define ingredients above anyway so that we an set an order to the ingredients here
   instead of having Firebase keys dictate it through its own alphanumeric sort.
  Loop through the firebase return and match to the ingredients here
  */

  // sortIngredients (dbIngredients) {
  //   const sortedIngredients = Object.assign({}, this.props.ings);

  //   for (let i in sortedIngredients) {
  //     sortedIngredients[i] = dbIngredients[i]
  //   }

  //   this.setState({ingredients: sortedIngredients});
  // }

  componentDidMount () {
    //commented out unitl SAGA?
    // axios.get('https://react16-burgerproject.firebaseio.com/ingredients.json')
    //   .then(response => {
    //     // this.setState({ingredients: response.data})
    //     this.sortIngredients(response.data);
    //   })
    //   .catch(error => {
    //     this.setState({error: true});
    //   });
  }

  updatePurchaseState () {
    const ingredientsSum = Object.values(this.props.ings).reduce((acc, curr) => acc+= curr);
    return ingredientsSum > 0;
    // console.log(`ingredientsSum: ${ingredientsSum}`);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout');
  }

  render() {
    //Disable less button when ingredient type is already zero
    //copy to new object so we don't violate immutability principles
    const disabledInfo = {...this.props.ings};
    
    //overwrite numeric value to simple true/false conditions
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients could not be loaded!</p> : <Spinner />;

    if (this.props.ings) {
      
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls 
            ingredientAdded={this.props.onAddIngredient}
            ingredientRemoved={this.props.onRemIngredient}
            price={this.props.price}
            disabledInfo={disabledInfo} 
            purchasable={this.updatePurchaseState(this.props.ings)} 
            purchase={this.purchaseHandler} />
        </Aux>
      );

      orderSummary = <OrderSummary 
        ingredients={this.props.ings} 
        price={this.props.price}
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

const mapStateToProps = state => {
  return {
      ings: state.ingredients,
      price: state.totalPrice
  }
};

const mapDispatchToProps = dispatch => {
  return {
      onAddIngredient: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
      onRemIngredient: (ingName) => dispatch({type: actionTypes.REM_INGREDIENT, ingredientName: ingName})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
