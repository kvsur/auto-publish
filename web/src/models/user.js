import { fetchUsers, addUser, updateUserInfo, deleteUser } from '../services';

export default {
    namespace: 'users',
    state: {
        users: []
    },
    effects: {
        *fetchUsers (action, { put, call }) {
            const res = yield call(fetchUsers);
            yield put({
                type: 'update',
                payload: {
                    users: res.d,
                }
            });
        },
        *addUser({ payload, cb }, { put, call}) {
            const res = yield call(addUser, { ...payload });
            cb(res);
        },
        *updateUserInfo({ payload, cb }, { put, call}) {
            const res = yield call(updateUserInfo, { ...payload });
            cb(res);
        },
        *deleteUser({ payload, cb }, { put, call}) {
            const res = yield call(deleteUser, { ...payload });
            cb(res);
        }
            
    },
    reducers: {
        update(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            
        },
    },
};