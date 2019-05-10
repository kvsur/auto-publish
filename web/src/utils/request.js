import fetch from 'dva/fetch';
import { message } from 'antd';

function parseJSON(response) {
	return response.json();
}

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else if (response.status === 401) {
		message.error('登录之后才有权限操作');
		const route = window.location.hash.split('#')[1];
		if (route !== '/login') {
			window.sessionStorage.setItem('oqw50q5y', route);
		}
		window.location = window.location.origin + window.location.pathname + '#/login';
		return;
	} else if ([502, 504].some(status => response.status === status)) {
		message.error('无法连接服务端路由');
		const route = window.location.hash.split('#')[1];
		if (route !== '/login') {
			// window.sessionStorage.setItem('oqw50q5y', route);
			window.location = window.location.origin + window.location.pathname + '#/login';
		}
		return;
	}

	const error = new Error(response.statusText);
	error.response = response;
	throw error;
}

function queryParams(params) {
	return Object.keys(params)
		.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		.join('&');
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
	if (options.params) {
		url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(options.params);
		delete options.params;
	}

	const DRDDOPM_OF = JSON.parse(window.localStorage.getItem('DRDDOPM_OF')) || { token: '' };

	const Authorization = 'jwt ' + (DRDDOPM_OF && DRDDOPM_OF.token || '');

	try {
		options.headers = {
			...options.headers,
			Authorization
		};
	} catch (err) {
		options.headers = {
			Authorization,
		};
	}

	return fetch(url, options)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => ({ ...data }))
		.catch(err => ({ err }));
}
