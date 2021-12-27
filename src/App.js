import bridge from '@vkontakte/vk-bridge';
import { Card, CardGrid, Epic, FormItem, Group, Header, InfoRow, List, Panel, PanelHeader, PullToRefresh, ScreenSpinner, Tabbar, Title, View } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {useIsConnected} from './store/selectors/selectors'
import request from 'request'
import { connect } from 'react-redux';
import ModalCommon from './components/Modals/ModalCommon/ModalCommon';
import SimpleCollectItem from './components/Panels/AdminPanel/Collect/SimpleCollect/SimpleCollectItem';
import TeamAdminPanel from './components/Panels/AdminPanel/Team/TeamAdminPanel';
import TeamItem from './components/Panels/AdminPanel/Team/TeamItem';
import TournamentAdminPanel from './components/Panels/AdminPanel/Tournament/TournamentAdminPanel';
import TournamentItem from './components/Panels/AdminPanel/Tournament/TournamentItem';
import BackButton from './components/Panels/Common/BackButton/BackButton';
import Hot from './components/Panels/Common/Hot/Hot';
import CardWithHistory from './components/Panels/Common/WithHistory/CardWithHistory';
import CellButtonWithHistory from './components/Panels/Common/WithHistory/CellButtonWithHistory';
import RichCellWithHistory from './components/Panels/Common/WithHistory/RichCellWithHistory';
import TabbarItemWithHistory from './components/Panels/Common/WithHistory/TabbarItemWithHistory';
import ButtonWithNotify from './components/Panels/Common/WithNotify/ButtonWithNotify';
import ProfilePanel from './components/Panels/ProfilePanel/ProfilePanel';
import player from './img/common/player300-s.png';
import stadium from './img/common/stadium300-s.png';
import tournament from './img/common/tournament300.png';
import { addBidTeamToTournamentGroup, cancelBidTeamToTournamentGroup, getActualTournamentsInCity } from './store/bidTeamsReducer';
import { getAllCitiesFromServer } from './store/cityReducer';
import { getAllSimpleCollectsInCityByCityUmbracoId, selectSimpleCollect, setCollectItemMode } from './store/collectReducer';
import { setActiveMenuItem } from './store/mainMenuReducer';
import { getMatchesInCurrentCity, setHotPanel } from './store/matchReducer';
import { getAuthInfo, getUserProfile, setTriedToGetProfile, setUserProfileCity, setVkProfileInfo } from './store/profileReducer';
import { getAllRentsInCityByCityId } from './store/rentReducer';
import { getAllSimplePlacesInCityByCityId } from './store/simplePlaceReducer';
import { goToPanel, resetError, setCurrentModalWindow, checkConnection, setGlobalPopout, 
	setLoading, setShowAdminTourneyTab, updateLoading } from './store/systemReducer';
import { getAllCityTournamentAdminsByCityId, getTournamentsByCityId, setSelectedTournament, setTournamentMode } from './store/tournamentsReducer';
import { getUser, setSelectedUser } from './store/vkReducer';
import { addToTime } from './utils/convertors/dateUtils';
import MatchItem from './components/Panels/AdminPanel/Match/MatchItem';
import { useDispatch } from 'react-redux';



const App = (props) => {
	const [fetchedUser, setUser] = useState(null);
	const [isFetching, setIsFetching] = useState(false);
	const debugModeOn = false; // флаг показа логов
	//const [popout, setPopout] = useState(props.globalPopout ? <ScreenSpinner size='large' /> : null);
	//const [modalWindow, setModalWindow] = useState(null);
	const [viewCollectTab, setCollectViewTab] = useState("main");
	const [timerStarts, setTimerStarts] = useState(false);
	let connectionTimer = null;

	const cardStyle = {
		position: 'absolute', 
		bottom: '0px', 
		left:'0px',  
		width: '100%', 
		height: '20%',
		background: 'white', 
		padding: '15px 0',
		textAlign: 'center',
		opacity: '0.9',
		borderRadius: '10px'
	}



	// функция вывода на консоль. легко отключается флагом
	const consoleLog = (message) => {
		if (debugModeOn)
			console.log(message);
	}

// интервальная проверка новых мест, сборов и аренд
	const checkMovings = () => {
		//alert('Привет');
		if (props.cities && props.cities.length > 0 && props.myProfile && props.myProfile.CityUmbracoId != null &&
			props.myProfile.CityUmbracoId != -1 && new Date(props.myProfile.Birth).getFullYear() >= 1920 && props.places.length == 0) {
			// загружаем места этого города
			{
				// получаем список простых мест по umbId города
				props.getAllSimplePlacesInCityByCityId(props.myProfile.CityUmbracoId);

				// получаем список простых сборов
				props.getAllSimpleCollectsInCityByCityUmbracoId(props.myProfile.CityUmbracoId);
	
				// получаем список аренд
				props.getAllRentsInCityByCityId(props.myProfile.CityUmbracoId);
			}
		}
	}



// интервальная проверка соединения
	const CheckConnection = () => {
		let ii = store.getState();

		if (ii.system.Connected) {
			consoleLog("timer stopped in CheckConnection");
			clearInterval(connectionTimer);
		}
		else{
			consoleLog("timer fires in CheckConnection, props.Connected=" + ii.system.Connected);
			props.checkConnection();
		}
	}


	const CloseModal = () => {
		props.resetError()
		props.setCurrentModalWindow(null)
	}


	// !! ================ useffects загрузка приложения ================== !!

	// загрузка информации о пользователе ВК (внутри первого useffect с пустыми параметрами)
	async function fetchData() {

		const user = await bridge.send('VKWebAppGetUserInfo');
		setUser(user);
		props.setVkProfileInfo(user);

	}

	// 1 это системное, загрузка приложения вк
	useEffect(() => {
		if (props.myProfile && props.myProfile.CityUmbracoId != undefined){
			props.setLoading(true);
		}

		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {

				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

		fetchData();
		consoleLog("1 start fetchData()")

	}, []);

	// 2 при загрузке приложения
	useEffect(() => {

		if (!props.Connected) {

			consoleLog("2 start checkConnection()")
			props.checkConnection();
			connectionTimer = setInterval(() => {
				CheckConnection()
			}, 5000)
		}
	}, [props.vkProfile])

	// 3 после загрузки профиля вк проверяем инициируем соединение с сервером
	useEffect(() => {
		// нужно узнать город, далее если этого города нет в списке поддерживаемых, предлжить выбрать другой город и отправить заявку на добавление города. Всё это в модалке
		// другой вопрос. если кто-то создает фейковый сбор, как гарантировать другим, что это не фейк?
		// ввести в рейтинг поле "гарант сбора. если поступает жалоба на сбор (не было сбора), модератор засчитывает штрафной балл организатору"
		// у людей, которые первый раз собирают, писать город из профиля, количество друзей и то, что человек еще не собирал ни разу, а значит может быть фейком
		// еще нужно запрашивать права на доступ к инфе: город, дата рождения, друзья, 
		// а еще в бэке надо сделать так, чтобы записи в Leg и City не плодились, а искали соответствующие из умбрако и ставили их Id
		consoleLog("3 check if. Connected=" + (props.Connected) + " , vkProfile=" + (props.vkProfile!=null) + ", myProfile=" + (props.myProfile==null))
		
		if (props.Connected && props.vkProfile && props.vkProfile.city && !props.myProfile) {
			consoleLog("3 start getUserProfile()")
			props.getUserProfile(props.vkProfile);
		}

		if (props.Connected) {
			consoleLog("3 timer stopped");
			//clearInterval(connectionTimer);
		}

	}, [props.Connected, props.vkProfile])

	// 4 загрузка профиля
	useEffect(() => {

		if (props.vkProfile && props.vkProfile.city && props.myProfile) {
			consoleLog("4 vkprofile and myprofile loaded")

			if((props.vkProfile.bdate != undefined) && (props.vkProfile.bdate.split('.').length > 2) && (new Date(props.myProfile.Birth).getFullYear() > 1920)) // 
			{
				consoleLog("4 no error in birthdate from vk")

				props.setCurrentModalWindow(null);
				props.getAllCitiesFromServer();
				consoleLog("4 start getAllCitiesFromServer()")

				if (props.myProfile.CityUmbracoId != null && props.myProfile.CityUmbracoId == -1) {
				consoleLog("4 error in userprofile city")

					//debugger
					// предлагаем выбрать город
					props.setGlobalPopout(false);
					props.setCurrentModalWindow(<ModalCommon modalName="SelectCity" data={{ profile: props.myProfile, cities: props.cities }} action={props.setUserProfileCity} Close={() => props.setCurrentModalWindow(null)}></ModalCommon>)
				}
			//props.getUser(19757699);
			}
			else{
				consoleLog("4  error in birthdate from vk or myProfile.Birth.getFullYear < 1920")
				
			}
		}
		else{
			// не загрузился город или вк профиль или мой профиль
		}

	}, [props.myProfile])
	
	// 5 регистрация пользователя
	useEffect(() => {

		if (props.vkProfile && props.vkProfile.city) {
			if ((!props.myProfile) && (props.triedToGetProfile>0)) { // не зарегистрирован
				consoleLog("5 not registred")

				if ((props.vkProfile) && (props.vkProfile.bdate == undefined))
				{
					consoleLog("5 selectBirth")

					props.setGlobalPopout(false);
					props.setCurrentModalWindow(<ModalCommon modalName="SelectBirth" data={props.vkProfile} action={props.setVkProfileInfo} action2={props.setTriedToGetProfile} Close={() => props.setCurrentModalWindow(null)}></ModalCommon>)
				}
				else if ((props.vkProfile) && (props.vkProfile.bdate.split('.').length == 2) && (new Date(props.myProfile.Birth).getFullYear() < 1920)) {
					consoleLog("5 selectBirthYear")
					
					props.setGlobalPopout(false);
					props.setCurrentModalWindow(<ModalCommon modalName="SelectBirthYear" data={props.vkProfile} action={props.setVkProfileInfo} action2={props.setTriedToGetProfile} Close={() => props.setCurrentModalWindow(null)}></ModalCommon>)
				}
				else{
					props.getAuthInfo(props.vkProfile); // регаем
					consoleLog("5 start getAuthInfo() - register")

				}
			}
		}
	}, [props.triedToGetProfile])
	
	// 6 загрузка мест, админов города, текущих турниров
	useEffect(() => {
		//consoleLog("6 cities fire")
		// а это уже когда прогрузился и выбран город профиля
		if (props.cities && props.cities.length > 0 && props.myProfile && props.myProfile.CityUmbracoId != null &&
			props.myProfile.CityUmbracoId != -1 && new Date(props.myProfile.Birth).getFullYear() >= 1920 && props.places.length == 0) {
			
			consoleLog("6 start loadAll()")


			// загружаем места этого города
			props.goToPanel("hot", false)

			// получаем список админов турниров города по umbId города
			props.getAllCityTournamentAdminsByCityId(props.myProfile.CityUmbracoId);

			// получаем список активных турниров города по umbId города и текущей дате
			props.getTournamentsByCityId(props.myProfile.CityUmbracoId);

			// получаем список простых мест по umbId города
			props.getAllSimplePlacesInCityByCityId(props.myProfile.CityUmbracoId);

			// получаем список простых сборов
			props.getAllSimpleCollectsInCityByCityUmbracoId(props.myProfile.CityUmbracoId);

			// получаем список аренд
			props.getAllRentsInCityByCityId(props.myProfile.CityUmbracoId);

			if (!timerStarts)
			{
				setTimerStarts(true);
				setTimeout(() => setInterval(() => checkMovings(), 20000), 20000)

			}

		}

		// это пока не прогрузился город профиля (не выбран)
		if (props.cities && props.cities.length > 0 && props.myProfile && props.myProfile.CityUmbracoId != null &&
			props.myProfile.CityUmbracoId == -1 && new Date(props.myProfile.Birth).getFullYear() >= 1920) // важно, чтобы все это прогрузилось уже
		{

			// предлагаем выбрать город
			props.setGlobalPopout(false);
			props.setCurrentModalWindow(<ModalCommon modalName="SelectCity" data={{ profile: props.myProfile, cities: props.cities }} action={props.setUserProfileCity} Close={() => props.setCurrentModalWindow(null)}></ModalCommon>)
		}


	}, [ props.cities]) //props.myProfile, props.vkProfile,

	// 7 загрузка матчей в выбранном городе
	useEffect(() => {
		if (props.places && props.places.length > 0) {

			props.getMatchesInCurrentCity(props.myProfile);
			consoleLog("7 start getMatchesInCurrentCity()")
			
			// завершили загрузку
			if (props.Loading)
				props.setLoading(false);
		}
	}, [props.places])

	// при смене глобального Popout и возникновении ошибки
	useEffect(() => {
		if (props.errorObject && props.errorObject != "") {
		}
		else {
		}
	}, [props.errorObject])

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

	// !! ================ useffects загрузка приложения ================== !!

	const onRefresh = () => {
		window.location.reload(true);
		setIsFetching(false);
	}

	const TournamentSelect = (item) => {
		//debugger
		props.setTournamentMode("view");
		props.setSelectedTournament(item);
		// надо заполнять TournamentGroups!
		//props.setActiveMenuItem("tournamentitem"); // отключил, тк установил компонент hoc withHistory
		//toMenuName="tournamentadmin" selected={"tournamentadmin" === props.mainMenu.activeItem.name} data-story="tournamentadmin"
	}

	const CollectSelect = (item) => {
		//debugger
		props.selectSimpleCollect(item);
		props.setCollectItemMode("view");
		//props.setActiveMenuItem("collectadmin"); // отключил тк использовал компонент с hoc withHistory
	}

	const CollectAdd = () => {
		//debugger
		props.setCollectItemMode("add");
		//props.setActiveMenuItem("collectadmin"); // отключил, тк сделал кнопку через hoc withHistory
	}

	const UpdateFromServer = () => {
		window.location.reload(true);
	}

	let test = () => {
		
		
	}

	let menuTabBarItems = props.mainMenu.menuItems.map(menuItem => {
		if (menuItem.enabled && menuItem.show)
			return <TabbarItemWithHistory toMenuName={menuItem.name} selected={menuItem.name === props.mainMenu.activeItem.name} data-story={menuItem.name} text={menuItem.title}></TabbarItemWithHistory>
		else
			return null
	}
	).filter(i => i);

	//if ((Array.isArray(props.tournamentsForBids.selectedTournament)) && (props.tournamentsForBids.selectedTournament.length > 0))
	//debugger


	return (
		<PullToRefresh
            onRefresh={onRefresh}
            isFetching={isFetching}
          >
			  <PanelHeader left={<BackButton isBack={true} />}>
				  <h6>потяните вниз для обновления</h6>
			  </PanelHeader>
			<Epic
				activeStory={props.mainMenu.activeItem.name}
				tabbar={props.Connected ? 
					<Tabbar>
						<TabbarItemWithHistory toMenuName="hot" selected={"hot" === props.mainMenu.activeItem.name} data-story="hot" text="Горячее"></TabbarItemWithHistory>
						<TabbarItemWithHistory toMenuName="allTournaments" selected={"allTournaments" === props.mainMenu.activeItem.name} data-story="allTournaments" text="Турниры"></TabbarItemWithHistory>
						{/* <TabbarItemWithHistory toMenuName="collectslist" selected={"collectslist" === props.mainMenu.activeItem.name} data-story="collectslist" text="Сборы"></TabbarItemWithHistory> */}
						<TabbarItemWithHistory toMenuName="profile" selected={"profile" === props.mainMenu.activeItem.name} data-story="profile" text="Профиль"></TabbarItemWithHistory>
						{props.ShowAdminTourneyTab && <TabbarItemWithHistory toMenuName="tournamentadmin" selected={"tournamentadmin" === props.mainMenu.activeItem.name} data-story="tournamentadmin" text="Управление турнирами"></TabbarItemWithHistory>}
						{
						//props.ShowAdminTeamTab 
						props.ShowAdminTourneyTab 
						&& <TabbarItemWithHistory toMenuName="teamadmin" selected={"teamadmin" === props.mainMenu.activeItem.name} data-story="teamadmin" text="Мои команды"></TabbarItemWithHistory>}
					</Tabbar>
				: null	
				}>

				<View id="hot" 
				//activePanel={props.matches.hotPanel} 
				activePanel="main" 
				modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
					<Panel id="main">
						{/* <PanelHeader >Горячее в городе</PanelHeader> */}
						<Group header={<Header mode="secondary">Сервисы</Header>}>
							<CardGrid size="s">
								<CardWithHistory
									data-story="allTournaments"  // необходимо для использования withHistory
									text="Перейти к турнирам" // необходимо для использования withHistory
									toMenuName="allTournaments"  // необходимо для использования withHistory
									//handleClick={CollectAdd} // необходимо для использования withHistory
								>
									<img style={{width: '100%'}} src={tournament}></img>
									<span style={cardStyle}>Турниры<br />города</span>
								</CardWithHistory>
								<Card>
									<img style={{width: '100%'}} src={player}></img>
									<span style={cardStyle}>Скоро<br />запуск</span>
								</Card>
								<Card onClick={test}>
									<img style={{width: '100%'}} src={stadium}></img>
									<span style={cardStyle}>Скоро<br />запуск</span>
								</Card>
								
							</CardGrid>
						</Group>
						<Group header={<Header mode="secondary">Предстоящие матчи</Header>}>
							<Hot Name="Сегодня" Matches={props.matches.hot.today}></Hot>
							<Hot Name="Завтра" Matches={props.matches.hot.tomorrow}></Hot>
							
						</Group>
						<Group header={<Header mode="secondary">Сыграны вчера</Header>}>
							<Hot Matches={props.matches.hot.yesterday}></Hot>
						</Group>
					</Panel>
				
				</View>
				<View id="allTournaments" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
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

										return <RichCellWithHistory
											caption={`Организатор: ${t.Founder.Name} ${t.Founder.Surname}`}
											text={(new Date(t.WhenBegin) > new Date()) ?
												`Стартует 
														${new Date(t.WhenBegin).getDate() <= 9 ? "0" + (new Date(t.WhenBegin).getDate()) : (new Date(t.WhenBegin).getDate())}.${new Date(t.WhenBegin).getMonth() + 1 <= 9 ? "0" + (new Date(t.WhenBegin).getMonth() + 1) : (new Date(t.WhenBegin).getMonth() + 1)}.${new Date(t.WhenBegin).getFullYear()}`
												:
												"В процессе"}
											handleClick={() => TournamentSelect(t)}
											data-story="tournamentitem"
											toMenuName="tournamentitem"
										>{t.Name}</RichCellWithHistory>
									})}
							</List>

						</Group>
						<Group hidden header={<Header>Архивные турниры города</Header>}>

						</Group>
					</Panel>
				</View>
				<View id="collectslist" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
					<Panel id="main">
						<PanelHeader
							left={<BackButton isBack={true} />}
						//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
						>
							Все сборы
						</PanelHeader>
						<FormItem>
							<CellButtonWithHistory
								data-story="collectadmin"  // необходимо для использования withHistory
								text="Создать сбор" // необходимо для использования withHistory
								toMenuName="collectadmin"  // необходимо для использования withHistory
								handleClick={CollectAdd} // необходимо для использования withHistory
							>
								Арендовать площадку и собрать людей</CellButtonWithHistory>
						</FormItem>
						<Group header={<Header>Текущие сборы города</Header>}>
							<List>

								{

									props.collect.collects.sort((a, b) => new Date(a.When).getTime() - new Date(b.When).getTime())
										.map(t => {
											let timeEnding = addToTime(new Date(t.When), 0, t.DurationMinutes);

											return <RichCellWithHistory
												caption={`Организатор: ${t.Creator.Name} ${t.Creator.Surname}`}
												text={(new Date(t.When) > new Date()) ?
													`Начало 
														${new Date(t.When).getDate() <= 9 ? "0" + (new Date(t.When).getDate()) : (new Date(t.When).getDate())}.${new Date(t.When).getMonth() + 1 <= 9 ? "0" + (new Date(t.When).getMonth() + 1) : (new Date(t.When).getMonth() + 1)}.${new Date(t.When).getFullYear()}
														в 
														${new Date(t.When).getHours() <= 9 ? "0" + (new Date(t.When).getHours()) : (new Date(t.When).getHours())}:${new Date(t.When).getMinutes() <= 9 ? "0" + (new Date(t.When).getMinutes()) : (new Date(t.When).getMinutes())}
														`
													:
													((timeEnding > new Date())
														?
														"В процессе"
														:
														"Закончен"
													)
												}
												handleClick={() => CollectSelect(t)}
												after={`${t.Cost} руб.`}
												data-story="collectadmin"
												toMenuName="collectadmin"

											>
												({t.Members.length}/{t.NeedMembers}) - {t.Name}
											</RichCellWithHistory>
										})}
							</List>

						</Group>
						<Group hidden header={<Header>Архивные сборы</Header>}>

						</Group>
					</Panel>
				</View>
				<View id="collectadmin" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
					<Panel id="main">
						<PanelHeader
							left={<BackButton isBack={true} />}
						//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
						>
							Управление сборами
						</PanelHeader>
						<SimpleCollectItem></SimpleCollectItem>
					</Panel>
				</View>
				<View id="profile" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
					<Panel id="main">
						<PanelHeader
							left={<BackButton isBack={true} />}
						//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
						>
							Профиль
						</PanelHeader>
						<Group>{props.myProfile && props.myProfile.Name && <FormItem>
							<InfoRow header="Имя">{props.myProfile && props.myProfile.Name}</InfoRow>
							<InfoRow header="Фамилия">{props.myProfile && props.myProfile.Surname}</InfoRow>
							<InfoRow header="Город">{props.myProfile && props.myProfile.CityName}</InfoRow>
							<InfoRow header="Уровень игры">{props.myProfile && props.myProfile.TotalExpirience}</InfoRow>
							<InfoRow header="Год рождения">{props.myProfile && new Date(props.myProfile.Birth).getFullYear()}</InfoRow>
							<InfoRow header="Id города привязки">{props.myProfile && props.myProfile.CityUmbracoId}</InfoRow>
							<InfoRow header="Город привязки">{props.myProfile && props.myProfile.CityUmbracoName}</InfoRow>
						</FormItem>
						}
						</Group>
						<Group hidden>
							Описание проекта, возможность написать автору, выбор амплуа, выбор уровня (не играл, новичек, город и тд)
							<br />
							Ссылка на сайт и на канал на ютубе, где документация есть по проекту
							<br/>
							сделать кнопку "подписаться на уведомления"
							запросить разрешение на отправку сообщения от имени приложения (или сообщества?)
						</Group>
						<Group header="Опции">
							<FormItem>
								<ButtonWithNotify Message="Подписаться на уведомления от сервиса?" mode="primary" Yes={() => bridge.send("VKWebAppAllowNotifications")}>Подписаться на события</ButtonWithNotify>
							</FormItem>
							
						</Group>
						<ProfilePanel></ProfilePanel>
					</Panel>
				</View>
				<View id="tournamentadmin" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
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
				<View id="teamadmin" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
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
				<View id="tournamentitem" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
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
				<View id="teamitem" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
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
				<View id="matchitem" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
					<Panel id="main">
						<PanelHeader
							left={<BackButton isBack={true} />}
						//right={<AddCollectButton isBack={false} toMenuName="addcollect"></AddCollectButton>}
						>
							Матч
						</PanelHeader>
						<Group>
							<MatchItem match={props.matches.selected}></MatchItem>
						</Group>
					</Panel>
				</View>
				<View id="bidlist" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
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
				<View id="viewuser" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
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
				<View id="notauthorized" activePanel="main" modal={props.CurrentModalWindow} popout={props.globalPopout ? <ScreenSpinner></ScreenSpinner> : null }>
					<Panel id="main">
						<CardGrid size="l">
							<Card style={{height: '100%'}}>
								<FormItem style={{height: '100px'}}>
									<span style={cardStyle}><Title>{!props.Connected ? 'Соединение...' : 'Авторизация...'}</Title></span>
								</FormItem>
							</Card>
						</CardGrid>
						
					</Panel>
					
				</View>


			</Epic>
		</PullToRefresh>
	);
}

const mapStateToProps = (state) => {

	return {
		mainMenu: state.mainMenu,
		ShowAdminTourneyTab: state.system.ShowAdminTourneyTab,
		ShowAdminTeamTab: state.system.ShowAdminTeamTab,
		CurrentModalWindow: state.system.CurrentModalWindow,
		Loading: state.system.Loading,
		Connected: state.system.Connected,
		CheckLoading: state.system.CheckLoading,
		cities: state.cityEntity.cities,
		//places: state.placeEntity.places,
		places: state.simplePlaceEntity.places,
		globalPopout: state.system.GlobalPopout,
		vkProfile: state.profileEntity.vkProfile,
		myProfile: state.profileEntity.myProfile,
		errorObject: state.system.ErrorObject,
		//`errorMessage: state.system.ErrorObject.message,
		triedToGetProfile: state.profileEntity.triedToGetProfile,
		tournamentAdmins: state.tournamentsEntity.cityTournamentAdmins,
		tournament: state.tournamentsEntity,
		collect: state.collectEntity,
		team: state.teamsEntity,
		bidTeams: state.bidTeamsEntity,
		matches: state.matches,
		tournamentsForBids: state.bidTeamsEntity,
	}
}

export default connect(mapStateToProps, { 
	setCurrentModalWindow, setLoading, goToPanel, checkConnection, updateLoading,
	getAllSimpleCollectsInCityByCityUmbracoId, getAllSimplePlacesInCityByCityId, getAllRentsInCityByCityId, getUser, setSelectedUser,
	addBidTeamToTournamentGroup, cancelBidTeamToTournamentGroup, getActualTournamentsInCity, getTournamentsByCityId, setSelectedTournament, setTournamentMode, setCollectItemMode,
	setActiveMenuItem, setVkProfileInfo, setGlobalPopout, getUserProfile, getAuthInfo, setTriedToGetProfile, setHotPanel, resetError, selectSimpleCollect,
	getAllCitiesFromServer, setUserProfileCity, getAllCityTournamentAdminsByCityId, setShowAdminTourneyTab, getMatchesInCurrentCity,
})(App);
