import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, Badge, Header, List, RichCell } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import { setActiveMenuItem } from './store/mainMenuReducer';
import { getAllPlaces, getAllPlacesInCityByCityId } from './store/placeReducer';
import { setVkProfileInfo, getUserProfile, getAuthInfo, setTriedToGetProfile, setUserProfileCity } from './store/profileReducer';
import { setGlobalPopout } from './store/systemReducer';
import { getAllCityTournamentAdminsByCityId, getTournamentsByCityId, setSelectedTournament, setTournamentMode } from './store/tournamentsReducer';
import { getMatchesInCurrentCity, setHotPanel } from './store/matchReducer';
import { addBidTeamToTournamentGroup, cancelBidTeamToTournamentGroup, getActualTournamentsInCity  } from './store/bidTeamsReducer';
import { getAllCitiesFromServer } from './store/cityReducer';
import { setShowAdminTourneyTab } from './store/systemReducer';


import { Epic, Tabbar, TabbarItem, Panel, PanelHeader, PanelHeaderButton, PanelHeaderBack, Tabs, TabsItem, Div, Avatar, Group, SimpleCell, InfoRow } from '@vkontakte/vkui';
import { connect } from 'react-redux';
import ProfilePanel from './components/Panels/ProfilePanel/ProfilePanel';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import BackButton from './components/Panels/Common/BackButton/BackButton';
import TabbarItemWithHistory from './components/Panels/Common/WithHistory/TabbarItemWithHistory';
import { memberingCollectTypes } from './store/constants/commonConstants'
import ModalCommon from './components/Modals/ModalCommon/ModalCommon';
import TournamentAdminPanel from './components/Panels/AdminPanel/Tournament/TournamentAdminPanel';
import TeamAdminPanel from './components/Panels/AdminPanel/Team/TeamAdminPanel';
import TournamentItem from './components/Panels/AdminPanel/Tournament/TournamentItem';
import TeamItem from './components/Panels/AdminPanel/Team/TeamItem';
import BidTeamTournamentGroupsList from './components/Panels/AdminPanel/BidTeam/BidTeamTournamentGroupsList';
import Hot from './components/Panels/Common/Hot/Hot';


const App = (props) => {
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(props.globalPopout ? <ScreenSpinner size='large' /> : null);
	const [modalWindow, setModalWindow] = useState(null);
	const [viewCollectTab, setCollectViewTab] = useState("main");

	
	// это системное, загрузка приложения вк
	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

		async function fetchData() {
			
			const user = await bridge.send('VKWebAppGetUserInfo');


			setUser(user);
			props.setVkProfileInfo(user);
			props.getAllCitiesFromServer();


			//Build an object which matches the structure of our view model class
			//setPopout(props.globalPopout ? <ScreenSpinner size='large' /> : null);
		}

		async function getDataFromServer() {

			// грузим профиль. 
			//props.getUserProfile();
			//props.getAllPlaces();


			// если не загрузился, значит регистрируем пользователя.
			// в хранилище у нас уже лежит инфа о пользователе (может кроме друзей и года рождения)
			// запросить у пользователя реальную дату рождения [и список друзей]
			// отправить запрос на регстрицию профиля (Имя, фамилия, дата рождения, город, профиль ВК, [друзья])
			// загрузить с сервера профиль пользователя
			// если город пользователя найден среди городов работы приложения, тогда
			// загружаем все сборы по этому городу
			// если не найден, тогда говорим, что его город не найден и предлагаем выбрать город из списка

			// после выбора города из списка, сохраняем его в профиль пользователю, загружаем снова профиль и 
			// грузим сборы по этому городу

			// у организатора должен быть указан телефон и ссылка на профиль ВК, куда можно написать вопрос.
			// роль организатора - нужен доступ к телефону


			// загрузка сборов (по городу)
			// загрузка мест (надо по городу)
			//props.getAllPlaces();

			// получение всех городов
		}


		//getDataFromServer();
		fetchData();

		// загружаем сборы (в полях должны быть айдишники и текстовое описание. чтобы далее подробности подгружались при переходе к подробностям)
		//props.getHotCollects();


		// загружаем пользователей 


	}, []);


	// загрузка мест, админов города, текущих турниров
	useEffect(() => {

		// а это уже когда прогрузился и выбран город профиля
		if (props.cities && props.cities.length > 0 && props.myProfile && props.myProfile.CityUmbracoId != null &&
			props.myProfile.CityUmbracoId != -1 && new Date(props.myProfile.Birth).getFullYear() >= 1920 && props.places.length == 0) {
			// загружаем места этого города

			// получаем список мест по umbId города
			props.getAllPlacesInCityByCityId(props.myProfile.CityUmbracoId);

			// получаем список админов турниров города по umbId города
			props.getAllCityTournamentAdminsByCityId(props.myProfile.CityUmbracoId);

			// получаем список активных турниров города по umbId города и текущей дате
			props.getTournamentsByCityId(props.myProfile.CityUmbracoId);
		}

		// это пока не прогрузился город профиля (не выбран)
		if (props.cities && props.cities.length > 0 && props.myProfile && props.myProfile.CityUmbracoId != null &&
			props.myProfile.CityUmbracoId == -1 && new Date(props.myProfile.Birth).getFullYear() >= 1920) // важно, чтобы все это прогрузилось уже
		{

			// предлагаем выбрать город
			setPopout(null);
			setModalWindow(<ModalCommon modalName="SelectCity" data={{ profile: props.myProfile, cities: props.cities }} action={props.setUserProfileCity} Close={() => setModalWindow(null)}></ModalCommon>)
		}


	}, [props.myProfile, props.vkProfile, props.cities])

	useEffect(() => {
		if (props.places && props.places.length > 0) {
			
			props.getMatchesInCurrentCity(props.myProfile);
		}
	}, [props.places])

	// при смене глобального Popout и возникновении ошибки
	useEffect(() => {
		if (props.errorObject && props.errorObject.resultcode != 0)
		{
			debugger
			setModalWindow(<ModalCommon modalName="Error" data={props.errorObject} Close={() => setModalWindow(null)}></ModalCommon>)
		}
		else {
			setPopout(props.globalPopout ? <ScreenSpinner size='large' /> : null);
		}
	}, [props.globalPopout, props.errorObject])


	// при загрузке профиля (по факту приложения)
	useEffect(() => {
		// нужно узнать город, далее если этого города нет в списке поддерживаемых, предлжить выбрать другой город и отправить заявку на добавление города. Всё это в модалке
		// другой вопрос. если кто-то создает фейковый сбор, как гарантировать другим, что это не фейк?
		// ввести в рейтинг поле "гарант сбора. если поступает жалоба на сбор (не было сбора), модератор засчитывает штрафной балл организатору"
		// у людей, которые первый раз собирают, писать город из профиля, количество друзей и то, что человек еще не собирал ни разу, а значит может быть фейком
		// еще нужно запрашивать права на доступ к инфе: город, дата рождения, друзья, 
		// а еще в бэке надо сделать так, чтобы записи в Leg и City не плодились, а искали соответствующие из умбрако и ставили их Id

		if (props.vkProfile && props.vkProfile.city) {

			props.getUserProfile(props.vkProfile);
		}

	}, [props.vkProfile])


	// регистрация пользователя
	useEffect(() => {

		if (props.vkProfile && props.vkProfile.city) {
			if ((!props.myProfile) & (props.triedToGetProfile)) { // не зарегистрирован
				props.getAuthInfo(props.vkProfile); // регаем
			}
		}
	}, [props.triedToGetProfile])


	// загрузка профиля
	useEffect(() => {

		if (props.vkProfile && props.vkProfile.city) {
			if (props.myProfile) // зарегистрирован и получил данные
			{
				// если не год рождения скрыт настройками приватности и из-за этого при регистрации на бэкэнде дата рождения не определилась, 
				// выводим окно выбора года рождения и после выбора правим его в профиле ВК
				if ((props.vkProfile.bdate.split('.').length == 2) && (new Date(props.myProfile.Birth).getFullYear() < 1920)) {
					setPopout(null);
					setModalWindow(<ModalCommon modalName="SelectBirth" data={props.vkProfile} action={props.setVkProfileInfo} Close={() => setModalWindow(null)}></ModalCommon>)
				}
				else {

					// после регистрации, загрузки новых данных с сервера и указания года рождения необходимо обновить данные на сервере
					if (new Date(props.myProfile.Birth).getFullYear() < 1920) {
						props.getAuthInfo(props.vkProfile);
					}
					else { // если данные обновлены и все в порядке с профилями
						setModalWindow(null);
					}

					// поправка даты в vk профиле (правится, когда профиль грузится с бэкэнда без регистрации)
					if ((props.vkProfile.bdate.split('.').length == 2) && (new Date(props.myProfile.Birth).getFullYear() >= 1920)) {
						props.setVkProfileInfo({ ...props.vkProfile, bdate: props.vkProfile.bdate + "." + new Date(props.myProfile.Birth).getFullYear().toString() })
					}

					if (props.myProfile.CityUmbracoId != null && props.myProfile.CityUmbracoId == -1) {
						debugger
						// предлагаем выбрать город
						setPopout(null);
						setModalWindow(<ModalCommon modalName="SelectCity" data={{ profile: props.myProfile, cities: props.cities }} action={props.setUserProfileCity} Close={() => setModalWindow(null)}></ModalCommon>)
					}

				}


			}


		}

		// if (props.myProfile.Name)
		// {
		// 	setModalWindow(<ModalCommon modalName="MyProfile" data={props.myProfile} Close={() => setModalWindow(null)}></ModalCommon>)
		// }
	}, [props.myProfile])

	
	// отобразить панель админа турниров
	useEffect(() => {
		// если загрузились админы города
		if ((props.tournamentAdmins != undefined) && (props.tournamentAdmins.length > 0)) {
			// отображаем пункт меню администрирование турниров
			if (props.tournamentAdmins.find(x => x.UserProfileId == props.myProfile.UserProfileId) != undefined) {
				props.setShowAdminTourneyTab(true)
			}
			else {
				props.setShowAdminTourneyTab(false)
			}
		}
	}, [props.tournamentAdmins])


	const CellClick = (item) => {
        debugger
        props.setSelectedTournament(item);
        props.setTournamentMode("view");
		// надо заполнять TournamentGroups!
		props.setActiveMenuItem("tournamentitem");
		//toMenuName="tournamentadmin" selected={"tournamentadmin" === props.mainMenu.activeItem.name} data-story="tournamentadmin"
    }

	// useEffect(() =>{
	// 	debugger
	// 	if (props.vkProfile && props.vkProfile.city) {
	// 		if (props.myProfile) // зарегистрирован и получил данные
	// 		{
	// 			if (props.team.selected != null){
	// 				props.getActualTournamentsInCity(props.myProfile, props.team.selected);
	// 			}
	// 		}
	// 	}
	// }, [props.team.selected])

	// const changeView = (e) => {
	// 	props.setActiveMenuItem(e.currentTarget.dataset.story)
	// }

	let menuTabBarItems = props.mainMenu.menuItems.map(menuItem => {
		if (menuItem.enabled && menuItem.show)
			return <TabbarItemWithHistory toMenuName={menuItem.name} selected={menuItem.name === props.mainMenu.activeItem.name} data-story={menuItem.name} text={menuItem.title}></TabbarItemWithHistory>
		else
			return null
	}
	).filter(i => i);

	if ((Array.isArray(props.tournamentsForBids.selectedTournament)) && (props.tournamentsForBids.selectedTournament.length > 0))
		debugger

		
	return (
		
					<Epic
						activeStory={props.mainMenu.activeItem.name}
						tabbar={
							<Tabbar>
								<TabbarItemWithHistory toMenuName="hot" selected={"hot" === props.mainMenu.activeItem.name} data-story="hot" text="Горячее"></TabbarItemWithHistory>
								<TabbarItemWithHistory toMenuName="allTournaments" selected={"allTournaments" === props.mainMenu.activeItem.name} data-story="allTournaments" text="Турниры"></TabbarItemWithHistory>
								<TabbarItemWithHistory toMenuName="profile" selected={"profile" === props.mainMenu.activeItem.name} data-story="profile" text="Профиль"></TabbarItemWithHistory>
								{props.ShowAdminTourneyTab && <TabbarItemWithHistory toMenuName="tournamentadmin" selected={"tournamentadmin" === props.mainMenu.activeItem.name} data-story="tournamentadmin" text="Управление турнирами"></TabbarItemWithHistory>}
								{props.ShowAdminTeamTab && <TabbarItemWithHistory toMenuName="teamadmin" selected={"teamadmin" === props.mainMenu.activeItem.name} data-story="teamadmin" text="Мои команды"></TabbarItemWithHistory>}
							</Tabbar>}>

						<View id="hot" activePanel={props.matches.hotPanel} modal={modalWindow} popout={popout}>
							<Panel id="yesterday">
								<PanelHeader left={<BackButton isBack={true} />}>Вчера</PanelHeader>
								<Group>
									<InfoRow header="Информация">
										Турниры любительской лиги твоего города
									</InfoRow>
								</Group>
								<Group header={<Header mode="secondary">Матчи</Header>}>
									<Tabs>
										<TabsItem after={<Badge mode="prominent" />} onClick={() => props.setHotPanel("yesterday")}>Вчера</TabsItem>
										<TabsItem after={<Badge mode="prominent" />} onClick={() => props.setHotPanel("today")}>Сегодня</TabsItem>
										<TabsItem after={<Badge mode="prominent" />} onClick={() => props.setHotPanel("tomorrow")}>Завтра</TabsItem>
									</Tabs>
									<Hot Matches={props.matches.hot.yesterday}></Hot>
								</Group>
							</Panel>
							<Panel id="today">
								<PanelHeader left={<BackButton isBack={true} />}>Сегодня</PanelHeader>
								<Group>
									<InfoRow header="Информация">
										Турниры любительской лиги твоего города
									</InfoRow>
								</Group>
								<Group header={<Header mode="secondary">Матчи</Header>}>
									<Tabs>
										<TabsItem after={<Badge mode="prominent" />} onClick={() => props.setHotPanel("yesterday")}>Вчера</TabsItem>
										<TabsItem after={<Badge mode="prominent" />} onClick={() => props.setHotPanel("today")}>Сегодня</TabsItem>
										<TabsItem after={<Badge mode="prominent" />} onClick={() => props.setHotPanel("tomorrow")}>Завтра</TabsItem>
									</Tabs>
									<Hot Matches={props.matches.hot.today}></Hot>
								</Group>
							</Panel>
							<Panel id="tomorrow">
							<PanelHeader left={<BackButton isBack={true} />}>Завтра</PanelHeader>
								<Group>
									<InfoRow header="Информация">
										Турниры любительской лиги твоего города
									</InfoRow>
								</Group>
								<Group header={<Header mode="secondary">Матчи</Header>}>
									<Tabs>
										<TabsItem after={<Badge mode="prominent" />} onClick={() => props.setHotPanel("yesterday")}>Вчера</TabsItem>
										<TabsItem after={<Badge mode="prominent" />} onClick={() => props.setHotPanel("today")}>Сегодня</TabsItem>
										<TabsItem after={<Badge mode="prominent" />} onClick={() => props.setHotPanel("tomorrow")}>Завтра</TabsItem>
									</Tabs>
									<Hot Matches={props.matches.hot.tomorrow}></Hot>
								</Group>
							</Panel>
						</View>
						<View id="allTournaments" activePanel="main" modal={modalWindow} popout={popout}>
							<Panel id="main">
								<PanelHeader
									left={<BackButton isBack={true} />}
								//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
								>
									Все турниры
								</PanelHeader>
								<Group header={<Header>Текущие турниры города</Header>}>
									<List>

										{
										props.tournament.tournaments.map(t => {
											
											return <RichCell
												caption={`Организатор: ${t.Founder.Name} ${t.Founder.Surname}`}
												text={(new Date(t.WhenBegin) > new Date()) ? 
													`Стартует 
													${new Date(t.WhenBegin).getDate() <= 9 ? "0" + (new Date(t.WhenBegin).getDate()) : (new Date(t.WhenBegin).getDate())}.${new Date(t.WhenBegin).getMonth()+1 <= 9 ? "0" + (new Date(t.WhenBegin).getMonth()+1) : (new Date(t.WhenBegin).getMonth()+1)}.${new Date(t.WhenBegin).getFullYear()}`
													: 
													"В процессе"}
												onClick={() => CellClick(t)} 
											>{t.Name}</RichCell>
										})}
									</List>
									
								</Group>
								<Group hidden header={<Header>Архивные турниры города</Header>}>
									
								</Group>
							</Panel>
						</View>
						<View id="profile" activePanel="main" modal={modalWindow} popout={popout}>
							<Panel id="main">
								<PanelHeader
									left={<BackButton isBack={true} />}
								//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
								>
									Профиль
						</PanelHeader>
								<Group>{props.myProfile && props.myProfile.Name && <>
									<InfoRow header="Имя">{props.myProfile && props.myProfile.Name}</InfoRow>
									<InfoRow header="Фамилия">{props.myProfile && props.myProfile.Surname}</InfoRow>
									<InfoRow header="Город">{props.myProfile && props.myProfile.CityName}</InfoRow>
									<InfoRow header="Год рождения">{props.myProfile && new Date(props.myProfile.Birth).getFullYear()}</InfoRow>
									<InfoRow header="Id города привязки">{props.myProfile && props.myProfile.CityUmbracoId}</InfoRow>
									<InfoRow header="Город привязки">{props.myProfile && props.myProfile.CityUmbracoName}</InfoRow>
								</>
								}
								</Group>
								<ProfilePanel></ProfilePanel>
							</Panel>
						</View>
						<View id="tournamentadmin" activePanel="main" modal={modalWindow} popout={popout}>
							<Panel id="main">
								<PanelHeader
									left={<BackButton isBack={true} />}
								//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
								>
									Управление турнирами
						</PanelHeader>
								<Group>
									<TournamentAdminPanel></TournamentAdminPanel>
								</Group>
							</Panel>
						</View>
						<View id="teamadmin" activePanel="main" modal={modalWindow} popout={popout}>
							<Panel id="main">
								<PanelHeader
									left={<BackButton isBack={true} />}
								//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
								>
									Мои команды
								</PanelHeader>
								<Group>
									<TeamAdminPanel></TeamAdminPanel>
								</Group>
							</Panel>
						</View>
						<View id="tournamentitem" activePanel="main" modal={modalWindow} popout={popout}>
							<Panel id="main">
								<PanelHeader
									left={<BackButton isBack={true} />}
								//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
								>
									Турнир
								</PanelHeader>
								<Group>
									<TournamentItem 
									mode={props.tournament.mode}
									//Tab="shedule"
									//mode="view"
									></TournamentItem>
								</Group>
							</Panel>
						</View>
						<View id="teamitem" activePanel="main" modal={modalWindow} popout={popout}>
							<Panel id="main">
								<PanelHeader
									left={<BackButton isBack={true} />}
								//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
								>
									Команда
								</PanelHeader>
								<Group>
									<TeamItem mode={props.team.mode}></TeamItem>
								</Group>
							</Panel>
						</View>
						<View id="bidlist" activePanel="main" modal={modalWindow} popout={popout}>
							<Panel id="main">
								<PanelHeader
									left={<BackButton isBack={true} />}
								//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
								>
									Доступно для заявки
								</PanelHeader>
								<Group>
									{/* <BidTeamTournamentGroupsList
										Button1Handle = {MakeBid}
										Button2Handle = {CancelBid}
										List={(props.tournamentsForBids.selectedTournament  
											&& Array.isArray(props.tournamentsForBids.selectedTournament) 
											&& props.tournamentsForBids.selectedTournament.TournamentGroups.length > 0) 
											? props.tournamentsForBids.selectedTournament.TournamentGroups
											: null
										}
										Bids={(props.tournamentsForBids.myBids 
											&& Array.isArray(props.tournamentsForBids.myBids)
											&& props.tournamentsForBids.myBids.length > 0) 
											? props.tournamentsForBids.myBids
										: null
										}
									></BidTeamTournamentGroupsList> */}
								</Group>
							</Panel>
						</View>
						<View id="viewuser" activePanel="main" modal={modalWindow} popout={popout}>
							<Panel id="main">
								<PanelHeader
									left={<BackButton isBack={true} />}
								//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
								>
									Игрок
								</PanelHeader>
							Игрок
							</Panel>
						</View>
						

					</Epic>
				
	);
}

const mapStateToProps = (state) => {
	return {
		mainMenu: state.mainMenu,
		ShowAdminTourneyTab: state.system.ShowAdminTourneyTab,
		ShowAdminTeamTab: state.system.ShowAdminTeamTab,
		cities: state.cityEntity.cities,
		places: state.placeEntity.places,
		globalPopout: state.system.GlobalPopout,
		vkProfile: state.profileEntity.vkProfile,
		myProfile: state.profileEntity.myProfile,
		errorObject: state.system.ErrorObject,
		triedToGetProfile: state.profileEntity.triedToGetProfile,
		tournamentAdmins: state.tournamentsEntity.cityTournamentAdmins,
		tournament: state.tournamentsEntity,
		team: state.teamsEntity,
		bidTeams: state.bidTeamsEntity,
		matches: state.matches,
        tournamentsForBids: state.bidTeamsEntity,
	}
}

export default connect(mapStateToProps, {
	addBidTeamToTournamentGroup, cancelBidTeamToTournamentGroup, getActualTournamentsInCity, getTournamentsByCityId, setSelectedTournament, setTournamentMode,
	setActiveMenuItem, getAllPlaces, setVkProfileInfo, setGlobalPopout, getUserProfile, getAuthInfo, setTriedToGetProfile, setHotPanel,
	getAllCitiesFromServer, setUserProfileCity, getAllPlacesInCityByCityId, getAllCityTournamentAdminsByCityId, setShowAdminTourneyTab, getMatchesInCurrentCity,
})(App);
