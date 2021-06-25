import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, CellButton, Button, FormItem, CustomSelect, DatePicker, CustomSelectOption } from '@vkontakte/vkui'
import Icon24ChevronRightWithHistory from '../../Common/WithHistory/Icon24ChevronRightWithHistory'
import { connect } from 'react-redux';
import {
    getTournamentTeams, 
} from '../../../../store/tournamentsReducer'
import {
    setMode, setAccess, 
} from '../../../../store/matchReducer'



const Shedule = (props) => {
        
    let isAdminMode = props.mode == "admin" ? true : false;
    let tournament = props.tournament;
    let today = props.todayIs;
    debugger
    let optMaker = (count) => {
        let m = [];
        for (let i = 0; i < count; i++)
        m = [...m, {value: i, label: i <= 9 ? "0"+i : i}]
        return m
    }
    
    let groups = tournament.TournamentGroups.map(g =>  {return {value: g.Id, label: g.Name}} )
    let hours = [...optMaker(24)];
    let minutes = [...optMaker(60)];
    
    const [selectedHour, setSelectedHour] = React.useState([hours[0].value]);
    const [selectedMinute, setSelectedMinute] = React.useState(minutes[0].value);
    const [selectedTournamentGroup, setSelectedTournamentGroup] = React.useState((groups && Array.isArray(groups) && groups.length > 0) ? groups[0] : null);
    const [selectedTournamentGroupTeamList, setSelectedTournamentGroupTeamList] = React.useState((selectedTournamentGroup && selectedTournamentGroup.Teams && Array.isArray(selectedTournamentGroup.Teams) && selectedTournamentGroup.Teams.length > 0) 
    ? selectedTournamentGroup.Teams.map(g =>  {return {value: g.Id, label: g.Name}} )
    : null);
    const [selectedTeam1, setSelectedTeam1] = React.useState();
    const [selectedTeam2, setSelectedTeam2] = React.useState();

    let getTeamsFromGroup = (groupId) => {

    }

// выводим список существующего расписания с кнопками редактирования, удаления, переноса
// группируем список по датам, сортируем от последних к первым (последние выше)
// сделать кнопку сортировки
    switch (props.access){
        case "admin": {
            switch (props.mode){
                case "list":{
                    return (
                        <Group>
                            <CellButton onClick={() => props.setMode("add")}>Добавить</CellButton>
                            <List>
                               
                
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
                                onChange={(option) => setSelectedTournamentGroup(option.value)}
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
                                // options={groups}
                                // value={selectedGroup}
                                // onChange={(option) => setSelectedGroup(option.value)}
                                // renderOption={({ option: { src }, ...otherProps }) => {
                                //     return (
                                //     <CustomSelectOption
                                //         before={<Avatar size={20} src={src} />}
                                //         {...otherProps}
                                //     />
                                //     );
                                // }}
                                />
                            </FormItem>
                            <FormItem top="Команда 2">
                                <CustomSelect
                                placeholder="Не выбрано"
                                // options={groups}
                                // value={selectedGroup}
                                // onChange={(option) => setSelectedGroup(option.value)}
                                // renderOption={({ option: { src }, ...otherProps }) => {
                                //     return (
                                //     <CustomSelectOption
                                //         before={<Avatar size={20} src={src} />}
                                //         {...otherProps}
                                //     />
                                //     );
                                // }}
                                />
                            </FormItem>
                            <FormItem top="Дата">
                                <DatePicker
                                min={{day: 1, month: 1, year: 1901}}
                                max={{day: 1, month: 1, year: 2006}}
                                defaultValue={{day: 2, month: 4, year: 1994}}
                                onDateChange={(value) => {console.log(value)}}
                                />
                            </FormItem>
                            <FormItem top="Время">
                                <CustomSelect
                                placeholder="Не выбрано"
                                
                                options={hours}
                                value={selectedHour}
                                onChange={(option) => setSelectedHour(option.value)}
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
                                onChange={(option) => setSelectedMinute(option.value)}
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
                                // options={groups}
                                // value={selectedGroup}
                                // onChange={(option) => setSelectedGroup(option.value)}
                                // renderOption={({ option: { src }, ...otherProps }) => {
                                //     return (
                                //     <CustomSelectOption
                                //         before={<Avatar size={20} src={src} />}
                                //         {...otherProps}
                                //     />
                                //     );
                                // }}
                                />
                            </FormItem>
                            <Button>Отмена</Button>
                            <Button>Добавить</Button>
                        </Group>
                    )
                }; break;
                case "edit":{
                    return (
                        <Group>
                            <Button>Отмена</Button>
                            <Button>Сохранить</Button>
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
        places: state.placeEntity.places,
        tournaments: state.tournamentsEntity,
        // пожалуй, нужно места загрузить сразу при запуске приложения и использовать их без изменения из хранилища, а не запрашивать каждый раз с сревера. они редко меняются.
        //access: state.matches.access,
    }
}

export default connect(mapStateToProps,{
    getTournamentTeams, setMode, setAccess, 
})(Shedule)