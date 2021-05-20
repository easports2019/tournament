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
            
            >
                {props.Item.TeamName}
            </RichCell>
    )

}


export default BidListItem