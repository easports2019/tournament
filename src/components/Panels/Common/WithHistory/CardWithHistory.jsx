import React, { Component } from 'react'
import {Card, PanelHeaderBack } from '@vkontakte/vkui'
import { withHistorySave } from '../HOCs/withHistorySave'

const CardWithHistory = (props) => {
  
 
    return (
        <Card isBack={false} {...props}></Card>
        
    )
}

export default withHistorySave(CardWithHistory)