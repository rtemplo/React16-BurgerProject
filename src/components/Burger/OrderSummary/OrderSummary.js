import React, { Component } from 'react';
import Aux from '../../../hoc/Auxilary/Auxilary';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
  //This is a class component for reference purposes of how it is NOT updated based on whether the modal is shown.
  // it could be a functional component otherwise.
  // componentWillUpdate () {
  //   //this should not print if the modal is not shown
  //   console.log('[OrderSummary] WillUpdate');
  // }

  render () {
    const ingredientSummary = Object.keys(this.props.ingredients).map(igKey => {
      return (
        <li key={igKey}>
          <span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]}
        </li>
      );
    });

    return (
      <Aux>
        <h3>Your Order</h3>
        <p>A delicious burger with the following ingredients:</p>
        <ul>
          {ingredientSummary}
        </ul>
        <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
        <p>Continue to Checkout?</p>
        <Button btnType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
        <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
      </Aux>
    );
  }
}

export default OrderSummary;