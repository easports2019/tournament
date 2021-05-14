import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, Cell, Button } from '@vkontakte/vkui'
import RichCellWithHistory from '../../Common/WithHistory/RichCellWithHistory'


const BidTeamTournamentList = (props) => {

    //const [tournamentList, setTournamentList] = useState(props.tournaments)
    // const list = props.tournaments.map(x => {
    //     return <TournamentListItem>{x.Name}</TournamentListItem>
    // })
    return (
        <Group>
            <List>
                {(props.List && props.List.length > 0) ?
                    props.List.map(item => {
                        if (props.Bids && props.Bids.length > 0 && props.Bids.filter(x => x.TournamentGroup.TournamentId == item.Id).length > 0){
                            return (
                                <RichCell
                                    caption={`Заявка сделана`}
                                    // onClick={() => props.CellClick(item)}
                                    // Button1Handle={props.Button1Handle}
                                    // Button2Handle={props.Button2Handle}
                                    
                                >
                                    {item.Name}
                                </RichCell>
                            )
                        }
                        else{
                            return (
                                <RichCell
                                    caption={`Организатор: ${item.Founder.Surname} ${item.Founder.Name[0]}.`}
                                    onClick={() => props.CellClick(item)}
                                    Button1Handle={props.Button1Handle}
                                    Button2Handle={props.Button2Handle}
                                    
                                >
                                    {item.Name}
                                </RichCell>
                            )
                        }
                    })
                    : <InfoRow>Нет активных к набору турниров</InfoRow>
                }

            </List>
        </Group>
    )
}

export default BidTeamTournamentList