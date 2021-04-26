import React from 'react'
import { RichCell, Avatar } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'


const TournamentAdd = (props) => {
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
}

export default TournamentAdd