import React, { useEffect } from 'react'
import { RichCell, Avatar } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/datatypes/common'
import TournamentListItem from './TournamentListItem'


const TournamentList = (props) => {

    //const [tournamentList, setTournamentList] = useState(props.tournaments)
    const list = props.tournaments.map(x => {
        return <TournamentListItem>{x.Name}</TournamentListItem>
    })

        return (
            <>
                {list}
            </>
        )
}

export default TournamentList