import React, { Component } from 'react'
import {PanelHeaderBack } from '@vkontakte/vkui'
import { withHistorySave } from '../HOCs/withHistorySave'

const BackButton = (props) => {
  
 
    return (
        <PanelHeaderBack isBack={true} {...props}></PanelHeaderBack>
        
    )
}

export default withHistorySave(BackButton)