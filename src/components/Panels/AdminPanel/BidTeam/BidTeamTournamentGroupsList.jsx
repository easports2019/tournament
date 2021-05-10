import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, Cell, Button } from '@vkontakte/vkui'


const BidTeamTournamentGroupsList = (props) => {

    //const [tournamentList, setTournamentList] = useState(props.tournaments)
    // const list = props.tournaments.map(x => {
    //     return <TournamentListItem>{x.Name}</TournamentListItem>
    // })
    return (
        <Group header="Выберите группу">
            <List>
                {(props.List && props.List.length > 0) ?
                    props.List.map(item => {
                        return (
                            <RichCell
                            onClick={() => props.CellClick(item)}
                            >
                                {item.Name}
                            </RichCell>
                        )
                    })
                    : <InfoRow>Нет групп в турнире</InfoRow>
                }

            </List>
        </Group>
    )
}

export default BidTeamTournamentGroupsList