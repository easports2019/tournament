import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, CellButton, Button, FormItem, CustomSelect, DatePicker, CustomSelectOption, Header, SimpleCell, Div } from '@vkontakte/vkui'
import Icon24ChevronRightWithHistory from '../../Common/WithHistory/Icon24ChevronRightWithHistory'
import { connect } from 'react-redux';
import {
    getTournamentTeams, 
} from '../../../../store/tournamentsReducer'
import {
    setMode, setAccess, addMatchToShedule, getAllMatchesByTournament, delMatchFromShedule,
} from '../../../../store/matchReducer'


// const SheduleContainer = (props) => {

    
    
//     return <Shedule props={...props}></Shedule>
// }


const Shedule = (props) => {
    
    useEffect(() => {
        debugger
        props.getAllMatchesByTournament(props.tournaments.selected, props.myProfile)
    }, props.tournaments.selected)

    let isAdminMode = props.mode == "admin" ? true : false;
    let tournament = props.tournament;
    let today = props.todayIs;
    
    // создание объектов для заполнения выпадающих списков (count - сколько элементов, makeZeroBefore - дописывать ли нули впереди к цифрам от 0 до 9)
    let optMaker = (count, makeZeroBefore = true) => {
        let m = [];
        for (let i = 0; i < count; i++)
        m = [...m, {value: i, label: ((i <= 9) && (makeZeroBefore)) ? "0"+i : i}]
        return m
    }
    
    let groups = tournament.TournamentGroups.map(g =>  {return {value: g.Id, label: g.Name}} )
    //debugger
    let places = props.places
                            .map(p =>  p.Name.length ? p : null)
                            .filter(p => p)
                            .map(p => {return {value: p.PlaceId, label: p.Name, title: p.Name}});
    let teams = [{value: 0, label: "Не выбрано"}]
    let hours = [...optMaker(24)];
    let minutes = [...optMaker(60)];
    let teamGoals = [...optMaker(99, false)];
    
    const [selectedTournamentGroup, setSelectedTournamentGroup] = React.useState((groups && Array.isArray(groups) && groups.length > 0) ? groups[0] : null);
    
    const [selectedTournamentGroupTeamList, setSelectedTournamentGroupTeamList] = React.useState(teams);
    
    const [selectedTeam1, setSelectedTeam1] = React.useState(0);
    const [selectedTeam2, setSelectedTeam2] = React.useState(0);
    const [selectedTeam1Goals, setTeam1Goals] = React.useState(0);
    const [selectedTeam2Goals, setTeam2Goals] = React.useState(0);
    const [selectedPlace, setSelectedPlace] = React.useState(0);
    const [selectedDate, setSelectedDate] = React.useState({day: new Date().getDate(), month: new Date().getMonth()+1, year: new Date().getFullYear()});
    const [selectedHour, setSelectedHour] = React.useState([hours[0].value]);
    const [selectedMinute, setSelectedMinute] = React.useState(minutes[0].value);

    let getGroup = (groupId) => {
        return tournament.TournamentGroups.find(x => x.Id == groupId);
    }

    let changeGroup = (league_id) => {
        setSelectedTournamentGroup(league_id);
        setSelectedTournamentGroupTeamList(getGroup(league_id).Teams.map(team => {return {value: team.Id, label: team.Name}}));
    }

    let allMatchesInAllGroups = []
    props.tournaments.selected.TournamentGroups.forEach(tg => {
        
        allMatchesInAllGroups.push({
            TournamentGroup: {...tg}, 
            Matches: [...props.matches.filter(m => m.TournamentGroup.Id == tg.Id)]})
    })
    
    let addMatch = () => {
        
        let match = {
            When: selectedDate,
            TournamentGroupId: selectedTournamentGroup,
            // TournamentGroup: {
            //     Id: selectedTournamentGroup,
            //     Tournament: {...props.tournaments.selected}
            // },
            PlaceId: selectedPlace,
            Team1Id: selectedTeam1,
            Team2Id: selectedTeam2,
            Team1Goals: selectedTeam1Goals,
            Team2Goals: selectedTeam2Goals,
        }
        
        props.addMatchToShedule(match, props.myProfile, selectedHour, selectedMinute);
    }


    let delCurrentMatch = () => {
        
        let match = {
            When: selectedDate,
            TournamentGroupId: selectedTournamentGroup,
            // TournamentGroup: {
            //     Id: selectedTournamentGroup,
            //     Tournament: {...props.tournaments.selected}
            // },
            PlaceId: selectedPlace,
            Team1Id: selectedTeam1,
            Team2Id: selectedTeam2,
        }
        
        props.delMatchFromShedule(match, props.myProfile, selectedHour, selectedMinute)
        //props.addMatchToShedule(match, props.myProfile, selectedHour, selectedMinute);
    }

    let goToEditMatch = (match) => {
        debugger

        groups = tournament.TournamentGroups.map(g =>  {return {value: g.Id, label: g.Name}} )
    //debugger
        places = props.places
                                .map(p =>  p.Name.length ? p : null)
                                .filter(p => p)
                                .map(p => {return {value: p.PlaceId, label: p.Name, title: p.Name}});
        teams = [{value: 0, label: "Не выбрано"}]
        hours = [...optMaker(24)];
        minutes = [...optMaker(60)];
        teamGoals = [...optMaker(99, false)];
        
        let date = new Date(match.When);
        
        
        setSelectedTournamentGroupTeamList(getGroup(match.TournamentGroupId).Teams.map(team => {return {value: team.Id, label: team.Name}}));
        setSelectedTournamentGroup(match.TournamentGroupId);
        setTeam1Goals(match.Team1Goals);
        setTeam2Goals(match.Team2Goals);
        setSelectedTeam1(match.Team1.Id)
        setSelectedTeam2(match.Team2.Id)
        setSelectedPlace(match.PlaceId)
        setSelectedDate({day: date.getDate(), month: date.getMonth()+1, year: date.getFullYear()})
        setSelectedHour(date.getHours())
        setSelectedMinute(date.getMinutes())

        props.setMode("edit")
    }


// выводим список существующего расписания с кнопками редактирования, удаления, переноса
// группируем список по датам, сортируем от последних к первым (последние выше)
// сделать кнопку сортировки\
    debugger
    switch (props.access){
        case "admin": {
            switch (props.mode){
                case "list":{
                    return (
                        <Group>
                            <CellButton onClick={() => props.setMode("add")}>Добавить</CellButton>
                            <List>
                               {allMatchesInAllGroups.map(groupAndMatchesItem => {
                                   
                                   return <Group  header={<Header mode="secondary">{groupAndMatchesItem.TournamentGroup.Name}</Header>}>
                                       {groupAndMatchesItem.Matches.length > 0 ?
                                       <List>
                                            {groupAndMatchesItem.Matches.map(match => {
                                                let place = props.places.find(p => p.PlaceId == match.PlaceId)
                                                let date = new Date(match.When);
                                                return <RichCell 
                                                caption={place.Name}
                                                text={`${date.toLocaleDateString()} в ${date.toLocaleTimeString()} `}
                                                onClick={() => goToEditMatch(match)}
                                                >
                                                    {`${match.Team1.Name} - ${match.Team2.Name}`} 
                                                </RichCell>
                                            })}
                                       </List>
                                       :
                                       <SimpleCell>Нет расписания в группе</SimpleCell>
                               }
                                   </Group>
                               }
                                )}
                            </List>
                            <CellButton onClick={() => props.setMode("add")}>Добавить</CellButton>
                        </Group>
                    )
                }; break;
                case "view":{
                    return (
                        <Group>
                            <Button>Назад</Button>
                        </Group>
                    )
                }; break;
                case "add":{
                    return (
                        <Group>
                            <FormItem top="Группа/лига">
                                <CustomSelect
                                placeholder="Не выбрано"
                                options={groups}
                                value={selectedTournamentGroup}
                                onChange={(option) => changeGroup(option.currentTarget.value)}
                                renderOption={({ ...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                            </FormItem>
                            <FormItem top="Команда 1">
                                <CustomSelect
                                placeholder="Не выбрано"
                                options={selectedTournamentGroupTeamList}
                                value={selectedTeam1}
                                onChange={(option) => {
                                    setSelectedTeam1(option.currentTarget.value)
                                }}
                                renderOption={({ ...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                            </FormItem>
                            <FormItem top="Команда 2">
                                <CustomSelect
                                placeholder="Не выбрано"
                                options={selectedTournamentGroupTeamList}
                                value={selectedTeam2}
                                onChange={(option) => {
                                    setSelectedTeam2(option.currentTarget.value)
                                }}
                                renderOption={({ ...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                            </FormItem>
                            <FormItem top="Дата">
                                <DatePicker
                                min={{day: 1, month: 1, year: new Date().getFullYear()-1}}
                                max={{day: 1, month: 1, year: new Date().getFullYear()+1}}
                                defaultValue={selectedDate}
                                onDateChange={(value) => setSelectedDate(value)}
                                />
                            </FormItem>
                            <FormItem top="Время">
                                <CustomSelect
                                placeholder="Не выбрано"
                                
                                options={hours}
                                value={selectedHour}
                                onChange={(option) => setSelectedHour(option.currentTarget.value)}
                                renderOption={({...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                                <CustomSelect
                                placeholder="Не выбрано"
                                
                                options={minutes}
                                value={selectedMinute}
                                onChange={(option) => setSelectedMinute(option.currentTarget.value)}
                                renderOption={({...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                            </FormItem>
                            
                            <FormItem top="Место">
                            <CustomSelect
                                placeholder="Не выбрано"
                                options={places}
                                value={selectedPlace}
                                onChange={(option) => 
                                    //changePlace(option.currentTarget.value)
                                    setSelectedPlace(option.currentTarget.value)
                                }
                                renderOption={({ ...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                            </FormItem>
                            <Button onClick={() => props.setMode("list")}>Отмена</Button>
                            <Button onClick={() => addMatch()}>Добавить</Button>
                        </Group>
                    )
                }; break;
                case "edit":{
                    return (
                        <Group>
                            <FormItem top="Группа/лига">
                                <CustomSelect
                                placeholder="Не выбрано"
                                options={groups}
                                value={selectedTournamentGroup}
                                onChange={(option) => changeGroup(option.currentTarget.value)}
                                renderOption={({ ...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                            </FormItem>
                            <FormItem top="Команда 1">
                                <CustomSelect
                                placeholder="Не выбрано"
                                options={selectedTournamentGroupTeamList}
                                value={selectedTeam1}
                                onChange={(option) => {
                                    setSelectedTeam1(option.currentTarget.value)
                                }}
                                renderOption={({ ...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                            </FormItem>
                            <FormItem top="Команда 2">
                                <CustomSelect
                                placeholder="Не выбрано"
                                options={selectedTournamentGroupTeamList}
                                value={selectedTeam2}
                                onChange={(option) => {
                                    setSelectedTeam2(option.currentTarget.value)
                                }}
                                renderOption={({ ...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                            </FormItem>
                            <FormItem top="Дата">
                                <DatePicker
                                min={{day: 1, month: 1, year: new Date().getFullYear()-1}}
                                max={{day: 1, month: 1, year: new Date().getFullYear()+1}}
                                defaultValue={selectedDate}
                                onDateChange={(value) => setSelectedDate(value)}
                                />
                            </FormItem>
                            <FormItem top="Время">
                                <CustomSelect
                                placeholder="Не выбрано"
                                
                                options={hours}
                                value={selectedHour}
                                onChange={(option) => setSelectedHour(option.currentTarget.value)}
                                renderOption={({...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                                <CustomSelect
                                placeholder="Не выбрано"
                                
                                options={minutes}
                                value={selectedMinute}
                                onChange={(option) => setSelectedMinute(option.currentTarget.value)}
                                renderOption={({...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                            </FormItem>
                            <FormItem top="Счёт">
                                <Div>Команда 1</Div>
                                <CustomSelect
                                placeholder="0"
                                title="Команда 1"
                                options={teamGoals}
                                value={selectedTeam1Goals}
                                onChange={(option) => setTeam1Goals(option.currentTarget.value)}
                                renderOption={({...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                                <Div>Команда 2</Div>
                                <CustomSelect
                                placeholder="0"
                                title="Команда 2"
                                options={teamGoals}
                                value={selectedTeam2Goals}
                                onChange={(option) => setTeam2Goals(option.currentTarget.value)}
                                renderOption={({...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                            </FormItem>
                            
                            <FormItem top="Место">
                            <CustomSelect
                                placeholder="Не выбрано"
                                options={places}
                                value={selectedPlace}
                                onChange={(option) => 
                                    //changePlace(option.currentTarget.value)
                                    setSelectedPlace(option.currentTarget.value)
                                }
                                renderOption={({ ...otherProps }) => {
                                    return (
                                    <CustomSelectOption
                                        {...otherProps}
                                    />
                                    );
                                }}
                                />
                            </FormItem>
                            <Button onClick={() => props.setMode("list")}>Отмена</Button>
                            <Button onClick={() => addMatch()}>Сохранить</Button>
                            <Button onClick={() => delCurrentMatch()} align="right" mode="destructive">Удалить</Button>
                        </Group>
                    )
                }; break;
            }
        };break;
        case "user": {
            switch (props.mode){
                case "list":{
            
                }; break;
                case "view":{}; break;
                case "add":{}; break;
                case "edit":{}; break;
            }
        };break;

    }

}

let mapStateToProps = (state) => {
    return {
        tournaments: state.tournamentsEntity,
        mode: state.matches.mode,
        matches: state.matches.matches,
        places: state.placeEntity.places,
        myProfile: state.profileEntity.myProfile,
        // пожалуй, нужно места загрузить сразу при запуске приложения и использовать их без изменения из хранилища, а не запрашивать каждый раз с сревера. они редко меняются.
        //access: state.matches.access,
    }
}

export default connect(mapStateToProps,{
    getTournamentTeams, setMode, setAccess, addMatchToShedule, getAllMatchesByTournament, delMatchFromShedule,
})(Shedule)