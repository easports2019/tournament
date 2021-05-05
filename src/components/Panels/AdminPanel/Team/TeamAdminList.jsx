import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, Cell, Button } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import RichCellWithHistory from './../../Common/RichCellWithHistory/RichCellWithHistory'
import { dateToString } from '../../../../utils/convertors/dateUtils'



const TeamAdminList = (props) => {

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
                            <RichCellWithHistory
                                handleClick={() => props.CellClick(item)} 
                                toMenuName="tournamentitem" 
                                data-story="tournamentitem"
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
                                text={item.Published ? "Опубликован" : "Не опубликован"}
                            >
                                {item.Name}
                            </RichCellWithHistory>
                        )
                    })
                    : <InfoRow>Нет турниров</InfoRow>
                }

            </List>
        </Group>
    )
}

export default TeamAdminList