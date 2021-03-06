import React from 'react';
import classes from './SideDrawer.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Auxilary/Auxilary';

const sideDrawer = (props) => {
  let sideDrawerClass = [classes.SideDrawer, classes.Close];

  if (props.open) {
    sideDrawerClass = [classes.SideDrawer, classes.Open];
  }

  return (
    <Aux>
    <Backdrop show={props.open} clicked={props.closed} />
    <div className={sideDrawerClass.join(' ')} onClick={props.closed}>
      <div className={classes.Logo}>
        <Logo />
      </div>
      <nav>
        <NavigationItems isAuthenticated={props.isAuth}/>
      </nav>
    </div>
    </Aux>
  );
}

export default sideDrawer;