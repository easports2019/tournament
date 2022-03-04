import React, { useEffect } from 'react'
import { RichCell, Avatar, calcInitialsAvatarColor, InitialsAvatar } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import {  addToTime, dateToString, TimeIsNotAssigned, timeToString, dateIsMin, datesWithoutTimeIsSame } from '../../../../utils/convertors/dateUtils';
import { green } from 'chalk';



const lose = {
    
    maxWidth: "40%",
    padding: '1px 0px 1px 0px',
    overflow: "hidden",
    display: "inline-block",
    fontSize: "0.9em",
}

const win = {
    ...lose,
    fontWeight: 'bold',
}

const draw = {
    ...lose,
}

const schet_base = {
    ...win,
    maxWidth: "15%",
    padding: '1px 7px 1px 7px',
    margin: '0px 5px',
    fontWeight: 'bold', 
    fontSize: '1em',
    borderRadius: '10px',
}

const schet = {
    ...schet_base,
    color: 'yellow',
    backgroundColor: 'gray',
}

const noschet = {
    ...schet_base,
}

const MatchListItem = (props) => {
    

    let match=props.Match;
    let place=props.Place;
    let date = (match.When != null && !dateIsMin(match.When)) 
        ? new Date(match.When) 
        : null;
    let now = new Date();

    let endOfMatch = date != null ? addToTime(date, 0, match.TournamentGroup.Tournament.MatchLength + 10) : null; // 10 минут добавляем на всякий случай (задержки, перерывы)
    let timeString = date != null ? (TimeIsNotAssigned(date) ? " время не назначено" : ` в ${timeToString(date.getHours(), date.getMinutes())}`) : "";
    let dateString = "";
    // let date = (match.When != null && !dateIsMin(match.When)) 
    // ? (datesWithoutTimeIsSame(new Date, new Date(match.When)) ? "Сегодня" : new Date(match.When)) 
    // : null;
    let inGame = date != null && ((date <= now ) && (now < endOfMatch));

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
                    inGame 
                    ? <span style={{ "color": "red" }}>Матч идет</span> 
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
                {match.Played ? <>
                        <span 
                            style={(+match.Team1Goals > +match.Team2Goals) ? win : (+match.Team1Goals == +match.Team2Goals) ? draw : lose}
                            >{match.Team1Bid.TeamName}</span>
                        <span style={schet}>{match.Team1Goals} - {match.Team2Goals}</span>
                        <span 
                            style={(+match.Team1Goals < +match.Team2Goals) ? win : (+match.Team1Goals == +match.Team2Goals) ? draw : lose}
                        >{match.Team2Bid.TeamName}</span>
                    </> :
                    <>
                    <span style={draw}>{match.Team1Bid.TeamName}</span>
                    <span style={noschet}> - </span>
                    <span style={draw}>{match.Team2Bid.TeamName}</span>
                    </>
                }
            </RichCell>
        )
}

export default MatchListItem