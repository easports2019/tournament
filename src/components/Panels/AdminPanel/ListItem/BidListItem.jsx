import React, {useState} from 'react'
import { Button, CellButton, Input, RichCell } from '@vkontakte/vkui'




const BidListItem = (props) => {

    let [adminText, setAdminText] = useState("");


    return (
            <RichCell key={props.KeyId != -1 ? props.KeyId : null} 
            actions={
                <>
                    <Button mode="primary" onClick={() => props.Accept(props.Item)}>Принять</Button>
                    <Input value={adminText} onChange={(e) => setAdminText(e.currentTarget.value)} placeholder="Причина отклонения заявки"></Input>
                    <Button mode="destructive" onClick={() => props.Decline(props.Item, adminText)}>Отклонить</Button>
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