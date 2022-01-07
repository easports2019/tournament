import React, { useEffect } from 'react'
import { RichCell, Avatar } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import { dateToString, timeToString } from '../../../../utils/convertors/dateUtils';
import { green } from 'chalk';

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
    //textDecoration: 'underline',
    //borderLeft: '10px solid orange',
}

const lose = {
    color: '#666',
    //color: 'orange',
}

const MatchListItem = (props) => {
    
    
    let match=props.Match;
    let place=props.Place;
    let date = new Date(match.When);


        return (
            <RichCell
                onClick={props.ClickHandler}
                before={<Avatar>{match.TournamentGroup.Tournament.OrganizatorNameShort}</Avatar>}
                caption={place ? place.Name : "Ошибка загрузки данных о месте"}
                text={
                    match.Played ?
                        <span style={{ "color": "green" }}>Сыгран <span>в {`${dateToString(date, 0, 0, 0, true)}`}</span></span> :
                        <span style={{ "color": "blue" }}>Состоится <span>в {`${dateToString(date, 0, 0, 0, true)}`}</span> в {timeToString(date.getHours(), date.getMinutes())}</span>
                }
            >
                {match.Played ? <span>
                        <span 
                            style={(+match.Team1Goals > +match.Team2Goals) ? win : (+match.Team1Goals == +match.Team2Goals) ? {} : lose}
                            >{match.Team1.Name} </span>
                        <span style={schet}>{match.Team1Goals} - {match.Team2Goals}</span>
                        <span 
                            style={(+match.Team1Goals < +match.Team2Goals) ? win : (+match.Team1Goals == +match.Team2Goals) ? {} : lose}
                        > {match.Team2.Name}</span>
                    </span> :
                    <span>{match.Team1.Name} - {match.Team2.Name}</span>
                }
            </RichCell>
        )
}

export default MatchListItem