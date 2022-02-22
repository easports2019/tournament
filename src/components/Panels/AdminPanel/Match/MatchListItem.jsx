import React, { useEffect } from 'react'
import { RichCell, Avatar, calcInitialsAvatarColor, InitialsAvatar } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import {  addToTime, dateToString, TimeIsNotAssigned, timeToString } from '../../../../utils/convertors/dateUtils';
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
    let date = match.When != null ? new Date(match.When) : null;
    let now = new Date();

    let endOfMatch = addToTime(date, 0, match.TournamentGroup.Tournament.MatchLength + 10); // 10 минут добавляем на всякий случай (задержки, перерывы)
    let timeString = date != null ? (TimeIsNotAssigned(date) ? " время не назначено" : ` в ${timeToString(date.getHours(), date.getMinutes())}`) : "";
    let inGame = ((date <= now ) && (now < endOfMatch));


        return (
            <RichCell
                onClick={props.ClickHandler}
                before={
                <InitialsAvatar
                gradientColor={calcInitialsAvatarColor(match.TournamentGroup.TournamentId)}
                >
                    <h6>{match.TournamentGroup.Tournament.OrganizatorNameShort}</h6>
                    </InitialsAvatar>
            }
                caption={place ? place.Name : "Не назначено"}
                text={
                    inGame ? <span style={{ "color": "red" }}>Матч идет</span> 
                    : match.Played ?
                        <span style={{ "color": "green" }}>Сыгран 
                        {date != null 
                            && <span>{` в ${dateToString(date, 0, 0, 0, true)}`}</span>
                        }
                        </span> :
                        <span style={{ "color": "blue" }}> 
                        {
                            date != null
                            ? <span>{`${dateToString(date, 0, 0, 0, true)}`} 
                            { timeString }
                            </span>
                            : <span>Дата и время не назначено</span>
                        }
                        </span>
                }
            >
                {match.Played ? <span>
                        <span 
                            style={(+match.Team1Goals > +match.Team2Goals) ? win : (+match.Team1Goals == +match.Team2Goals) ? {} : lose}
                            >{match.Team1Bid.TeamName} </span>
                        <span style={schet}>{match.Team1Goals} - {match.Team2Goals}</span>
                        <span 
                            style={(+match.Team1Goals < +match.Team2Goals) ? win : (+match.Team1Goals == +match.Team2Goals) ? {} : lose}
                        > {match.Team2Bid.TeamName}</span>
                    </span> :
                    <span>{match.Team1Bid.TeamName} - {match.Team2Bid.TeamName}</span>
                }
            </RichCell>
        )
}

export default MatchListItem