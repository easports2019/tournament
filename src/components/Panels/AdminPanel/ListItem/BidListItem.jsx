import React, {useState} from 'react'
import  ButtonWithNotify  from './../../Common/WithNotify/ButtonWithNotify'
import { Button, CellButton, Input, RichCell } from '@vkontakte/vkui'




const BidListItem = (props) => {

    let [adminText, setAdminText] = useState("");


    return (
            <RichCell key={props.KeyId != -1 ? props.KeyId : null} 
            actions={
                <>
                    <ButtonWithNotify mode="primary" Messsage="Принять заявку команды?" Yes={() => props.Accept(props.Item)}>Принять</ButtonWithNotify>
                    <Input value={adminText} onChange={(e) => setAdminText(e.currentTarget.value)} placeholder="Причина отклонения заявки"></Input>
                    <ButtonWithNotify mode="destructive" Message="Отклонить заявку команды?" Yes={() => props.Decline(props.Item, adminText)}>Отклонить</ButtonWithNotify>
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