import React from 'react'
import { Cell } from '@vkontakte/vkui'




const ListItem = (props) => {
    return (
            <Cell key={props.Id != -1 ? props.Id : null} 
            removable 
            onRemove={() => props.Delete(props.Id)}
            >
                {props.Name}
            </Cell>
    )

}


export default ListItem