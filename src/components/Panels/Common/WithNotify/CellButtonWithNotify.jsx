import React, { Component } from 'react'
import { CellButton } from '@vkontakte/vkui'
import { withNotify } from '../HOCs/withNotify'

const CellButtonWithNotify = (props) => {
  //debugger
 
    return (
        <CellButton Accept={null} Close={props.Close} Message={props.Message} {...props}></CellButton>
        
    )
}

export default withNotify(CellButtonWithNotify)