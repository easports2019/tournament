import React, { useEffect } from 'react'
import { RichCell, Avatar, Group, FormItem, Textarea } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import { dateToString, timeToString } from '../../../../utils/convertors/dateUtils';

const schet = {
    fontWeight: 'bold', 
    color: 'yellow',
    backgroundColor: 'gray',
    padding: '1px 7px',
    borderRadius: '10px',
}

const win = {
    fontWeight: 'bold',
    //color: 'orange',
}

const lose = {
    color: 'darkgray',
    //color: 'orange',
}

const MatchItem = (props) => {
    
    
    let match=props.match;
    let place=props.Place;
    let date = new Date(match.When);

    return (
        <Group>
            <FormItem>
                {match.Team1 ? match.Team1.Name : match.Team1Name} 
                {match && (match.Played ? `  ${match.Team1Goals} : ${match.Team2Goals}  ` : `  :  `)} 
                {match.Team2 ? match.Team2.Name : match.Team2Name}
            </FormItem>
            <FormItem top="Группа/лига">
                {match.TournamentGroup.Name}
            </FormItem>
            
            <FormItem top="Комментарий к матчу">
                <Textarea 
                value={match.Description} 
                readOnly
                style={{minHeight: '100px'}}
                ></Textarea>
            </FormItem>
            <FormItem top="Дата">
                {new Date(match.When).toLocaleDateString()}
            </FormItem>
            
            <FormItem top="Место">
                {match.Place.Name}
            </FormItem>
            <FormItem top="Статус матча">
                {match.Played ? "Сыгран" : "Не сыгран"}
            </FormItem>
            
        </Group>
    ) 
        // return (
        //     <RichCell
        //         onClick={props.ClickHandler}
        //         caption={place ? place.Name : "Ошибка загрузки данных о месте"}
        //         text={
        //             match.Played ?
        //                 <span style={{ "color": "green" }}>Сыгран <span>в {`${dateToString(date, 0, 0, 0, true)}`}</span></span> :
        //                 <span style={{ "color": "blue" }}>Состоится <span>в {`${dateToString(date, 0, 0, 0, true)}`}</span> в {timeToString(date.getHours(), date.getMinutes())}</span>
        //         }
        //     >
        //         {match.Played ? <span>
        //                 <span 
        //                     style={(+match.Team1Goals > +match.Team2Goals) ? win : (+match.Team1Goals == +match.Team2Goals) ? {} : lose}
        //                     >{match.Team1.Name} </span>
        //                 <span style={schet}>{match.Team1Goals} - {match.Team2Goals}</span>
        //                 <span 
        //                     style={(+match.Team1Goals < +match.Team2Goals) ? win : (+match.Team1Goals == +match.Team2Goals) ? {} : lose}
        //                 > {match.Team2.Name}</span>
        //             </span> :
        //             <span>{match.Team1.Name} - {match.Team2.Name}</span>
        //         }
        //     </RichCell>
//         )
 }

export default MatchItem