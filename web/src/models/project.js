import { getProjectConfig, deleteBroker, deleteProject, addBroker, addProject  } from '../services';

export default {
    namespace: 'projects',
    state: {
        projects: []
    },
    effects: {
        *fetchProjects (action, { put, call }) {
            const res = yield call(getProjectConfig);
            yield put({
                type: 'update',
                payload: {
                    projects: res.d
                }
            });
        },
        *addProject({ payload, cb }, { call}) {
            const res = yield call(addProject, { ...payload });
            cb(res);
        },
        *addBroker({ payload, cb }, { call}) {
            const res = yield call(addBroker, { ...payload });
            cb(res);
        },
        *deleteProject({ payload, cb }, { call}) {
            const res = yield call(deleteProject, { ...payload });
            cb(res);
        },
        *deleteBroker({ payload, cb }, { call}) {
            const res = yield call(deleteBroker, { ...payload });
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