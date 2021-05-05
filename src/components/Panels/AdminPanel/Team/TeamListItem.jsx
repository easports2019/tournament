import React, { useEffect } from 'react'
import { RichCell, Avatar } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'



const TeamListItem = (props) => {

    useEffect(() => {
		// загружаем с сервера все турниры этого пользователя
		
	}, [props.tournamentAdmins])

        return (
            <>
                
            </>
        )
}

export default TeamListItem