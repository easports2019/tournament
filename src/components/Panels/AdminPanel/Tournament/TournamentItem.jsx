import React from 'react'
import { RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker, Textarea, File, CellButton, Button } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'
import { Icon24Camera, Icon28AddOutline } from '@vkontakte/icons';




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
                    <InfoRow>Новый турнир</InfoRow>
                    <InfoRow>Город (автоматически)</InfoRow>
                    <FormLayout>
                        <FormItem top="Название турнира" bottom="Имя турнира должно быть уникальным">
                            <Input type="text" placeholder="Например, II чемпионат города Истра 2023 года на призы..." />
                        </FormItem>
                        <FormItem top="Дата начала">
                            <DatePicker
                            min={{day: 1, month: 1, year: currentDate.getFullYear()-1}}
                            max={{day: 1, month: 1, year: currentDate.getFullYear()+1}}
                            defaultValue={{day: currentDate.getDay(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()}}
                            onDateChange={(value) => {console.log(value)}}
                            />
                        </FormItem>
                        <FormItem top="Дата окончания">
                            <DatePicker
                            min={{day: 1, month: 1, year: currentDate.getFullYear()-1}}
                            max={{day: 1, month: 1, year: currentDate.getFullYear()+1}}
                            defaultValue={{day: currentDate.getDay()+1, month: currentDate.getMonth()+1, year: currentDate.getFullYear()}}
                            onDateChange={(value) => {console.log(value)}}
                            />
                        </FormItem>
                        <FormItem top="Описание турнира">
                          <Textarea placeholder="Описание, регламент турнира" />
                        </FormItem>
                        <FormItem top="Загрузите ваше фото">
                            <File before={<Icon24Camera />} controlSize="m">
                                Выбрать фото
                            </File>
                        </FormItem>
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
                    <InfoRow>Город (автоматически)</InfoRow>
                    <FormLayout>
                        <FormItem top="Название турнира" bottom="Имя турнира должно быть уникальным">
                            <Input type="text" placeholder="Например, II чемпионат города Истра 2023 года на призы..." />
                        </FormItem>
                        <FormItem top="Дата начала">
                            <DatePicker
                            min={{day: 1, month: 1, year: currentDate.getFullYear()-1}}
                            max={{day: 1, month: 1, year: currentDate.getFullYear()+1}}
                            defaultValue={{day: currentDate.getDay(), month: currentDate.getMonth()+1, year: currentDate.getFullYear()}}
                            onDateChange={(value) => {console.log(value)}}
                            />
                        </FormItem>
                        <FormItem top="Дата окончания">
                            <DatePicker
                            min={{day: 1, month: 1, year: currentDate.getFullYear()-1}}
                            max={{day: 1, month: 1, year: currentDate.getFullYear()+1}}
                            defaultValue={{day: currentDate.getDay()+1, month: currentDate.getMonth()+1, year: currentDate.getFullYear()}}
                            onDateChange={(value) => {console.log(value)}}
                            />
                        </FormItem>
                        <FormItem top="Описание турнира">
                          <Textarea placeholder="Описание, регламент турнира" />
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

export default TournamentItem