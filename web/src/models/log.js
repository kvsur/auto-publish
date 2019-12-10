import { fetchLogs } from '../services';

export default {
    namespace: 'logs',
    state: {
        logs: [],
    },
    effects: {
        *fetchLogs ({ payload }, { put, call }) {
            const res = yield call(fetchLogs, { ...payload });
            const logs = res.c === 200 && res.d || [];

            logs.forEach(log => {
                log.key = log.deployTime;
            });

            yield put({
                type: 'update',
                payload: {
                    logs
                },
            });

            return Promise.resolve(res.t || 0);
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