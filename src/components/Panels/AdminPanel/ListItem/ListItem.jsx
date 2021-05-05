import React from 'react'
import { Cell } from '@vkontakte/vkui'




const ListItem = (props) => {
    return (
            <Cell key={props.KeyId != -1 ? props.KeyId : null} 
            removable 
            onRemove={() => props.Delete(props.KeyId)}
            >
                {props.Name}
            </Cell>
    )

}


export default ListItem