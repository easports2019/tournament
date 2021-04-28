import React from 'react'
import { RichCell, Avatar } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/datatypes/common'



const TournamentItem = (props) => {

    switch(props.mode)
    {
        case "view":{
            return (
                <>
                    <div>Турнир</div>
                    <div>Название</div>
                    <div>Дата начала</div>
                    <div>Дата окончания</div>
                    <div>Группы</div>
                    <div>Описание</div>
                    <div>Логотип</div>
    
                    <div>Город (автоматически)</div>
                </>
            )    
        };break;
        case "add":{
            return (
                <>
                    <div>Новый турнир</div>
                    <div>Название</div>
                    <div>Дата начала</div>
                    <div>Дата окончания</div>
                    <div>Группы</div>
                    <div>Описание</div>
                    <div>Логотип</div>
    
                    <div>Город (автоматически)</div>
                </>
            )
        };break;
        case "edit":{
            return (
                <>
                    <div>Изменить турнир</div>
                    <div>Название</div>
                    <div>Дата начала</div>
                    <div>Дата окончания</div>
                    <div>Группы</div>
                    <div>Описание</div>
                    <div>Логотип</div>
    
                    <div>Город (автоматически)</div>
                </>
            )
        };break;
    }

        
}

export default TournamentItem