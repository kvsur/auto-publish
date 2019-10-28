import { fetchLogs } from '../services';

export default {
    namespace: 'logs',
    state: {
        logs: [],
    },
    effects: {
        *fetchLogs ({ payload }, { put, call }) {
            const date = (payload && payload.date) || '';
            const res = yield call(fetchLogs, { date });
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