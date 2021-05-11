import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, Cell, Button } from '@vkontakte/vkui'


const BidTeamTournamentGroupsList = (props) => {

    //const [tournamentList, setTournamentList] = useState(props.tournaments)
    // const list = props.tournaments.map(x => {
    //     return <TournamentListItem>{x.Name}</TournamentListItem>
    // })
    debugger

    return (
        <Group header="Выберите группу/лигу">
            <Group mode="plain">
                <Button onClick={props.CellClick}>Назад к выбору турнира</Button>
                <List>
                {(props.List && props.List.length > 0) ?
                    props.List.map(item => {
                        debugger
                        if (props.Bids && props.Bids.filter(x => x.TournamentGroupId == item.Id).length > 0)
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
                                    <Button onClick={() => props.Button1Handle(item)}>Заявиться сюда</Button>
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
        </Group>
    )
}

export default BidTeamTournamentGroupsList