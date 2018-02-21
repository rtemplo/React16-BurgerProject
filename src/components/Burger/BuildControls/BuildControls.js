import React from 'react'
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
  { label: 'Salad', type: 'salad' },
  { label: 'Bacon', type: 'bacon' },
  { label: 'Cheese', type: 'cheese' },
  { label: 'Meat', type: 'meat' }
];

const buildControls = (props) => {
  return (
    <div className={classes.BuildControls}>
      <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
      {controls.map(ctrl => 
        <BuildControl 
          key={ctrl.label} 
          label={ctrl.label}
          qty={props.ingredients[ctrl.type]}
          added={() => props.ingredientAdded(ctrl.type)} 
          removed={() => props.ingredientRemoved(ctrl.type)}
          disabled={props.disabledInfo[ctrl.type]} />
      )}
      <button className={classes.OrderButton} onClick={props.purchase} disabled={!props.purchasable}>ORDER NOW</button>
    </div>
  )
}

export default buildControls;

