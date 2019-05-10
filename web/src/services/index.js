import request from '../utils/request';

export function login(user) {
	return request('/api/auth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	});
}

export function fetchLogs({ date }) {
	return request(`/api/log`, {
		method: 'GET',
		params: {
			date,
		}
	})
}

export function getProjectConfig() {
	return request(`/api/projectConfig`, {
		method: 'GET',
	});
}

export function deleteBroker(params) {
	return request(`/api/deleteBroker`, {
		method: 'DElETE',
		params,
	});
}

export function deleteProject(params) {
	return request(`/api/deleteProject`, {
		method: 'DElETE',
		params,
	});
}

export function addProject(body) {
	return request(`/api/addConfig`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

export function addBroker(body) {
	return request(`/api/addBroker`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

export function getSVNversions(body) {
	return request(`/api/getVersions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

export function deploy(body) {
	return request(`/api/deploy`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

export function fetchDocs() {
	return request(`/api/docs`, {
		method: 'GET',
	});
}

export function fetchDoc(params) {
	return request(`/api/doc`, {
		method: 'GET',
		params: {
			...params,
			date: new Date().getTime(),
		},
	});
}

export function deleteDoc(params) {
	return request(`/api/doc`, {
		method: 'DElETE',
		params,
	});
}

export function newDoc(body) {
	return request(`/api/doc`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

export function fetchUsers() {
	return request('/api/users', {
		method: 'GET',
	});
}

export function addUser(body) {
	return request('/api/addUser', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

export function updateUserInfo(body) {
	return request('/api/updateUserInfo', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

export function deleteUser(params) {
	return request('/api/deleteUser', {
		method: 'DELETE',
		params,
	});
}
