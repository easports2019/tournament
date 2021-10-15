import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, Button, FormItem, Input } from '@vkontakte/vkui'
import ButtonWithNotify from '../../Common/WithNotify/ButtonWithNotify'


const BidTeamTournamentGroupsList = (props) => {

    //const [tournamentList, setTournamentList] = useState(props.tournaments)
    // const list = props.tournaments.map(x => {
    //     return <TournamentListItem>{x.Name}</TournamentListItem>
    // })
    //debugger

    return (
        <Group header="Выберите группу/лигу">
            <Group mode="plain">
                <FormItem>
                    <Button onClick={props.CellClick}>Назад к выбору турнира</Button>
                </FormItem>
                <FormItem top="Название команды на этот турнир">
                    <Input type="text" defaultValue={props.TeamName} value={props.TeamName} onChange={e => props.SetTeamName(e.currentTarget.value)} placeholder={`Например, ${props.TeamName}`} />
                </FormItem>
                <List>
                {(props.List && props.List.length > 0) ?
                    props.List.map(item => {
                        //debugger
                        if (props.Bids && props.Bids.filter(x => (x.TournamentGroupId == item.Id && (!item.Approved && item.Published)) ).length > 0)
                        {
                            // // предположим существует несколкьо заявок на 1 группу, тогда нужно найти отклоненные и их не предлагать
                            // props.Bids.map

                            return (
                                <RichCell
                                after={
                                    <ButtonWithNotify Message="Уверены, что хотите отменить заявку?" Yes={() => props.Button2Handle(item)} mode="destructive" >Отменить заявку</ButtonWithNotify>
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
                                    <ButtonWithNotify Message="Заявляем команду в эту группу?" Yes={() => props.Button1Handle(item)}>Заявиться сюда</ButtonWithNotify>
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