import React, { Component } from 'react'
import {Button, PanelHeaderBack } from '@vkontakte/vkui'
import { withHistorySave } from '../HOCs/withHistorySave'

const FragmentWithHistory = (props) => {
  debugger
 
    return (
        <React.Fragment isBack={false} {...props}></React.Fragment>
        
    )
}

export default withHistorySave(FragmentWithHistory)


//Icon24ChevronRight