import Axios from 'axios'

//export const backserver = "https://oblakosporta-alexsmi.1gb.ru";
//export const backserver = "https://testhhide.alexsmirnovpro.ru";
//export const backserver = "https://oblakosporta.ru";
export const backserver = "https://localhost:44325";
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