import React, { Component } from 'react'
import {TabbarItem } from '@vkontakte/vkui'
import { withHistorySave } from '../HOCs/withHistorySave'

const TabbarItemWithHistory = (props) => {
  
 
    return (
        <TabbarItem isBack={false} {...props}></TabbarItem>
        
    )
}

export default withHistorySave(TabbarItemWithHistory)