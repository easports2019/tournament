import React, { Component } from 'react'
import { CellButton } from '@vkontakte/vkui'
import { withHistorySave } from '../HOCs/withHistorySave'

const CellButtonWithHistory = (props) => {
  //debugger
 
    return (
        <CellButton isBack={false} {...props}></CellButton>
        
    )
}

export default withHistorySave(CellButtonWithHistory)