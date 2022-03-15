import Axios from 'axios'

//export const backserver = "https://oblakosporta-alexsmi.1gb.ru";
export const backserver = "https://testhhide.alexsmirnovpro.ru"; // тестовый 2
//export const backserver = "https://oblakosporta.ru"; // прод
//export const backserver = "https://front.oblakosporta.ru";
//export const backserver = "https://localhost:44325";  
//export const backserver = "https://192.168.56.101:44325"; // локальный
//export const backserver = "http://192.168.56.101:51463"; // локальный без сертификата
export const URL = backserver + "/umbraco/api/";
export const authQueryString = window.location.search;



export	const PostJsonInstance = Axios.create(
		{
			baseURL: URL,
			timeout: 15000,
			method: "POST",
			headers: {
				"Content-Type": "application/json"}
		}
	)