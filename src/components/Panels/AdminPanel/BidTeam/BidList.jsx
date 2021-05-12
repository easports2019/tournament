import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, Cell, Button } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'


const BidList = (props) => {

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
                            <RichCell
                                onClick={() => props.CellClick(item)}
                            >
                                {`${item.TeamName} - ${item.TournamentGroup.Name} `}
                                {/*${item.Tournament.Name} (${item.Founder.Surname} ${item.Founder.Name[0]}.) */}
                            </RichCell>
                        )
                    })
                    : <InfoRow>У вас нет активных заявок</InfoRow>
                }

            </List>
        </Group>
    )
}

export default BidList