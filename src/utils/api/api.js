import {PostJsonInstance, authQueryString} from './server';

export let errorObj = (text) => {
    return {resultcode: 1, result: "Error", data: null, message: text}
}

export let okObj = (dat) => {
    return {resultcode: 0, result: "Ok", data: dat, message: ""}
}


// export let ApiSendInfo =
// {
//     settings: {timeout: 10, }, // настройки. timeout - таймаут актуальности запроса, после истечения времени, запрос удаляется
//     requests: [/* {name: "PlaceAPIgetAll", time: new Date()} */], 
//     system: {},
//     addRequest: function(name){
//         let requestInQueue = this_.requests.filter(req => req.name == name);
//         if (requestInQueue && requestInQueue.length > 0){
//             return false;
//         }
//         let currentDT = new Date();
//         this.requests.push({name, time: currentDT});
//         return {name, time: currentDT};
//     },
//     checkRequest: function(name){
//         let requestInQueue = this_.requests.filter(req => req.name == name);
//         if (requestInQueue && requestInQueue.length > 0){
//             return true;
//         }
//         return false;
//     },
//     check: function(){
//         debugger
//         this_.requests = this_.requests ? this_.requests.map(req => {
//             let now = new Date();
//             if ((req.time - now).getSeconds() < this_.settings.timeout){
//                 return req;
//             }
//         }) : []
//     },
// }

//export const ApiTimer = setInterval(ApiSendInfo.check, 1000);

export const CityAPI = {
    // запрос всех мест
    // startindex - индекс, с которого начинать ответ
    getAll(startindex = 0) {
        //let formData = new FormData();
        //formData.append("startindex", startindex);
        return PostJsonInstance.post("City/GetAllFromAreas" + authQueryString/*, formData*/).then(data => {
            
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
        .catch(error => {
            
            return errorObj(error)
        })},
}

export const PlaceAPI = {

    // запрос всех мест
    // startindex - индекс, с которого начинать ответ
    getAll(startindex = 0) {
        let formData = new FormData();
        formData.append("startindex", startindex);
        return PostJsonInstance.post("Places/GetPlaces" + authQueryString, formData).then(data => {
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
        .catch(error => {
            return errorObj(error)
        })},
    
    
    // запрос всех мест города по Id города
    // startindex - индекс, с которого начинать ответ
    getAllInCityByCityUmbracoId(cityId, startindex = 0) {
        //debugger
        //if (!ApiSendInfo.checkRequest("PlaceAPIgetAllInCityByCityUmbracoId")){
            //ApiSendInfo.addRequest("PlaceAPIgetAllInCityByCityUmbracoId");
            let formData = new FormData();
            formData.append("startindex", startindex);
            formData.append("cityumbracoid", cityId);
            return PostJsonInstance.post("Places/getAllInCityByCityUmbracoId" + authQueryString, formData).then(data => {
                
                return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
            })
            .catch(error => {
                return errorObj(error)
            })
        //}
    },
        

      
    // запрос места по его Id
    // placeId - Id места
    getById(placeId){
        let formData = new FormData();
        formData.append("placeid", placeId);
        return PostJsonInstance.post("Places/GetPlaceById" + authQueryString, formData).then(data => {
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
        .catch(error => {
            return errorObj(error)
        })
    },

    
    
}

export const CollectAPI = {

    getAll(){
        return PostJsonInstance.post("Collects/GetAll").then(data => {
            return okObj(data.data);
        })
        .catch(error => {
            return errorObj(error)
        })
    },

    // запрос всех сборов в месте по его Id
    // placeId - Id места
    // startindex - индекс, с которого начинать ответ
    getAllInPlaceByPlaceId(placeId, startindex=0){
        let formData = new FormData();
        formData.append("startindex", startindex);
        formData.append("placeid", placeId);

        return PostJsonInstance.post("Collects/GetAllInPlace" + authQueryString, formData).then(data => {
            return okObj(data.data);
        })
        .catch(error => {
            return errorObj(error)
        })
    },

    // запрос всех сборов в городе по его Id
    // cityId - Id города
    // startindex - индекс, с которого начинать ответ
    getAllInCityByCityId(cityId, startindex=0){
        let formData = new FormData();
        formData.append("startindex", startindex);
        formData.append("cityid", cityId);
        return PostJsonInstance.post("Collects/GetAllInCityByCityId" + authQueryString, formData).then(data => {
            return okObj(data.data);
        })
        .catch(error => {
            return errorObj(error)
        })
    },

    add(collect_source) {
        debugger
    
        let collect = {
                'Id': collect_source.id,
                'Place': collect_source.place,
                'WhenDate': collect_source.date,
                'Hour': collect_source.hour,
                'Minute': collect_source.minute,
                'DurationMinutes': collect_source.durationMinutes,
                'Price': collect_source.price, // цена за весь период
                'Options': [...collect_source.options],
                'FixedByMemberPrice': collect_source.fixedByMemberPrice,
                /*
                описание доступа. выкладывается список доступных ролей на сборе. они описаны в usersGroups
    
                */
            'UsersGroups': [...collect_source.usersGroups.map(uGroup => {
                return {
                    'Id': uGroup.id,
                    'Amplua': {...uGroup.amplua},
                    'NumberOf': uGroup.numberOf,  // количество участников 
                    'Access': {...uGroup.access}, // доступ на 
                    'Players': [...(uGroup.players && uGroup.players.length ? uGroup.players.map(user => 
                        {
                            return {'User': {...user.user}, payment: {}}
                        }): 
                    [{}])],
                    'Price': uGroup.price,
                    'OrganizatorIsMember': uGroup.organizatorIsMember,
                }
            })],
                'UsersInvited': [
                    ...collect_source.usersInvited.map(uInvited => {
                        
                        return {
                            'Id': uInvited.id,
                            'ToBe': {...uInvited.toBe}, 
                            'User': {...uInvited.user},
                        }
                    })
                ],
                'UsersWantsToParticipate': [
                    ...collect_source.usersWantsToParticipate.map(uWP => {
                        
                        return {
                            
                            'Id': uWP.id,
                            'ToBe': {...uWP.toBe}, 
                            'User': {...uWP.user},
                        }
                    })
                ],
                'Access': collect_source.access.id,
                'Permanent': collect_source.permanent,
                'OrganizatorIsMember': collect_source.organizatorIsMember,
               // 'AcceptedByPlaceOwner': collect_source.acceptedByPlaceOwner, // сбор подтвержден арендодателем и занесен в расписание. на это время больше нельзя бронировать. 
                'Organizer': {...collect_source.organizer}
        }
        return PostJsonInstance.post("Collects/Add2" + authQueryString, JSON.stringify({...collect}))
        //return PostJsonInstance.post("Collects/Add" + authQueryString, JSON.stringify({...collect}))
        //.then(x => 
        //     {
        //     	console.log(collect);
        //     	console.log("Collects/Add: " + x);
        //     }).catch(y => {
        //     	console.log(collect);
        //     	console.log("error Collects/Add: " + y);
        //     })
    }
}

export const ProfileAPI = {
    // запрос информации о пользователе
    getUserProfile(vkUserData) {
        
        return PostJsonInstance.post("Account/GetUserProfile" + authQueryString, JSON.stringify({...vkUserData})).then(data => {
            
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
        .catch(error => {
            return errorObj(error)
        })},

    // авторизация пользователя (авторегистрация в случае, если такой пользователь отсутствует в базе)
    getAuthInfo_old(formData) {
        return PostJsonInstance.post("Account/Auth" + authQueryString, formData).then(data => {
            return okObj(data.data);
        })
        .catch(error => {
            return errorObj(error)
        })
    },

    // регистрация/обновление даты рождения + получение данных о профиле
    getAuthInfo(vkUser) {
        
        let [day, month, year] = vkUser.bdate.split('.');
        let bDate = new Date(Date.UTC(year ? +year : 1, month ? (+month-1) : 1, day ? day : 1, 0, 0, 0));
        
        let vkUserData = {
            'bdate': bDate,
            'city': {'id': vkUser.city.id, 'title': vkUser.city.title},
            'country': {'id': vkUser.country.id, 'title': vkUser.country.title},
            'first_name': vkUser.first_name,
            'id': vkUser.id,
            'last_name': vkUser.last_name,
            'photo_100': vkUser.photo_100,
            'photo_200': vkUser.photo_200,
            'photo_max_orig': vkUser.photo_max_orig,
            'sex': vkUser.sex,
            'timezone': vkUser.timezone,
        }

        return PostJsonInstance.post("Account/Register" + authQueryString, JSON.stringify({...vkUserData})).then(data => {
            
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
        .catch(error => {
            return errorObj(error)
        })
    },

    // изменение города привязки пользователя
    setUserProfileCity(userData) {
        if (userData){
            return PostJsonInstance.post("Account/UpdateUserProfileCity" + authQueryString, JSON.stringify({...userData})).then(data => {
                
                return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
            })
            .catch(error => {
                return errorObj(error)
            })
        }
        else{
            return errorObj("Внутренняя ошибка, не получены данные от провайдера в API");
        }
    }
}