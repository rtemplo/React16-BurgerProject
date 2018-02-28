import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxilary/Auxilary';

/*
This component will wrap another component. (Used to wrap BuildBurger)
This is a function component that returns a class. It takes two arguments.
  The first parameter is the class
  The second is the an instance of the axios component

This component sets a state for error and overrides the global axios request and response interceptors
  in the ComponentDidMount lifecycle hook
*/

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null
    }

    componentWillMount () {
      //For both the request and response interceptors the params are req/response as the first args.
      // The second argument is the error object.
      //Both arguments are optional.

      //For requests: If there is no error set the error to null. 
      //Only the first arguments is used. The second error argument is not used.
      //  Then return the request so the REST process can continue
      axios.interceptors.request.use(req => {
        this.setState({error: null});
        return req;
      });

      //For response: If there is an error set it to the state
      //  res => res will return the response object so the REST process can continue
      axios.interceptors.response.use(res => res, error => {
        this.setState({error: error});
      });
    }

    errorConfirmedHandler = () => {
      this.setState({error: null});
    }

    render () {
      return (
        <Aux>
          <Modal 
            show={this.state.error}
            modalClosed={this.errorConfirmedHandler} >
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  }
}

export default withErrorHandler;