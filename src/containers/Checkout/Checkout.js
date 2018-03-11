import React, { Component } from 'react'
import { Route } from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 0
  }

  componentWillMount () {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    let price = +params.get('price');

    //this is done this way to maintain the order of the ingredients
    const ingredients = {...this.state.ingredients};
    for (let i in ingredients) {
      ingredients[i] = +params.get(i);
    }

    this.setState({ingredients: ingredients, totalPrice: price});
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render() {
    return (
      <div>
        <CheckoutSummary 
          ingredients={this.state.ingredients} 
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
          />
        <Route 
          path={this.props.match.path + '/contact-data'} 
          render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props} />)} />
      </div>
    )
  }
}

export default Checkout;
