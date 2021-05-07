import React, { Component } from 'react'
import {TabbarItem } from '@vkontakte/vkui'
import { withHistorySave } from '../HOCs/withHistorySave'
import { Icon24ChevronRight } from '@vkontakte/icons';

const Icon24ChevronRightWithHistory = (props) => {
  
 
    return (
        <Icon24ChevronRight isBack={false} {...props}></Icon24ChevronRight>
        
    )
}

export default withHistorySave(Icon24ChevronRightWithHistory)