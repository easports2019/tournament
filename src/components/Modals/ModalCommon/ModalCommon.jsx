import React, { useState, useEffect } from 'react';
import { Group, Header, InfoRow, ModalCard, ModalPage, ModalPageHeader, ModalRoot, SelectMimicry, Textarea, Button, FormLayout, Select, CustomSelectOption, FormItem, FormLayoutGroup, Input, DatePicker } from '@vkontakte/vkui'



let ModalCommon = (props) => {
    // при первом запуске подгрузить города
    let [selectedYear, setSelectedYear] = useState("Не выбран")
    let [selectedCity, setSelectedCity] = useState("Не выбран")
    let [selectedDate, setSelectedDate] = useState("")
    let [bidCity, setBidCity] = useState("")

	useEffect(() => {
		// загрузка городов здесь
		
    }, [])
    
    const setDate = (value) => {
        setSelectedDate(`${value.day}.${value.month}.${value.year}`)
    }
    
    const saveDate = (value) => {
        
        props.action({...props.data, bdate: selectedDate != "" ? selectedDate : undefined})
        props.action2(2);
    }
    
    const saveYear = (value) => {
        
        props.action(
            {...props.data, 
                bdate: props.data.bdate && props.data.bdate + ((!isNaN(selectedYear)) && (selectedYear > 0) && "." + selectedYear)});
        props.action2(2);
    }


    return (
        <ModalRoot activeModal={props.modalName}>
            <ModalPage id="CitySelect"
                header={
                <ModalPageHeader>
                
              </ModalPageHeader>
            }
          >
                <Group>
                    <InfoRow>
                        Ваш город определен как: {props.data.title}
                    </InfoRow>
                    <Header mode="secondary">Выбрать другой город?</Header>
                    <InfoRow top="Город">            
                        <SelectMimicry placeholder="Выбрать город" />
                    </InfoRow>
                </Group>    
            </ModalPage>

            <ModalCard id="Error"
                onClose={props.Close}
                //header={props.data.message ? props.data.message : "Произошла неизвестная ошибка"}
                header={props.data ? props.data : "Произошла неизвестная ошибка"}
                actions={<Button size="l" mode="primary" onClick={props.Close}>Закрыть</Button>}>
                    {/* <Textarea defaultValue="" /> */}
            </ModalCard>

            <ModalCard id="AreYouSure"
                onClose={props.Close}
                header={props.data.message ? props.data.message : "Текст вопроса не передан"}
                actions={
                    <>
                    <Button size="l" mode="destructive" onClick={props.Accept}>Да</Button>
                    <Button size="l" mode="secondary" onClick={props.Close}>Нет</Button>
                </>
            }
                >
                    {/* <Textarea defaultValue="" /> */}
            </ModalCard>

            <ModalCard id="MyProfile"
                onClose={props.Close}
                header={props.data.Name ? props.data.Name : "Имя не прогрузилось"}
                actions={<Button size="l" mode="primary" onClick={props.Close}>Закрыть</Button>}>
                    {/* <Textarea defaultValue="" /> */}
                    {
                        (props.data) ?
                        `Имя: ${props.data.Name && props.data.Name} \r\n
                        Фамилия: ${props.data.Surname && props.data.Surname} \r\n
                        Дата рождения: ${props.data.Birth && props.data.Birth} \r\n
                        Зарегистрирован: ${props.data.Register && props.data.Register} \r\n
                        Город: ${props.data.City && props.data.City.Name && props.data.City.Name}
                        ` : ""
                    }
            </ModalCard>

            <ModalCard id="Info"
                onClose={props.Close}
                icon={props.Icon && props.Icon}
                header={(props.data && props.data.Name) ? props.data.Name : "Имя не прогрузилось"}
                actions={<Button size="l" mode="primary" onClick={props.Close}>Закрыть</Button>}>
                    {/* <Textarea defaultValue="" /> */}
                    {
                        (props.data && props.data.Message) ?
                        props.data.Message
                         : ""
                    }
            </ModalCard>
            
            <ModalCard id="SelectBirthYear"
                // onClose={props.Close}
                header="Укажите Ваш год рождения"
                actions={<Button size="l" mode="primary" onClick={saveYear}>Закрыть</Button>}>
                    <FormLayout>
                        <FormLayoutGroup>
                        <InfoRow header="Год рождения не определен">
                            Год рождения не получилось загрузить из вашего профиля Вконтакте. Укажите реальный год вашего рождения.
                        </InfoRow>
                            <FormItem top="Год рождения">            
                            <Select
                                placeholder="Не выбран" 
                                onChange={(e) => {
                                    setSelectedYear(+e.currentTarget.value)
                                    }}
                                options={[...((start, count) => {
                                    
                                        let current = start;
                                        let result = [];
                                        while (current < start + count){
                                            result.push(current);
                                            current += 1;
                                        }
                                        
                                        return result
                                    })(new Date().getFullYear() - 100, 90)
                                ].map(year => ({ label: year, value: year }))}
                                renderOption={({ option, ...restProps }) => <CustomSelectOption {...restProps} />}
                                />
                            </FormItem>
                        </FormLayoutGroup>
                    </FormLayout>
            </ModalCard>
            
            <ModalCard id="SelectBirth"
                // onClose={props.Close}
                header="Укажите дату вашего рождения"
                actions={
                <Button size="l" mode="primary" 
                onClick={saveDate}>Закрыть</Button>}>
                    <FormLayout>
                        <FormLayoutGroup>
                        <InfoRow header="Год рождения не определен">
                            Дату рождения не получилось загрузить из вашего профиля Вконтакте. Укажите реальную дату вашего рождения.
                        </InfoRow>
                            <FormItem top="Дата рождения">
                                <DatePicker
                                    min={{ day: 1, month: 1, year: new Date().getFullYear() - 100 }}
                                    max={{ day: 1, month: 1, year: new Date().getFullYear()}}
                                    //defaultValue={props.tournaments.selected.WhenEnd}

                                    onDateChange={(e) => setDate(e)}
                                ></DatePicker>            
                            {/* <Select
                                placeholder="Не выбран" 
                                onChange={(e) => {
                                    setSelectedYear(+e.currentTarget.value)
                                    }}
                                options={[...((start, count) => {
                                    
                                        let current = start;
                                        let result = [];
                                        while (current < start + count){
                                            result.push(current);
                                            current += 1;
                                        }
                                        
                                        return result
                                    })(new Date().getFullYear() - 100, 90)
                                ].map(year => ({ label: year, value: year }))}
                                renderOption={({ option, ...restProps }) => <CustomSelectOption {...restProps} />}
                                /> */}
                            </FormItem>
                        </FormLayoutGroup>
                    </FormLayout>
            </ModalCard>
            
            <ModalCard id="SelectCity"
                // onClose={props.Close}
                header="Выберите город"
                actions={<Button size="l" mode="primary" onClick={() => {
                        props.action({...props.data.profile, CityUmbracoId: selectedCity})
                        }
                    }>Закрыть</Button>}>
                    <FormLayout>
                        <FormLayoutGroup>
                            <InfoRow header="Город не найден">
                                Город, указанный в вашем профиле Вконтакте <b style={{color: 'red'}}>{props.data.profile ? props.data.profile.CityName : ""}</b> не найден в списке доступных для работы площадки. 
                                Выберите из списка ближайший к вам город, за спортивной жизнью которого вы будете следить.
                            </InfoRow>
                            <FormItem top="Город">            
                            <Select
                                placeholder="Не выбран" 
                                onChange={(e) => {
                                    setSelectedCity(+e.currentTarget.value)
                                    }}
                                options={props.data.cities && props.data.cities.map(city => {
                                    return { label: city.CityUmbracoName ?? city.CityUmbracoId, value: city.CityUmbracoId }
                                }
                                )}
                                renderOption={({ option, ...restProps }) => <CustomSelectOption {...restProps} />}
                                />
                            </FormItem>
                        </FormLayoutGroup>
                        {/* <InfoRow>или</InfoRow>
                        <FormLayoutGroup>
                            <InfoRow header="Укажите название вашего города">
                                Оставьте заявку администратору на добавление Вашего города в систему
                            </InfoRow>
                            <Input value={bidCity} onChange={(e) => setBidCity(e.currentTarget.value)} type="text"></Input>
                        </FormLayoutGroup> */}
                    </FormLayout>
            </ModalCard>
      </ModalRoot>
    )
}


export default ModalCommon