import React, { Component } from 'react'
import {Button, PanelHeaderBack } from '@vkontakte/vkui'
import { withHistorySave } from '../HOCs/withHistorySave'

const ButtonWithHistory = (props) => {
  
 
    return (
        <Button isBack={false} {...props}></Button>
        
    )
}

export default withHistorySave(ButtonWithHistory)