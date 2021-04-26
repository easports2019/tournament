import React from 'react'
import { RichCell, Avatar, Button } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'

const TournamentAdminPanel = (props) => {
        return (
            <>
                <div>Мои турниры</div>
                <TournamentList></TournamentList>
                <div>Кнопка Создать турнир</div>
                <Button>Новый турнир</Button>
            </>
        )
}

export default TournamentAdminPanel