import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: ''
    },
    loading: false
  }

  orderHandler = (event) => {
    event.preventDefault();
    // console.log(this.props.ingredients);

    this.setState({loading: true});

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
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

    //For the Firebase endpoint the .json extension is needed
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
    
  }

  render() {
    let form = (
        <form>
          <Input inputtype="input" type="email" name="email" placeholder="Your Email" />
          <Input inputtype="input" type="text" name="name" placeholder="Your Name" />
          <Input inputtype="input" type="text" name="street" placeholder="Street" />
          <Input inputtype="input" type="text" name="postal" placeholder="Postal Code" />
          <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
        </form>
    );

    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    )
  }
}

export default ContactData;