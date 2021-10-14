import React, { Component } from 'react'
import { Button } from '@vkontakte/vkui'
import { withNotify } from '../HOCs/withNotify'

const ButtonWithNotify = (props) => {
  //debugger
 
    return (
        <Button Accept={null} Close={props.Close} Message={props.Message} {...props}></Button>
        
    )
}

export default withNotify(ButtonWithNotify)