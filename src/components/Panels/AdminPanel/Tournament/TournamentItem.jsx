import React from 'react'
import { RichCell, Avatar, FormLayout, FormItem, Input, InfoRow, Group, DatePicker } from '@vkontakte/vkui'
import { defaultPhotoPath } from '../../../../store/dataTypes/common'




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
                    </FormLayout>

                    <div>Группы</div>
                    <div>Описание</div>
                    <div>Логотип</div>

                    <div>Город (автоматически)</div>
                </Group>
            )
        }; break;
        case "edit": {
            return (
                <>
                    <div>Изменить турнир</div>
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
    }


}

export default TournamentItem