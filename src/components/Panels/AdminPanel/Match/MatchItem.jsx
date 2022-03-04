import React, { useEffect } from 'react'
import { RichCell, Avatar, Group, FormItem, Textarea, CardGrid, Card, Title, Caption } from '@vkontakte/vkui'
import {defaultPhotoPath} from '../../../../store/dataTypes/common'
import { dateToString, TimeIsNotAssigned, timeToString, dateIsMin, datesWithoutTimeIsSame, addToDate } from '../../../../utils/convertors/dateUtils';

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


const CardResultStyle = {
    display: "flex", 
    height: "100px", 
    justifyContent: "center", 
    alignItems: "center",
    overflow: "hidden",   
    flexWrap: "wrap",
}

const CardStyle = {
        ...CardResultStyle,

        flexWrap: "no-wrap",
        alignSelf: "center",
        alignContent: "center",
    }


const MatchItem = (props) => {
    
    
    let match=props.match;
    let place=props.Place;
    //let date = (match.When != null && !dateIsMin(match.When)) ? new Date(match.When) : null;
    let date = (match.When != null && !dateIsMin(match.When)) 
        ? new Date(match.When) 
        : null;
    let time = date != null 
    ? (TimeIsNotAssigned(date) ? " время не указано" : ` в ${timeToString(date.getHours(), date.getMinutes())}`)
    : "";

    const subCardStyle = {
        ...CardResultStyle,

        height: 'auto',
        flexDirection: "column",
        color: match.Played ? "green" : "blue",
        flexWrap: "no-wrap",
        alignSelf: "center",
        alignContent: "center",
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
            </FormItem>
            <FormItem>
                <Caption level="1" weight="bold">
                    {date != null
                    ? <span>{`${dateToString(date, 0,0,0, true, true)}`}</span>
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
 }

export default MatchItem