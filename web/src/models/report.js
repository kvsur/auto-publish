import { report } from '../services';

export default {
    namespace: 'report',
    state: {
        projectReport: [],
        userReport: [],
        brokerMax: 0
    },
    effects: {
        *fetchReport(_, { put, call }) {
            const { d: {userReport, projectReport, brokerMax} } = yield call(report);

            yield put({
                type: 'update',
                payload: {
                    userReport,
                    projectReport,
                    brokerMax
                },
            });
            return Promise.resolve();
        }
    },
    reducers: {
        update(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        }
    }
}