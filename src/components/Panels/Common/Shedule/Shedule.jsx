import React, { useEffect } from 'react'
import { RichCell, Avatar, InfoRow, Group, List, CellButton, Button, FormItem, CustomSelect } from '@vkontakte/vkui'
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
                            Дата
                            Время
                            Место
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
        //access: state.matches.access,
    }
}

export default connect(mapStateToProps,{
    getTournamentTeams, setMode, setAccess, 
})(Shedule)