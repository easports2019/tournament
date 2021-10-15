import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, Cell, Button } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import TournamentListItem from './TournamentListItem'
import RichCellWithHistory from '../../Common/WithHistory/RichCellWithHistory'
import Icon24ChevronRightWithHistory from '../../Common/WithHistory/Icon24ChevronRightWithHistory'
import { dateToString } from '../../../../utils/convertors/dateUtils'
import ButtonWithNotify from '../../Common/WithNotify/ButtonWithNotify'




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
                                    <ButtonWithNotify Message="Опубликовать турнир?" Yes={() => props.Button1Handle(item, true)}>Опубликовать</ButtonWithNotify>
                                    : 
                                    <ButtonWithNotify Message="Снять с публикации турнир?" Yes={() => props.Button1Handle(item, false)} mode="secondary">Снять с публикации</ButtonWithNotify>}
                                    <ButtonWithNotify Message="Удалить турнир?" Yes={() => props.Button2Handle(item)} mode="destructive">Удалить</ButtonWithNotify>
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