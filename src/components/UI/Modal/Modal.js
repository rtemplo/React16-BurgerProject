import React from 'react';
import classes from './Modal.css';

const modal = (prop) => {
  return (
    <div className={classes.Modal}>
      {props.children}
    </div>
  )
}

export default modal;


