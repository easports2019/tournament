import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, Cell, Button } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import TournamentListItem from './TournamentListItem'


const TournamentList = (props) => {

    //const [tournamentList, setTournamentList] = useState(props.tournaments)
    // const list = props.tournaments.map(x => {
    //     return <TournamentListItem>{x.Name}</TournamentListItem>
    // })

    return (
        <Group>
            <List>
                {(props.List && props.List.length > 0) ?
                    props.List.map(item => {
                        return (
                            <RichCell>
                                {item.Name}
                            </RichCell>
                        )
                    })
                    : <InfoRow>Нет турниров</InfoRow>
                }

            </List>
        </Group>
    )
}

export default TournamentList