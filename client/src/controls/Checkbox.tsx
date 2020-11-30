import React, { useContext } from 'react';
import { WebSocketContext } from '../WebSocket';
import { useDispatch } from 'react-redux'
import { changeProps } from '../slices/pageSlice'
import { Checkbox, ICheckboxProps } from '@fluentui/react';
import { IControlProps } from './IControlProps'

export const MyCheckbox = React.memo<IControlProps>(({control}) => {

  console.log(`render Checkbox: ${control.i}`);

  const ws = useContext(WebSocketContext);

  const dispatch = useDispatch();
  
  const handleChange = (event?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {

    if (checked !== undefined) {
      const payload = [
        {
          i: control.i,
          "checked": checked.toString()
        }
      ];
  
      dispatch(changeProps(payload));
      ws.updateControlProps(payload);
    }
  }

  const checkboxProps: ICheckboxProps = {
    checked: control.checked === "true",
    label: control.label ? control.label : null
  };

  return <Checkbox {...checkboxProps} onChange={handleChange} />;
})