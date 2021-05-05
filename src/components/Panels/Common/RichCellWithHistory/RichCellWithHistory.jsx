import React, { Component } from 'react'
import { RichCell } from '@vkontakte/vkui'
import { withHistorySave } from '../HOCs/withHistorySave'

const RichCellWithHistory = (props) => {
  
 
    return (
        <RichCell isBack={false} {...props}></RichCell>
        
    )
}

export default withHistorySave(RichCellWithHistory)