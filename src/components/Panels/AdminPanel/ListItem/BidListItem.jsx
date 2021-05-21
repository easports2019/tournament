import React from 'react'
import { Button, CellButton, Input, RichCell } from '@vkontakte/vkui'




const BidListItem = (props) => {
    return (
            <RichCell key={props.KeyId != -1 ? props.KeyId : null} 
            actions={
                <>
                    <Input></Input>
                    <Button mode="primary" onClick={() => props.Accept(props.Item)}>Принять</Button>
                    <Button mode="destructive" onClick={() => props.Decline(props.Item)}>Отклонить</Button>
                </>
            }
            text={`Хотят выступать под именем ${props.Item.TeamName} в ${props.Item.TournamentGroup.Name} группе/лиге`}
            caption={`Заявку отправил ${props.Item.UserProfile.Surname} ${props.Item.UserProfile.Name}`}
            >
                Команда {props.Item.Team.Name}
            </RichCell>
    )

}


export default BidListItem