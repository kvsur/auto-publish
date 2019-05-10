import { getProjectConfig, getSVNversions, deploy } from '../services';

const pagePer = 20;

export default {
    namespace: 'deploy',
    state: {
        projectConfig: [],
        totalCounts: 1,
        versions: [],
        pagePer,
    },
    effects: {
        *deploy({ payload, cb }, { put, call }) {
            const res = yield call(deploy, { ...payload });
            cb(res);
        },
        *getConfig(action, { put, call }) {
            const res = yield call(getProjectConfig);
            const projectConfig = res.c === 200 && res.d || [];

            yield put({
                type: 'update',
                payload: {
                    projectConfig,
                }
            });
        },
        *getSVNversions({ payload }, { put, call, select }) {
            let totalCounts = select(state => {
                const deploy = state.deploy;
                return deploy.totalCounts;
            });
            const res = yield call(getSVNversions, {...payload, pagePer});
            const versions = res.c === 200 && res.d.versions || [];

            totalCounts = res.c === 200 && res.d.totalCounts || totalCounts;

            yield put({
                type: 'update',
                payload: {
                    versions,
                    totalCounts,
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
        }
    }
}