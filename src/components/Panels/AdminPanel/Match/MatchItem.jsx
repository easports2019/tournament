import React, { useEffect } from 'react'
import { RichCell, Avatar, Group, FormItem, Textarea, CardGrid, Card, Title, Caption } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import { dateToString, TimeIsNotAssigned, timeToString } from '../../../../utils/convertors/dateUtils';

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

const CardStyle = {
        display: "flex", 
        height: "100px", 
        justifyContent: "center", 
        alignItems: "center",
        flexWrap: "no-wrap",
        alignSelf: "center",
        alignContent: "center",
        overflow: "hidden",
    }

const CardResultStyle = {
        display: "flex", 
        height: "100px", 
        justifyContent: "center", 
        alignItems: "center",
        flexWrap: "wrap",
        overflow: "hidden",
    }

const MatchItem = (props) => {
    
    
    let match=props.match;
    let place=props.Place;
    let date = match.When != null ? new Date(match.When) : null;
    let time = date != null 
    ? (TimeIsNotAssigned(date) ? " время не указано" : ` в ${timeToString(date.getHours(), date.getMinutes())}`)
    : "";

    const subCardStyle = {
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: "column",
        color: match.Played ? "green" : "blue",
        overflow: "hidden",
    }

    const centering = {
        textAlign: "center",
    }

    return (
        <Group>
            
            <FormItem>
                <Caption level="4" weight="regular">
                    {match.TournamentGroup.Tournament.OrganizatorName}
                </Caption>
                <Caption level="3" weight="regular">
                    {match.TournamentGroup.Tournament.Name}
                </Caption>
                <Caption level="2" weight="regular">
                    {match.TournamentGroup.Name}
                </Caption>
                <Caption level="1" weight="bold">
                    {date != null
                    ? <span>{`${dateToString(date)}`}</span>
                    : "Дата не назначена"
                    }
                </Caption>
            </FormItem>
            <FormItem></FormItem>
            <CardGrid size="s">
                <Card style={CardStyle}>
                    <div  style={centering}>
                        {match.Team1Bid.TeamName} 
                    </div>
                </Card>
                <Card style={CardResultStyle} mode="shadow">

                    <div style={subCardStyle}>
                        <Title level="1" weight="bold">
                            {match && (match.Played ? `  ${match.Team1Goals} : ${match.Team2Goals}  ` : `    `)} 
                        </Title>
                        <Caption level="4" weight="bold">
                            {match.Place.Name}
                        </Caption>
                        <Caption level="1" weight="bold">
                            {time}
                        </Caption>
                    </div>
                     
                </Card>
                <Card style={CardStyle}>
                <div  style={centering}>
                    {match.Team2Bid.TeamName}
                </div>
                </Card>
            </CardGrid>
            <FormItem></FormItem>
            <FormItem top="Комментарий к матчу">
                <Textarea 
                value={match.Description} 
                readOnly
                style={{minHeight: '100px'}}
                ></Textarea>
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