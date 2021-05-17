import React from 'react'
import { Button, CellButton, RichCell } from '@vkontakte/vkui'




const BidListItem = (props) => {
    return (
            <RichCell key={props.KeyId != -1 ? props.KeyId : null} 
            actions={
                <>
                    <Button mode="primary">Принять</Button>
                    <Button mode="destructive">Отклонить</Button>
                </>
            }
            
            >
                {props.TeamName}
            </RichCell>
    )

}


export default BidListItem