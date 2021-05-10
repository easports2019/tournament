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
            <Button onClick={props.CellClick}>Назад к турнирам</Button>
                {(props.List && props.List.length > 0) ?
                    props.List.map(item => {
                        if (props.Bids.filter(x => x.TournamentGroupId == item.Id).length > 0)
                        {
                            return (
                                <RichCell
                                after={
                                    <Button onClick={() => props.Button2Handle(item)} mode="secondary" >Отменить заявку</Button>
                                }
                                >
                                    {item.Name}
                                </RichCell>
                            )
                        }
                        else{
                            return (
                                <RichCell
                                after={
                                    <Button onClick={() => props.Button1Handle(item)}>Отправить заявку</Button>
                                }
                                >
                                    {item.Name}
                                </RichCell>
                            )
                        }
                        
                    })
                    : <InfoRow>Нет групп в турнире</InfoRow>
                }

            </List>
        </Group>
    )
}

export default BidTeamTournamentGroupsList