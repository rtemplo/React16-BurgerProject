import React, { Component } from 'react';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email Address'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true,
          errorMessage: 'Please enter your email address.'
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password',
          errormessage: 'Please enter a password.'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    }
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      }
    };
    this.setState({controls: updatedControls});
  }

  subitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value);
  }

  checkValidity (value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength  && isValid;
    }

    if (rules.isEmail) {
      const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }  



  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key, 
        config: this.state.controls[key]
      });
    }

    const inputs = formElementsArray.map(formElement => {
      let errorMessage = null;
      if (formElement.config.validation) {
        errorMessage = formElement.config.validation.errormessage
      }

      return (<Input
        key={formElement.id} 
        elementType={formElement.config.elementType} 
        elementConfig={formElement.config.elementConfig} 
        value={formElement.config.value} 
        errorMessage={errorMessage} 
        invalid={!formElement.config.valid} 
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
      )
    });

    return (
      <div className={classes.Auth} onSubmit={this.subitHandler}>
        <form>
          {inputs}
          <Button btnType="Success">SUBMIT</Button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password) => dispatch(actions.auth(email, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
