import React, { useContext } from 'react';
import { WebSocketContext } from '../WebSocket';
import { shallowEqual, useSelector } from 'react-redux'
import {
  PrimaryButton,
  DefaultButton,
  CompoundButton,
  CommandBarButton,
  IconButton,
  ActionButton,
  IButtonProps,
  IContextualMenuProps,
  IContextualMenuItem,
  ContextualMenuItemType } from '@fluentui/react';
import { IControlProps } from './IControlProps'

export const Button = React.memo<IControlProps>(({control, parentDisabled}) => {

  //console.log(`render Button: ${control.i}`);

  let disabled = (control.disabled === 'true') || parentDisabled;

  const ws = useContext(WebSocketContext);

  let ButtonType = DefaultButton;
  if (control.compound === 'true') {
    ButtonType = CompoundButton
  } else if (control.commandbar === 'true') {
    ButtonType = CommandBarButton
  } else if (control.primary === 'true') {
    ButtonType = PrimaryButton
  } else if (control.action === 'true') {
    ButtonType = ActionButton
  } else if (control.icon && control.text === undefined) {
    ButtonType = IconButton
  }

  let height = control.height !== undefined ? control.height : undefined;
  if (control.commandbar === 'true' && control.height === undefined) {
    height = 40;
  }

  const handleMenuItemClick = (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem) => {
    ws.pageEventFromWeb(control.i, 'menuClick', item!.key)
  }

  const menuProps = useSelector<any, IContextualMenuProps | undefined>((state: any) => {

    function getProps(parent:any) {
      const itemControls = parent.c.map((childId: any) =>
          state.page.controls[childId])
          .filter((ic: any) => ic.t === 'item' && ic.visible !== "false");
      
      if (itemControls.length === 0) {
        return null
      }

      let props:any = {
        items: Array<any>(),
        onItemClick: handleMenuItemClick
      };

      for(let i = 0; i < itemControls.length; i++) {
        let item:any = {
          key: itemControls[i].key ? itemControls[i].key : itemControls[i].text,
          text: itemControls[i].text ? itemControls[i].text : itemControls[i].key,
          secondaryText: itemControls[i].secondarytext ? itemControls[i].secondarytext : undefined,
          href: itemControls[i].url ? itemControls[i].url : undefined,
          target: itemControls[i].newwindow === 'true' ? '_blank' : undefined,
          disabled: itemControls[i].disabled === 'true' ? true : undefined,
          split: itemControls[i].split === 'true' ? true : undefined
        };
        if (itemControls[i].icon) {
          item.iconProps = {
            iconName: itemControls[i].icon
          }
        }
        if (itemControls[i].divider === 'true') {
          item.itemType = ContextualMenuItemType.Divider;
          item.key = "divider_" + itemControls[i].i;
        }
        const subMenuProps = getProps(itemControls[i]);
        if (subMenuProps !== null) {
          item.subMenuProps = subMenuProps
        }
        props.items.push(item)
      }

      return props;
    }

    return getProps(control);
  }, shallowEqual)

  let buttonProps: Partial<IButtonProps> = {
    text: control.text ? control.text : control.i,
    href: control.url ? control.url : undefined,
    target: control.newwindow === 'true' ? '_blank' : undefined,
    secondaryText: control.secondarytext ? control.secondarytext : undefined,
    disabled: disabled,
    primary: control.compound === 'true' && control.primary === 'true' ? true : undefined,
    split: control.split === 'true' ? true : undefined,
    menuProps: menuProps,
    styles: {
      root: {
        width: control.width !== undefined ? control.width : undefined,
        height: height,
        padding: control.padding !== undefined ? control.padding : undefined,
        margin: control.margin !== undefined ? control.margin : undefined   
      }
    }
  };

  if (control.icon) {
    buttonProps.iconProps = {
      iconName: control.icon
    }
  }

  const handleClick = () => {
    ws.pageEventFromWeb(control.i, 'click', control.data)
  }

  return <ButtonType onClick={handleClick} {...buttonProps} />;
})