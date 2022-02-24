import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, CellButton, Button, FormItem, CustomSelect, DatePicker, CustomSelectOption, Header, SimpleCell, Div, Headline, Textarea, Search } from '@vkontakte/vkui'
import Icon24ChevronRightWithHistory from '../../Common/WithHistory/Icon24ChevronRightWithHistory'
import { connect } from 'react-redux';
import {
    getTournamentTeams,
} from '../../../../store/tournamentsReducer'
import {
    setSelectedMatch,
} from '../../../../store/matchReducer'
import {
    goToPanel,
} from '../../../../store/systemReducer'
import {
    setMode, setAccess, addMatchToShedule, getAllMatchesByTournament, delMatchFromShedule,
} from '../../../../store/matchReducer'
import { Checkbox } from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import ButtonWithNotify from '../WithNotify/ButtonWithNotify';
import MatchListItem from '../../AdminPanel/Match/MatchListItem';
import { TimeIsNotAssigned } from '../../../../utils/convertors/dateUtils';


// const SheduleContainer = (props) => {



//     return <Shedule props={...props}></Shedule>
// }


const Shedule = (props) => {

    useEffect(() => {

        props.getAllMatchesByTournament(props.tournaments.selected, props.myProfile)
    }, props.tournaments.selected)

    let isAdminMode = props.mode == "admin" ? true : false;
    let tournament = props.tournament;
    let today = props.todayIs;

    // создание объектов для заполнения выпадающих списков (count - сколько элементов, makeZeroBefore - дописывать ли нули впереди к цифрам от 0 до 9)
    let optMaker = (count, makeZeroBefore = true) => {
        let m = [];
        for (let i = 0; i < count; i++)
            m = [...m, { value: i, label: ((i <= 9) && (makeZeroBefore)) ? "0" + i : i }]
        return m
    }

    let groups = tournament.TournamentGroups.map(g => { return { value: g.Id, label: g.Name } })
    //debugger
    let places = props.places
        .map(p => p.Name.length ? p : null)
        .filter(p => p)
        .map(p => { return { value: p.UmbracoId, label: p.Name, title: p.Name } });
    let teams = [{ value: 0, label: "Не выбрано" }]
    let hours = [...optMaker(24)];
    let minutes = [...optMaker(60)];
    let teamGoals = [...optMaker(99, false)];

    const [selectedTournamentGroup, setSelectedTournamentGroup] = React.useState((groups && Array.isArray(groups) && groups.length > 0) ? groups[0] : null);

    const [selectedTournamentGroupTeamList, setSelectedTournamentGroupTeamList] = React.useState(teams);

    const [selectedTeam1, setSelectedTeam1] = React.useState(0);
    const [selectedTeam2, setSelectedTeam2] = React.useState(0);
    const [selectedBidTeam1ToTournament, setSelectedBidTeam1ToTournament] = React.useState(0);
    const [selectedBidTeam2ToTournament, setSelectedBidTeam2ToTournament] = React.useState(0);
    const [selectedTeam1Goals, setTeam1Goals] = React.useState(0);
    const [selectedTeam2Goals, setTeam2Goals] = React.useState(0);
    const [selectedPlace, setSelectedPlace] = React.useState(0);
    const [selectedDescription, setSelectedDescription] = React.useState("");
    const [selectedId, setSelectedId] = React.useState(0);
    const [selectedPlayed, setSelectedPlayed] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState({ day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    const [selectedHour, setSelectedHour] = React.useState([hours[0].value]);
    const [selectedMinute, setSelectedMinute] = React.useState(minutes[0].value);
    const [timeIsNotAssigned, setTimeIsNotAssigned] = React.useState(false);
    const [dateIsNotAssigned, setDateIsNotAssigned] = React.useState(false);
    

    let getGroup = (groupId) => {
        return tournament.TournamentGroups.find(x => x.Id == groupId);
    }

    let changeGroup = (league_id) => {
        setSelectedTournamentGroup(league_id);
        setSelectedTournamentGroupTeamList(getGroup(league_id).Teams.map(team => { return { value: team.Id, label: team.Name } }));
    }

    // let changeGroup2 = (league_id) => {
    //     setSelectedTournamentGroup(league_id);
    //     setSelectedTournamentGroupTeamList(getGroup(league_id).Teams.map(team => { return { value: team.Id, label: team.Name } }));
    // }

    let allMatchesInAllGroups = []
    props.tournaments.selected.TournamentGroups.forEach(tg => {

        allMatchesInAllGroups.push({
            TournamentGroup: { ...tg },
            Matches: [...props.matches.filter(m => m.TournamentGroup.Id == tg.Id)]
        })
    })

    let addMatch = (editId) => {

        let match = (editId >= 0) ?
            {
                Id: editId,
                When: !dateIsNotAssigned ? selectedDate : null,
                TournamentGroupId: selectedTournamentGroup,
                PlaceId: selectedPlace,
                Team1Id: selectedTeam1,
                Team2Id: selectedTeam2,
                Description: selectedDescription,
                // BidTeamToTournamentId1: selectedBidTeam1ToTournament,
                // BidTeamToTournamentId2: selectedBidTeam2ToTournament,
                BidTeamToTournamentId1: -1,
                BidTeamToTournamentId2: -1,
                Team1Goals: selectedTeam1Goals,
                Team2Goals: selectedTeam2Goals,
                Played: selectedPlayed,
            } :
            {
                When: !dateIsNotAssigned ? selectedDate : null,
                TournamentGroupId: selectedTournamentGroup,
                PlaceId: selectedPlace,
                Team1Id: selectedTeam1,
                Team2Id: selectedTeam2,
                Description: selectedDescription,
                // BidTeamToTournamentId1: selectedBidTeam1ToTournament,
                // BidTeamToTournamentId2: selectedBidTeam2ToTournament,
                BidTeamToTournamentId1: -1,
                BidTeamToTournamentId2: -1,
                Team1Goals: selectedTeam1Goals,
                Team2Goals: selectedTeam2Goals,
                Played: selectedPlayed,
            };

            if (!timeIsNotAssigned)
                props.addMatchToShedule(match, props.myProfile, selectedHour, selectedMinute);
            else
                props.addMatchToShedule(match, props.myProfile, 0, 0, 5);

        props.setMode("list")
    }


    let delCurrentMatch = () => {

        let match = {
            When: selectedDate,
            Id: selectedId,
            TournamentGroupId: selectedTournamentGroup,
            // TournamentGroup: {
            //     Id: selectedTournamentGroup,
            //     Tournament: {...props.tournaments.selected}
            // },
            PlaceId: selectedPlace,
            Team1Id: selectedTeam1,
            Team2Id: selectedTeam2,
            Played: selectedPlayed,
        }

        props.delMatchFromShedule(match, props.myProfile, selectedHour, selectedMinute)
        props.setMode("list")
        //props.addMatchToShedule(match, props.myProfile, selectedHour, selectedMinute);
    }

    let goToEditMatch = (match) => {
        debugger

        groups = tournament.TournamentGroups.map(g => { return { value: g.Id, label: g.Name } })
        //debugger
        places = props.places
            .map(p => p.Name.length ? p : null)
            .filter(p => p)
            .map(p => { return { value: p.UmbracoId, label: p.Name, title: p.Name } });
        teams = [{ value: 0, label: "Не выбрано" }]
        hours = [...optMaker(24)];
        minutes = [...optMaker(60)];
        teamGoals = [...optMaker(99, false)];

        let date = new Date(match.When);


        //setSelectedTournamentGroupTeamList(getGroup(match.TournamentGroupId).Teams.map(team => { return { value: team.Id, label: team.Name } }));
        setSelectedTournamentGroupTeamList(getGroup(match.TournamentGroupId).Teams.map(team => { return { value: team.Id, label: team.Name } }));
        setSelectedTournamentGroup(match.TournamentGroupId);
        setSelectedId(match.Id);
        setSelectedDescription(match.Description);
        setTeam1Goals(match.Team1Goals);
        setTeam2Goals(match.Team2Goals);
        setSelectedBidTeam1ToTournament(match.Team1BidId);
        setSelectedBidTeam2ToTournament(match.Team2BidId);
        setSelectedTeam1(match.Team1.Id)
        setSelectedTeam2(match.Team2.Id)
        setSelectedPlace(match.PlaceId)
        setSelectedPlayed(match.Played)
        setSelectedDate({ day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() })
        setSelectedHour(date.getHours())
        setSelectedMinute(date.getMinutes())

        setDateIsNotAssigned(match.When == null ? true : false);
        setTimeIsNotAssigned(TimeIsNotAssigned(date));

        props.setMode("edit")
    }

    let goToViewMatch = (match) => {


        props.setSelectedMatch(match)

        props.goToPanel("matchitem", false)
    }
    

    let changeTimeIsNotAssigned = (assigned) => {
        setTimeIsNotAssigned(assigned);
    }
    

    let changeDateIsNotAssigned = (assigned) => {
        setDateIsNotAssigned(assigned);
    }

//debugger
    // выводим список существующего расписания с кнопками редактирования, удаления, переноса
    // группируем список по датам, сортируем от последних к первым (последние выше)
    // сделать кнопку сортировки\

    switch (props.access) {
        case "admin": {
            switch (props.mode) {
                case "list": {
                    return (
                        <Group>
                            <CellButton onClick={() => props.setMode("add")}>Добавить</CellButton>
                            <List>
                                {allMatchesInAllGroups.map(groupAndMatchesItem => {
                                    return <Group header={<Header mode="secondary">{groupAndMatchesItem.TournamentGroup.Name}</Header>}>
                                        {groupAndMatchesItem.Matches.length > 0 ?
                                            <List>
                                                {
                                                groupAndMatchesItem.Matches
                                                .sort((prev, next) => {
                                                    let a = new Date(prev.When);
                                                    let b = new Date(next.When);
                                                    if (a < b) return 1
                                                    else return -1;
                                                })
                                                .map(match => {
                                                    let place = props.places.find(p => p.UmbracoId == match.PlaceId)
                                                    let date = match.When != null ? new Date(match.When) : null;
                                                    return <MatchListItem 
                                                        ClickHandler={() => goToEditMatch(match)}
                                                        Match={match} Place={place}
                                                        ></MatchListItem>
                                                    // <RichCell
                                                    //     caption={place.Name}
                                                    //     text={
                                                    //         match.Played ?
                                                    //             <span style={{ "color": "green" }}>Сыгран {`${date.toLocaleDateString()} в ${date.toLocaleTimeString()}`}</span> :
                                                    //             <span style={{ "color": "blue" }}>Состоится {`${date.toLocaleDateString()} в ${date.toLocaleTimeString()}`}</span>
                                                    //     }
                                                        
                                                    // >
                                                    //     {match.Played ?
                                                    //         `${match.Team1.Name} ${match.Team1Goals} - ${match.Team2Goals} ${match.Team2.Name}` :
                                                    //         `${match.Team1.Name} - ${match.Team2.Name}`
                                                    //     }
                                                    // </RichCell>
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
                case "view": {
                    return (
                        <Group>
                            <Button>Назад</Button>
                        </Group>
                    )
                }; break;
                case "add": {
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
                                <Checkbox checked={dateIsNotAssigned} onChange={() => changeDateIsNotAssigned(!dateIsNotAssigned)}>Дата не назначена</Checkbox>
                                {!dateIsNotAssigned &&
                                    <>
                                        <DatePicker
                                            min={{ day: 1, month: 1, year: new Date().getFullYear() - 1 }}
                                            max={{ day: 1, month: 1, year: new Date().getFullYear() + 1 }}
                                            defaultValue={selectedDate}
                                            onDateChange={(value) => setSelectedDate(value)}
                                        />
                                        <FormItem top="Время">
                                        <Checkbox checked={timeIsNotAssigned} onChange={() => changeTimeIsNotAssigned(!timeIsNotAssigned)}>Время не назначено</Checkbox>
                                            {!timeIsNotAssigned &&
                                                <>
                                                    <CustomSelect
                                                        placeholder="Не выбрано"

                                                        options={hours}
                                                        value={selectedHour}
                                                        onChange={(option) => setSelectedHour(option.currentTarget.value)}
                                                        renderOption={({ ...otherProps }) => {
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
                                                        renderOption={({ ...otherProps }) => {
                                                            return (
                                                                <CustomSelectOption

                                                                    {...otherProps}
                                                                />
                                                            );
                                                        }}
                                                    />
                                                </>
                                            }
                                        </FormItem>
                                    </>
                                }
                            </FormItem>

                            <FormItem top="Счёт">
                                <Div>Команда 1</Div>
                                <CustomSelect
                                    placeholder="0"
                                    title="Команда 1"
                                    options={teamGoals}
                                    value={selectedTeam1Goals}
                                    onChange={(option) => setTeam1Goals(option.currentTarget.value)}
                                    renderOption={({ ...otherProps }) => {
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
                                    renderOption={({ ...otherProps }) => {
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
                            <FormItem top="Комментарий к матчу">
                                <Textarea onChange={(e) => setSelectedDescription(e.currentTarget.value)}>{selectedDescription}</Textarea>
                            </FormItem>
                            <FormItem top="Матч сыгран">
                                <Checkbox checked={selectedPlayed} onChange={() => setSelectedPlayed(!selectedPlayed)}>Сыгран</Checkbox>
                            </FormItem>
                            <Button onClick={() => props.setMode("list")}>Отмена</Button>
                            <ButtonWithNotify Message="Добавить матч?" Yes={() => addMatch(-1)}>Добавить</ButtonWithNotify>
                        </Group>
                    )
                }; break;
                case "edit": {
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
                                <Checkbox checked={dateIsNotAssigned} onChange={() => changeDateIsNotAssigned(!dateIsNotAssigned)}>Дата не назначена</Checkbox>
                                {!dateIsNotAssigned &&
                                    <>
                                        <DatePicker
                                            min={{ day: 1, month: 1, year: new Date().getFullYear() - 1 }}
                                            max={{ day: 1, month: 1, year: new Date().getFullYear() + 1 }}
                                            defaultValue={selectedDate}
                                            onDateChange={(value) => setSelectedDate(value)}
                                        />
                                        <FormItem top="Время">
                                                <Checkbox checked={timeIsNotAssigned} onChange={() => changeTimeIsNotAssigned(!timeIsNotAssigned)}>Время не назначено</Checkbox>
                                                    {!timeIsNotAssigned &&
                                                        <>
                                                    <CustomSelect
                                                        placeholder="Не выбрано"

                                                        options={hours}
                                                        value={selectedHour}
                                                        onChange={(option) => setSelectedHour(option.currentTarget.value)}
                                                        renderOption={({ ...otherProps }) => {
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
                                                        renderOption={({ ...otherProps }) => {
                                                            return (
                                                                <CustomSelectOption

                                                                    {...otherProps}
                                                                />
                                                            );
                                                        }}
                                                    />
                                                </>
                                            }
                                        </FormItem>
                                    </>
                                }
                            </FormItem>
                            <FormItem top="Счёт">
                                <Div>Команда 1</Div>
                                <CustomSelect
                                    placeholder="0"
                                    title="Команда 1"
                                    options={teamGoals}
                                    value={selectedTeam1Goals}
                                    onChange={(option) => setTeam1Goals(option.currentTarget.value)}
                                    renderOption={({ ...otherProps }) => {
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
                                    renderOption={({ ...otherProps }) => {
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
                            <FormItem top="Комментарий к матчу">
                                <Textarea onChange={(e) => setSelectedDescription(e.currentTarget.value)} value={selectedDescription}></Textarea>
                            </FormItem>
                            <FormItem top="Матч сыгран">
                                <Checkbox checked={selectedPlayed} onChange={() => setSelectedPlayed(!selectedPlayed)}>Сыгран</Checkbox>
                            </FormItem>
                            <Button onClick={() => props.setMode("list")}>Отмена</Button>
                            <ButtonWithNotify Message="Сохранить матч?" Yes={() => addMatch(selectedId)}>Сохранить</ButtonWithNotify>
                            <ButtonWithNotify Message="Удалить матч?" Yes={() => delCurrentMatch()} align="right" mode="destructive">Удалить</ButtonWithNotify>
                        </Group>
                    )
                }; break;
            }
        }; break;
        case "user": {
            switch (props.mode) {
                case "list": {
                    return (
                        <>
                        {/* <Search></Search> */}
                        <Group>
                            <List>
                                <FormItem></FormItem>
                                {allMatchesInAllGroups.map(groupAndMatchesItem => {

                                    return (
                                        <FormItem top={groupAndMatchesItem.TournamentGroup.Name}>
                                            <Group 
                                        // header={<FormItem>
                                        //     <Headline mode="">{groupAndMatchesItem.TournamentGroup.Name}</Headline>
                                        //     </FormItem>}
                                            >
                                            {
                                                groupAndMatchesItem.Matches.length > 0
                                                    ?
                                                    <List>
                                                        {
                                                        groupAndMatchesItem.Matches
                                                        .sort((prev, next) => {
                                                            let a = new Date(prev.When);
                                                            let b = new Date(next.When);
                                                            if (a < b) return 1
                                                            else return -1;
                                                        })
                                                        .map(match => {
                                                            let place = props.places.find(p => p.UmbracoId == match.PlaceId)
                                                            return <MatchListItem 
                                                            ClickHandler={() => goToViewMatch(match)}
                                                            Match={match} Place={place}></MatchListItem>
                                                        })}
                                                    </List>
                                                    :
                                                    <SimpleCell>Нет расписания в группе</SimpleCell>
                                            }
                                        </Group>
                                        </FormItem>
                                    )
                                }
                                )}
                            </List>
                        </Group>
                        </>
                    )
                }; break;
                case "view": {
                    return (
                        <Group>
                            <FormItem top="Группа/лига">
                                {matches.selected.TournamentGroup.Name}
                            </FormItem>
                            <FormItem top="Команда 1">
                                {matches.selected.Team1.Name} {matches.selected.Team1Goals} : {matches.selected.Team2Goals} {matches.selected.Team2.Name}
                            </FormItem>
                            
                            <FormItem top="Дата">
                                {new Date(matches.selected.When).toLocaleDateString()}
                            </FormItem>
                            
                            <FormItem top="Место">
                                {matches.selected.Place.Name}
                            </FormItem>
                            <FormItem top="Матч сыгран">
                                {matches.selected.Played}
                            </FormItem>
                            <Button onClick={() => props.setMode("list")}>Назад</Button>
                        </Group>
                    )    
                }; break;
                case "add": {  return <>add</>}; break;
                case "edit": {  return <>edit</>}; break;
            }
        }; break;

    }

}

let mapStateToProps = (state) => {
    return {
        tournaments: state.tournamentsEntity,
        mode: state.matches.mode,
        matches: state.matches.matches,
        //places: state.placeEntity.places,
        places: state.simplePlaceEntity.places,
        myProfile: state.profileEntity.myProfile,
        // пожалуй, нужно места загрузить сразу при запуске приложения и использовать их без изменения из хранилища, а не запрашивать каждый раз с сревера. они редко меняются.
        //access: state.matches.access,
    }
}

export default connect(mapStateToProps, { goToPanel,
    getTournamentTeams, setMode, setAccess, addMatchToShedule, getAllMatchesByTournament, delMatchFromShedule, setSelectedMatch,
})(Shedule)