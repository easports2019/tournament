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
                        debugger
                        if (item.Approved && !item.Published)
                            return (
                                <RichCell
                                    caption={item.AdminTournamentComment.trim() && `Комментарий организатора: ${item.AdminTournamentComment.trim()}`}
                                    text={<b style={{"color": "green"}}>Заявка на турнир одобрена</b>}
                                >
                                    { `${item.TeamName} - ${item.TournamentGroup.Name} - ${item.TournamentGroup.Tournament.Name} (${item.TournamentGroup.Tournament.Founder.Surname} ${item.TournamentGroup.Tournament.Founder.Name[0]}.)`}
                                    
                                </RichCell>
                            )
                        else if (!item.Approved && !item.Published)
                            return (
                                <RichCell
                                    //onClick={() => props.CellClick(item)}
                                    caption={item.AdminTournamentComment.trim() && `Комментарий организатора: ${item.AdminTournamentComment.trim()}`}
                                    text={<b style={{"color": "red"}}>Заявка на турнир отклонена</b>}
                                    //actions={<Button mode="destructive" onClick={() => props.Button1Handle(item)}>Отменить заявку</Button>}
                                >
                                    { `${item.TeamName} - ${item.TournamentGroup.Name} - ${item.TournamentGroup.Tournament.Name} (${item.TournamentGroup.Tournament.Founder.Surname} ${item.TournamentGroup.Tournament.Founder.Name[0]}.)`}
                                    
                                </RichCell>
                            )
                        else
                            return (
                                <RichCell
                                    onClick={() => props.CellClick(item)}
                                    caption={item.AdminTournamentComment.trim() && `Комментарий организатора: ${item.AdminTournamentComment.trim()}`}
                                    actions={<Button mode="destructive" onClick={() => props.Button1Handle(item)}>Отменить заявку</Button>}
                                >
                                    { `${item.TeamName} - ${item.TournamentGroup.Name} - ${item.TournamentGroup.Tournament.Name} (${item.TournamentGroup.Tournament.Founder.Surname} ${item.TournamentGroup.Tournament.Founder.Name[0]}.)`}
                                    
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