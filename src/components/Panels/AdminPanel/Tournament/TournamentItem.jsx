import React from 'react'
import { RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker, Textarea, File, CellButton, Button, Header } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import { setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails } from '../../../../store/tournamentsReducer'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';
import { connect } from 'react-redux';




const TournamentItem = (props) => {
    let currentDate = new Date();

    switch (props.mode) {
        case "view": {
            return (
                <>
                    <div>Турнир</div>
                    <div>Название</div>
                    <div>Дата начала</div>
                    <div>Дата окончания</div>
                    <div>Группы</div>
                    <div>Описание</div>
                    <div>Логотип</div>

                    <div>Город (автоматически)</div>
                </>
            )
        }; break;
        case "add": {
            return (
                <Group>
                    <Header>Новый турнир</Header>
                    <FormLayout>
                        <FormItem top="Ваш город">
                            <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                        </FormItem>
                        <FormItem top="Название турнира" bottom="Имя турнира должно быть уникальным">
                            <Input type="text" defaultValue={props.tournaments.selected.Name} onChange={e => props.setTournamentName(e.currentTarget.value)} placeholder="Например, II чемпионат города Истра 2023 года на призы..." />
                        </FormItem>
                        <FormItem top="Дата начала">
                            <DatePicker
                            min={{day: 1, month: 1, year: currentDate.getFullYear()-1}}
                            max={{day: 1, month: 1, year: currentDate.getFullYear()+1}}
                            defaultValue={props.tournaments.selected.WhenBegin}
                            onDateChange={value => props.setTournamentWhenBegin(value)}
                            />
                        </FormItem>
                        <FormItem top="Дата окончания">
                            <DatePicker
                            min={{day: 1, month: 1, year: currentDate.getFullYear()-1}}
                            max={{day: 1, month: 1, year: currentDate.getFullYear()+1}}
                            defaultValue={props.tournaments.selected.WhenEnd}
                            onDateChange={value => props.setTournamentWhenEnd(value)}
                            />
                        </FormItem>
                        <FormItem top="Описание турнира">
                            <Textarea defaultValue={props.tournaments.selected.Details} onChange={e => props.setTournamentDetails(e.currentTarget.value)} placeholder="Описание турнира" />
                        </FormItem>
                        <FormItem top="Регламент турнира">
                            <Textarea defaultValue={props.tournaments.selected.Reglament} placeholder="Регламент турнира" onChange={e => props.setTournamentReglament(e.currentTarget.value)} />
                        </FormItem>
                        {/* <FormItem top="Загрузите ваше фото">
                            <File before={<Icon24Camera />} controlSize="m">
                                Выбрать фото
                            </File>
                        </FormItem> */}
                        <FormItem top="Группы">
                            <CellButton before={<Icon28AddOutline />}>Добавить группу</CellButton>
                        </FormItem>
                        <FormItem top="Подверждение">
                            <Button>Сохранить</Button>
                            <Button mode="secondary">Отмена</Button>
                        </FormItem>
                    </FormLayout>
                </Group>
            )
        }; break;
        case "edit": {
            return (
                <Group>
                    <InfoRow>Управление турниром</InfoRow>
                    <FormLayout>
                        <FormItem top="Ваш город">
                            <InfoRow>{props.myProfile.CityUmbracoName}</InfoRow>
                        </FormItem>
                        <FormItem top="Название турнира" bottom="Имя турнира должно быть уникальным">
                            <Input type="text" defaultValue={props.tournaments.selected.Name} onChange={e => props.setTournamentName(e.currentTarget.value)} placeholder="Например, II чемпионат города Истра 2023 года на призы..." />
                        </FormItem>
                        <FormItem top="Дата начала">
                            <DatePicker
                            min={{day: 1, month: 1, year: currentDate.getFullYear()-1}}
                            max={{day: 1, month: 1, year: currentDate.getFullYear()+1}}
                            defaultValue={props.tournaments.selected.WhenBegin}
                            onDateChange={value => props.setTournamentWhenBegin(value)}
                            />
                        </FormItem>
                        <FormItem top="Дата окончания">
                            <DatePicker
                            min={{day: 1, month: 1, year: currentDate.getFullYear()-1}}
                            max={{day: 1, month: 1, year: currentDate.getFullYear()+1}}
                            defaultValue={props.tournaments.selected.WhenEnd}
                            onDateChange={value => props.setTournamentWhenEnd(value)}
                            />
                        </FormItem>
                        <FormItem top="Описание турнира">
                            <Textarea defaultValue={props.tournaments.selected.Details}  onChange={e => props.setTournamentDetails(e.currentTarget.value)} placeholder="Описание турнира" />
                        </FormItem>
                        <FormItem top="Регламент турнира">
                            <Textarea defaultValue={props.tournaments.selected.Reglament} placeholder="Регламент турнира" onChange={e => props.setTournamentReglament(e.currentTarget.value)} />
                        </FormItem>
                        <FormItem top="Загрузите ваше фото">
                            <File before={<Icon24Camera />} controlSize="m">
                                Выбрать фото
                            </File>
                        </FormItem>
                        <FormItem top="Группы">
                            <CellButton before={<Icon28AddOutline />}>Добавить группу</CellButton>
                        </FormItem>
                    </FormLayout>
                </Group>
            )
        }; break;
    }


}

const mapStateToProps = (state) => {
    return {
        tournaments: state.tournamentsEntity,
        cities: state.cityEntity.cities,
        myProfile: state.profileEntity.myProfile,
    }
}

export default connect(mapStateToProps, {
    setTournamentWhenBegin, setTournamentWhenEnd, setTournamentName, setTournamentReglament, setTournamentDetails, 
}) (TournamentItem)