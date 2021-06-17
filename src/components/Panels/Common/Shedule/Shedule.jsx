import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, Cell, Button } from '@vkontakte/vkui'
import Icon24ChevronRightWithHistory from '../../Common/WithHistory/Icon24ChevronRightWithHistory'



const Shedule = (props) => {
        
    let isAdminMode = props.mode == "admin" ? true : false;
    let tournament = props.tournament;
    let today = props.todayIs;

// выводим список существующего расписания с кнопками редактирования, удаления, переноса
// группируем список по датам, сортируем от последних к первым (последние выше)
// сделать кнопку сортировки



    return (
        <Group>
            <List>
               

            </List>
        </Group>
    )
}

export default Shedule