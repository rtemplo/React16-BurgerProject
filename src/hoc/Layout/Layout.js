import React, {Component} from 'react';
import Aux from '../Auxilary/Auxilary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
  state = {
    showSideDrawer: false
  }

  toggleSideDrawerHandler = () => {
    this.setState(prevState => ({showSideDrawer: !prevState.showSideDrawer}));
  }

  render () {
    return (
      <Aux>
        <Toolbar toggleSideDrawer={this.toggleSideDrawerHandler} />
        <SideDrawer open={this.state.showSideDrawer} closed={this.toggleSideDrawerHandler}/>
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Aux>
    );
  }
} 

export default Layout;