import React, { Component } from 'react'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

class Checkout extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    }
  }

  parseQueryParams () {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    
    const ingredients = {...this.state.ingredients};
    for (let i in ingredients) {
      ingredients[i] = +params.get(i);
    }

    this.setState({ingredients: ingredients});
  }

  componentDidMount () {
    this.parseQueryParams();
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
      </div>
    )
  }
}

export default Checkout;
