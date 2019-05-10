import { login } from '../services';

const user = JSON.parse(window.localStorage.getItem('IDRTOMGP')) || {
    account: '',
    password: '',
    name: '',
    isLogin: true,
    role: '',
};

export default {
    namespace: 'auth',
    state: {
        user,
    },
    effects: {
        *login({ payload, cb }, { put, call }) {
            const res = yield call(login, payload);

            if (res.c === 200) {
                yield put({
                    type: 'update',
                    payload: {
                        user: {
                            ...payload,
                            isLogin: true,
                            ...res.d.user,
                        }
                    }
                });
            }

            cb(res);
        },
    },
    reducers: {
        update(state, { payload }) {
            return {
                state,
                ...payload,
            };
        }
    }
};