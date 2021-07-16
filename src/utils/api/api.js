import { PostJsonInstance, authQueryString } from './server';

export let errorObj = (text) => {
    return { resultcode: 1, result: "Error", data: null, message: text }
}

export let okObj = (dat) => {
    return { resultcode: 0, result: "Ok", data: dat, message: "" }
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
//         ////debugger
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

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {

                return errorObj(error)
            })
    },
}

export const PlaceAPI = {

    // запрос всех мест
    // startindex - индекс, с которого начинать ответ
    getAll(startindex = 0) {
        let formData = new FormData();
        formData.append("startindex", startindex);
        return PostJsonInstance.post("Places/GetPlaces" + authQueryString, formData).then(data => {
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                return errorObj(error)
            })
    },


    // запрос всех мест города по Id города
    // startindex - индекс, с которого начинать ответ
    getAllInCityByCityUmbracoId(cityId, startindex = 0) {
        //////debugger
        //if (!ApiSendInfo.checkRequest("PlaceAPIgetAllInCityByCityUmbracoId")){
        //ApiSendInfo.addRequest("PlaceAPIgetAllInCityByCityUmbracoId");
        let formData = new FormData();
        formData.append("startindex", startindex);
        formData.append("cityumbracoid", cityId);
        return PostJsonInstance.post("Places/getAllInCityByCityUmbracoId" + authQueryString, formData).then(data => {

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                return errorObj(error)
            })
        //}
    },



    // запрос места по его Id
    // placeId - Id места
    getById(placeId) {
        let formData = new FormData();
        formData.append("placeid", placeId);
        return PostJsonInstance.post("Places/GetPlaceById" + authQueryString, formData).then(data => {
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                return errorObj(error)
            })
    },



}

export const CollectAPI = {

    getAll() {
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
    getAllInPlaceByPlaceId(placeId, startindex = 0) {
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
    getAllInCityByCityId(cityId, startindex = 0) {
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
        ////debugger

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
                    'Amplua': { ...uGroup.amplua },
                    'NumberOf': uGroup.numberOf,  // количество участников 
                    'Access': { ...uGroup.access }, // доступ на 
                    'Players': [...(uGroup.players && uGroup.players.length ? uGroup.players.map(user => {
                        return { 'User': { ...user.user }, payment: {} }
                    }) :
                        [{}])],
                    'Price': uGroup.price,
                    'OrganizatorIsMember': uGroup.organizatorIsMember,
                }
            })],
            'UsersInvited': [
                ...collect_source.usersInvited.map(uInvited => {

                    return {
                        'Id': uInvited.id,
                        'ToBe': { ...uInvited.toBe },
                        'User': { ...uInvited.user },
                    }
                })
            ],
            'UsersWantsToParticipate': [
                ...collect_source.usersWantsToParticipate.map(uWP => {

                    return {

                        'Id': uWP.id,
                        'ToBe': { ...uWP.toBe },
                        'User': { ...uWP.user },
                    }
                })
            ],
            'Access': collect_source.access.id,
            'Permanent': collect_source.permanent,
            'OrganizatorIsMember': collect_source.organizatorIsMember,
            // 'AcceptedByPlaceOwner': collect_source.acceptedByPlaceOwner, // сбор подтвержден арендодателем и занесен в расписание. на это время больше нельзя бронировать. 
            'Organizer': { ...collect_source.organizer }
        }
        return PostJsonInstance.post("Collects/Add2" + authQueryString, JSON.stringify({ ...collect }))
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

export const TeamAPI = {

    // getAll() {
    //     return PostJsonInstance.post("Collects/GetAll").then(data => {
    //         return okObj(data.data);
    //     })
    //         .catch(error => {
    //             return errorObj(error)
    //         })
    // },

    // запрос всех сборов в месте по его Id
    // placeId - Id места
    // startindex - индекс, с которого начинать ответ
    getTeamInfoByTeamId(teamId) {
        let formData = new FormData();
        formData.append("teamid", teamId);

        return PostJsonInstance.post("SimpleTeam/GetById" + authQueryString, formData).then(data => {
            //debugger
            return okObj(data.data);
        })
            .catch(error => {
                return errorObj(error)
            })
    },

}

export const ProfileAPI = {
    // запрос информации о пользователе
    getUserProfile(vkUserData) {

        return PostJsonInstance.post("Account/GetUserProfile" + authQueryString, JSON.stringify({ ...vkUserData })).then(data => {

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                return errorObj(error)
            })
    },

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
        let bDate = new Date(Date.UTC(year ? +year : 1, month ? (+month - 1) : 1, day ? day : 1, 0, 0, 0));

        let vkUserData = {
            'bdate': bDate,
            'city': { 'id': vkUser.city.id, 'title': vkUser.city.title },
            'country': { 'id': vkUser.country.id, 'title': vkUser.country.title },
            'first_name': vkUser.first_name,
            'id': vkUser.id,
            'last_name': vkUser.last_name,
            'photo_100': vkUser.photo_100,
            'photo_200': vkUser.photo_200,
            'photo_max_orig': vkUser.photo_max_orig,
            'sex': vkUser.sex,
            'timezone': vkUser.timezone,
        }

        return PostJsonInstance.post("Account/Register" + authQueryString, JSON.stringify({ ...vkUserData })).then(data => {

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                return errorObj(error)
            })
    },

    // изменение города привязки пользователя
    setUserProfileCity(userData) {
        if (userData) {
            return PostJsonInstance.post("Account/UpdateUserProfileCity" + authQueryString, JSON.stringify({ ...userData })).then(data => {

                return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
            })
                .catch(error => {
                    return errorObj(error)
                })
        }
        else {
            return errorObj("Внутренняя ошибка, не получены данные от провайдера в API");
        }
    }
}

export const CityTournamentAdminAPI = {
    // запрос всех админов города
    // startindex - индекс, с которого начинать ответ
    getAll(startindex = 0) {
        //let formData = new FormData();
        //formData.append("startindex", startindex);
        return PostJsonInstance.post("SimpleCityTournamentAdmin/GetAll" + authQueryString/*, formData*/).then(data => {

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {

                return errorObj(error)
            })
    },

    // возвращает всех админов города
    getAllInCityByCityId(cityUmbracoId, startindex = 0) {
        let formData = new FormData();
        formData.append("startindex", startindex);
        formData.append("cityumbracoid", cityUmbracoId);
        return PostJsonInstance.post("SimpleCityTournamentAdmin/GetAllInCity" + authQueryString, formData).then(data => {

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {

                return errorObj(error)
            })
    },

    /// запрос групп турнира
    getTournamentGroups(tournament, startindex) {
        let formData = new FormData();
        formData.append("startindex", startindex);
        formData.append("tournamentId", tournament.Id);
        return PostJsonInstance.post("SimpeBidTeamToTournament/GetTournamentGroups" + authQueryString, formData).then(data => {

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {

                return errorObj(error)
            })
    },

    changeTeamTournamentGroup(team, newgroup, oldgroup,  userprofile){
        //debugger
        let teamToSend = {
            Id: team.Id
        }
        let newgroupToSend = {
            Id: newgroup.Id,
            TournamentId: newgroup.TournamentId,
        }
        let oldgroupToSend = {
            Id: oldgroup.Id,
            TournamentId: oldgroup.TournamentId,
        }
//debugger
        return PostJsonInstance.post("SimpeBidTeamToTournament/SetTeamTournamentGroup" + authQueryString, JSON.stringify({ team: { ...teamToSend }, 
            newGroup: { ...newgroupToSend }, oldGroup: { ...oldgroupToSend }, userProfile: { ...userprofile } })).then(data => {
            //debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                //debugger
                return errorObj(error)
            })
    },

    
    // возвращает заявки по турниру (для админа турнира)
    getTournamentTeamsByTournament(userprofile, tournament, startindex = 0) {
        ////debugger 
        let tournamentToSend = {
            Id: tournament.Id
        }

        return PostJsonInstance.post("SimpleTournament/GetTeamsByTournament" + authQueryString, JSON.stringify({ tournament: { ...tournamentToSend }, userProfile: { ...userprofile } })).then(data => {
            //debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                //debugger
                return errorObj(error)
            })
    },

    getAllByAdminProfileId(userProfileId, startindex = 0) {
        let formData = new FormData();
        formData.append("startindex", startindex);
        formData.append("adminprofileid", userProfileId);
        return PostJsonInstance.post("SimpleTournament/GetAllByAdminId" + authQueryString, formData).then(data => {

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {

                return errorObj(error)
            })
    },

    saveTournament(tournament, userprofile) {
        ////debugger
        

        if (tournament.Id < 0){
            let tournamentToSend = {
                ...tournament,
                WhenBegin: new Date(tournament.WhenBegin.year, tournament.WhenBegin.month - 1, tournament.WhenBegin.day + 1),
                WhenEnd: new Date(tournament.WhenEnd.year, tournament.WhenEnd.month - 1, tournament.WhenEnd.day + 1),
                Year: tournament.WhenEnd.year,
                CityId: userprofile.CityUmbracoId, // важный момент. пока не загружен с сервера существующий турнир, мы не знаем к какому городу привязка. берем CityUmbracoId из профиля (на сервере в Add это обрабатывается)
            }

            return PostJsonInstance.post("SimpleTournament/Add" + authQueryString, JSON.stringify({ tournament: { ...tournamentToSend }, userProfile: { ...userprofile } })).then(data => {
                ////debugger
                return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
            })
                .catch(error => {
                    ////debugger
                    return errorObj(error)
                })
        }
        else{
            let tournamentToSend = {
                ...tournament,
                WhenBegin: new Date(tournament.WhenBegin.year, tournament.WhenBegin.month - 1, tournament.WhenBegin.day + 1),
                WhenEnd: new Date(tournament.WhenEnd.year, tournament.WhenEnd.month - 1, tournament.WhenEnd.day + 1),
                Year: tournament.WhenEnd.year,
                TournamentGroups: [...tournament.TournamentGroups.map(item => {
                    return {
                        Name: item.Name,
                        Id: item.Id != undefined ? item.Id : -1,
                    }
                })],
                CityId: tournament.CityId, // важный момент. пока не загружен с сервера существующий турнир, мы не знаем к какому городу привязка. берем CityUmbracoId из профиля (на сервере в Add это обрабатывается)
            }

            return PostJsonInstance.post("SimpleTournament/Update" + authQueryString, JSON.stringify({ tournament: { ...tournamentToSend }, userProfile: { ...userprofile } })).then(data => {
                ////debugger
                return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
            })
                .catch(error => {
                    ////debugger
                    return errorObj(error)
                })
        }
    },

    /// публикация турнира (или снятие с публикации, если publish=false)
    publishTournament(tournament, userprofile, publish) {
        
        let tournamentToSend = {
            ...tournament,
            WhenBegin: new Date(tournament.WhenBegin.year, tournament.WhenBegin.month - 1, tournament.WhenBegin.day + 1),
            WhenEnd: new Date(tournament.WhenEnd.year, tournament.WhenEnd.month - 1, tournament.WhenEnd.day + 1),
            Published: publish,
            Year: tournament.WhenEnd.year,
            CityId: userprofile.CityUmbracoId,
        }
        return PostJsonInstance.post("SimpleTournament/Publish" + authQueryString, JSON.stringify({ tournament: { ...tournamentToSend }, userProfile: { ...userprofile } })).then(data => {
            
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                
                return errorObj(error)
            })
    },

    /// удаление турнира (пометка на удаление)
    deleteTournament(tournament, userprofile) {
        ////debugger
        let tournamentToSend = {
            ...tournament,
            WhenBegin: new Date(tournament.WhenBegin.year, tournament.WhenBegin.month - 1, tournament.WhenBegin.day + 1),
            WhenEnd: new Date(tournament.WhenEnd.year, tournament.WhenEnd.month - 1, tournament.WhenEnd.day + 1),
            Year: tournament.WhenEnd.year,
            CityId: userprofile.CityUmbracoId,
        }
        return PostJsonInstance.post("SimpleTournament/Delete" + authQueryString, JSON.stringify({ tournament: { ...tournamentToSend }, userProfile: { ...userprofile } })).then(data => {
            ////debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                ////debugger
                return errorObj(error)
            })
    },

    // удаление команды (отклонение заявки от команды) из турнира
    deleteTeamFromTournamentByTeam(team, tg, userprofile, admintext){
        //debugger
        let teamToSend = {
            Id: team.Id
        }
        let tournamentGroupToSend = {
            Id: tg.Id,
            TournamentId: tg.TournamentId,
        }
//debugger
        return PostJsonInstance.post("SimpeBidTeamToTournament/DeleteTeamFromTournament" + authQueryString, JSON.stringify({ team: { ...teamToSend }, 
            tournamentGroup: { ...tournamentGroupToSend }, userProfile: { ...userprofile }, admintext: admintext })).then(data => {
            //debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                //debugger
                return errorObj(error)
            })
    },

    /// удаление группы турнира
    deleteTournamentGroup(tournament, userprofile, tournamentGroupId) {
        ////debugger
        let tournamentToSend = {
            ...tournament,
            WhenBegin: new Date(tournament.WhenBegin.year, tournament.WhenBegin.month - 1, tournament.WhenBegin.day + 1),
            WhenEnd: new Date(tournament.WhenEnd.year, tournament.WhenEnd.month - 1, tournament.WhenEnd.day + 1),
            Year: tournament.WhenEnd.year,
            CityId: userprofile.CityUmbracoId,
        }

        let tournamentGroup = {
            Id: tournamentGroupId,
        }
        return PostJsonInstance.post("SimpleTournamentGroup/Delete" + authQueryString, JSON.stringify({ tournament: { ...tournamentToSend }, userProfile: { ...userprofile }, tournamentGroup: {...tournamentGroup} })).then(data => {
            ////debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                ////debugger
                return errorObj(error)
            })
    },
   
    /// добавление группы турнира
    addTournamentGroup(tournament, userprofile, tGroup) {
        ////debugger
        let tournamentToSend = {
            ...tournament,
            WhenBegin: new Date(tournament.WhenBegin.year, tournament.WhenBegin.month - 1, tournament.WhenBegin.day + 1),
            WhenEnd: new Date(tournament.WhenEnd.year, tournament.WhenEnd.month - 1, tournament.WhenEnd.day + 1),
            Year: tournament.WhenEnd.year,
            CityId: userprofile.CityUmbracoId,
        }

        let tournamentGroup = {
            Id: tGroup.Id,
            Name: tGroup.Name,
        }
        return PostJsonInstance.post("SimpleTournamentGroup/Add" + authQueryString, JSON.stringify({ tournament: { ...tournamentToSend }, userProfile: { ...userprofile }, tournamentGroup: {...tournamentGroup} })).then(data => {
            ////debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                ////debugger
                return errorObj(error)
            })
    },



    // AddContact(contact){
    //     ////debugger
    //     //return instace.get('/contacts/getcontacts');
    //     let Contact= contact;
    //     return jsonInstace.post(baseUrl + 'Contacts/New', JSON.stringify({...Contact})).then(x => {
    //         ////debugger
    //         return x.data;
    //     }).catch(y => {
    //         ////debugger
    //         console.log(y)
    //     });
    // },
}

export const TeamAdminAPI = {
    // запрос всех админов города
    // startindex - индекс, с которого начинать ответ
    getAll(startindex = 0) {
        //let formData = new FormData();
        //formData.append("startindex", startindex);
        return PostJsonInstance.post("SimpleTeamAdmin/GetAll" + authQueryString/*, formData*/).then(data => {

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {

                return errorObj(error)
            })
    },

    getAllInCityByCityId(cityUmbracoId, startindex = 0) {
        let formData = new FormData();
        formData.append("startindex", startindex);
        formData.append("cityumbracoid", cityUmbracoId);
        return PostJsonInstance.post("SimpleTeamAdmin/GetAllInCity" + authQueryString, formData).then(data => {

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {

                return errorObj(error)
            })
    },

    getAllByAdminProfileId(userProfileId, startindex = 0) {
        let formData = new FormData();
        formData.append("startindex", startindex);
        formData.append("adminprofileid", userProfileId);
        return PostJsonInstance.post("SimpleTeam/GetAllByAdminId" + authQueryString, formData).then(data => {

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {

                return errorObj(error)
            })
    },

    saveTeam(team, userprofile) {
        
        if (team.Id < 0){
            let teamToSend = {
                ...team,
                WhenBorn: new Date(team.WhenBorn.year, team.WhenBorn.month - 1, team.WhenBorn.day + 1),
                Year: team.WhenBorn.year,
                CityId: userprofile.CityUmbracoId, // важный момент. пока не загружен с сервера существующий турнир, мы не знаем к какому городу привязка. берем CityUmbracoId из профиля (на сервере в Add это обрабатывается)
            }

            return PostJsonInstance.post("SimpleTeam/Add" + authQueryString, JSON.stringify({ team: { ...teamToSend }, userProfile: { ...userprofile } })).then(data => {
                ////debugger
                return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
            })
                .catch(error => {
                    ////debugger
                    return errorObj(error)
                })
        }
        else{
            let teamToSend = {
                ...team,
                WhenBorn: new Date(team.WhenBorn.year, team.WhenBorn.month - 1, team.WhenBorn.day + 1),
                Year: team.WhenBorn.year,
                CityId: team.CityId, // важный момент. пока не загружен с сервера существующий турнир, мы не знаем к какому городу привязка. берем CityUmbracoId из профиля (на сервере в Add это обрабатывается)
            }

            return PostJsonInstance.post("SimpleTeam/Update" + authQueryString, JSON.stringify({ team: { ...teamToSend }, userProfile: { ...userprofile } })).then(data => {
                ////debugger
                return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
            })
                .catch(error => {
                    ////debugger
                    return errorObj(error)
                })
        }
    },

    /// публикация турнира (или снятие с публикации, если publish=false)
    publishTournament(tournament, userprofile, publish) {
        
        let tournamentToSend = {
            ...tournament,
            WhenBegin: new Date(tournament.WhenBegin.year, tournament.WhenBegin.month - 1, tournament.WhenBegin.day + 1),
            WhenEnd: new Date(tournament.WhenEnd.year, tournament.WhenEnd.month - 1, tournament.WhenEnd.day + 1),
            Published: publish,
            Year: tournament.WhenEnd.year,
            CityId: userprofile.CityUmbracoId,
        }
        return PostJsonInstance.post("SimpleTeam/Publish" + authQueryString, JSON.stringify({ tournament: { ...tournamentToSend }, userProfile: { ...userprofile } })).then(data => {
            
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                
                return errorObj(error)
            })
    },

    /// удаление турнира (пометка на удаление)
    deleteTeam(team, userprofile) {
        let teamToSend = {
            ...team,
            WhenBorn: new Date(team.WhenBorn.year, team.WhenBorn.month - 1, team.WhenBorn.day + 1),
            Year: team.WhenBorn.year,
            CityId: team.CityId, // важный момент. пока не загружен с сервера существующий турнир, мы не знаем к какому городу привязка. берем CityUmbracoId из профиля (на сервере в Add это обрабатывается)
        }
        return PostJsonInstance.post("SimpleTeam/Delete" + authQueryString, JSON.stringify({ team: { ...teamToSend }, userProfile: { ...userprofile } })).then(data => {
            ////debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                ////debugger
                return errorObj(error)
            })
    },
}

export const BidTeamAPI = {
    
    getActualTournaments(userprofile, team, startindex = 0) {
        ////debugger 
        let teamToSend = {
            ...team,
            WhenBorn: new Date(team.WhenBorn.year, team.WhenBorn.month - 1, team.WhenBorn.day + 1),
            Year: team.WhenBorn.year,
        }

        return PostJsonInstance.post("SimpeBidTeamToTournament/GetActualTournaments" + authQueryString, JSON.stringify({ team: { ...teamToSend }, userProfile: { ...userprofile } })).then(data => {
            ////debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                ////debugger
                return errorObj(error)
            })
    },

    getTeamBidsByTeam(userprofile, team, startindex = 0) {
        ////debugger 
        let teamToSend = {
            ...team,
            WhenBorn: new Date(team.WhenBorn.year, team.WhenBorn.month - 1, team.WhenBorn.day + 1),
            Year: team.WhenBorn.year,
        }

        return PostJsonInstance.post("SimpeBidTeamToTournament/GetTeamBidsByTeam" + authQueryString, JSON.stringify({ team: { ...teamToSend }, userProfile: { ...userprofile } })).then(data => {
            ////debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                ////debugger
                return errorObj(error)
            })
    },


    // возвращает заявки по турниру (для админа турнира)
    getTeamBidsByTournament(userprofile, tournament, startindex = 0) {
        ////debugger 
        let tournamentToSend = {
            Id: tournament.Id
        }

        return PostJsonInstance.post("SimpeBidTeamToTournament/GetTeamBidsByTournament" + authQueryString, JSON.stringify({ tournament: { ...tournamentToSend }, userProfile: { ...userprofile } })).then(data => {
            
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                
                return errorObj(error)
            })
    },

    // согласовывает заявку (для админа турнира)
    acceptTeamToTournamentBid(bid, userprofile, tournament, admintext) {
        ////debugger 
        let tournamentToSend = {
            Id: tournament.Id
        }
   //debugger     
        bid.AdminTournamentComment = admintext;

        return PostJsonInstance.post("SimpeBidTeamToTournament/AcceptBid" + authQueryString, JSON.stringify({ bid: {...bid}, tournament: { ...tournamentToSend }, userProfile: { ...userprofile } })).then(data => {
            //debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                //debugger
                return errorObj(error)
            })
    },
    
    
    // отклоняет заявку (для админа турнира)
    declineTeamToTournamentBid(bid, userprofile, tournament, admintext) {
        ////debugger 
        let tournamentToSend = {
            Id: tournament.Id
        }
   //debugger     
        bid.AdminTournamentComment = admintext;

        return PostJsonInstance.post("SimpeBidTeamToTournament/DeclineBid" + authQueryString, JSON.stringify({ bid: {...bid}, tournament: { ...tournamentToSend }, userProfile: { ...userprofile } })).then(data => {
            //debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                //debugger
                return errorObj(error)
            })
    },


    addBidTeamToTournament(tournamentgroup, userprofile, team, teamName, startindex = 0) {
        ////debugger 
        let teamToSend = {
            ...team,
            WhenBorn: new Date(team.WhenBorn.year, team.WhenBorn.month - 1, team.WhenBorn.day + 1),
            Year: team.WhenBorn.year,
        }

        let bid = {
                    TeamName: (teamName != "") ? teamName : team.Name, 
                    When: new Date(),
                    TournamentGroupId: tournamentgroup.Id,
                    UserProfileId: userprofile.UserProfileId,
                    TeamId: team.Id,
                    Team: null,
                    Approved: false,
                    UserProfile: null,
                    ErrorMessage: "",
                    AdminTournamentComment : "",
                    TournamentGroup: null,
                }

        return PostJsonInstance.post("SimpeBidTeamToTournament/Add" + authQueryString, JSON.stringify({ bidTeamToTournament: { ...bid }, team: { ...teamToSend }, userProfile: { ...userprofile } })).then(data => {
            //debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                //debugger
                return errorObj(error)
            })
    },
    
    delBidTeamToTournament(bid, userprofile, team) {
        ////debugger 
        let teamToSend = {
            ...team,
            WhenBorn: new Date(team.WhenBorn.year, team.WhenBorn.month - 1, team.WhenBorn.day + 1),
            Year: team.WhenBorn.year,
        }

        return PostJsonInstance.post("SimpeBidTeamToTournament/Delete" + authQueryString, JSON.stringify({ bidTeamToTournament: { ...bid }, team: { ...teamToSend }, userProfile: { ...userprofile } })).then(data => {
            ////debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                ////debugger
                return errorObj(error)
            })
    },
    
    /// допуск комады к турниру
    approveBidTeamToTournament(bid, userprofile, tournament, approve, admincomment) {
        ////debugger 
        let bidToSend = {...bid,
            AdminTournamentComment: admincomment,
            Approve: approve,
        }

        return PostJsonInstance.post("SimpeBidTeamToTournament/Approve" + authQueryString, JSON.stringify({ bid: { ...bidToSend }, tournament: { ...tournament }, userProfile: { ...userprofile } })).then(data => {
            ////debugger
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                ////debugger
                return errorObj(error)
            })
    },

}

export const MatchAPI = {
    addMatch(matchInfo, userprofile, hours, minutes) {
        
        //new Date()
        matchInfo.When = new Date(matchInfo.When.year, matchInfo.When.month - 1, matchInfo.When.day, hours, minutes );
        return PostJsonInstance.post("Match/Add" + authQueryString, JSON.stringify({ match: { ...matchInfo }, userProfile: { ...userprofile } })).then(data => {
            
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                //debugger
                return errorObj(error)
            })
    },
    
    delMatch(matchInfo, userprofile, hours, minutes) {
        
        //new Date()
        matchInfo.When = new Date(matchInfo.When.year, matchInfo.When.month - 1, matchInfo.When.day, hours, minutes );
        return PostJsonInstance.post("Match/Del" + authQueryString, JSON.stringify({ match: { ...matchInfo }, userProfile: { ...userprofile } })).then(data => {
            
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                //debugger
                return errorObj(error)
            })
    },
    
    getAllMatchesByTournament(tournament, userprofile) {
        
        let tournamentToSend = {
            Id: tournament.Id
        }
        //new Date()
        //matchInfo.When = new Date(matchInfo.When.year, matchInfo.When.month - 1, matchInfo.When.day, hours, minutes );
        //return PostJsonInstance.post("Match/GetByTournament" + authQueryString, JSON.stringify({ tournament: { ...tourn }, userProfile: { ...userprofile } })).then(data => {
        return PostJsonInstance.post("Match/GetByTournament" + authQueryString, JSON.stringify({ tournament: { ...tournamentToSend }, userProfile: { ...userprofile } })).then(data => {
            
            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {
                
                return errorObj(error)
            })
    },
    

}

export const TournamentAPI = {
    getAllTournamentsInCityByCityUmbracoId(cityUmbracoId) {
        
        let formData = new FormData();
        //formData.append("startindex", startindex);
        formData.append("cityumbracoid", cityUmbracoId);
        return PostJsonInstance.post("SimpleTournament/GetAllCurrentInCity" + authQueryString, formData).then(data => {

            return ((data.data.ErrorMessage == "") || (data.data.ErrorMessage == undefined) || (data.data.ErrorMessage == null)) ? okObj(data.data) : errorObj(data.data.ErrorMessage);
        })
            .catch(error => {

                return errorObj(error)
            })
    }
}