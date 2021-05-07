import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, Cell, Button } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import TournamentListItem from './TournamentListItem'
import RichCellWithHistory from '../../Common/WithHistory/RichCellWithHistory'
import Icon24ChevronRightWithHistory from '../../Common/WithHistory/Icon24ChevronRightWithHistory'
import { dateToString } from '../../../../utils/convertors/dateUtils'




const TournamentAdminList = (props) => {

    //const [tournamentList, setTournamentList] = useState(props.tournaments)
    // const list = props.tournaments.map(x => {
    //     return <TournamentListItem>{x.Name}</TournamentListItem>
    // })

        

    return (
        <Group>
            <List>
                {(props.List && props.List.length > 0) ?
                    props.List.map(item => {
                        let date = new Date(item.WhenBegin);
                        return (
                            <RichCell
                                multiline
                                actions={
                                    <>
                                    {!item.Published ? 
                                    <Button onClick={() => props.Button1Handle(item, true)}>Опубликовать</Button>
                                    : 
                                    <Button onClick={() => props.Button1Handle(item, false)} mode="secondary">Снять с публикации</Button>}
                                    <Button onClick={() => props.Button2Handle(item)} mode="destructive">Удалить</Button>
                                    </>
                                    }
                                caption={date && `Начало: ${dateToString(date)}`}
                                after={<Icon24ChevronRightWithHistory
                                handleClick={() => props.CellClick(item)} 
                                    toMenuName="tournamentitem" 
                                    data-story="tournamentitem"></Icon24ChevronRightWithHistory>
                                }
                                text={item.Published ? "Опубликован" : "Не опубликован"}
                            >
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

export default TournamentAdminList