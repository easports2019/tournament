import React, { useEffect } from 'react'
import { RichCell, Avatar } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/datatypes/common'


const TournamentListItem = (props) => {

    useEffect(() => {
		// загружаем с сервера все турниры этого пользователя
		
	}, [props.tournamentAdmins])

        return (
            <>
                
            </>
        )
}

export default TournamentListItem