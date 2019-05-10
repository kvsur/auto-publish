import { fetchDocs, fetchDoc, newDoc, deleteDoc } from '../services';
// import { routerRedux } from 'dva/router';
export default {
    namespace: 'doc',
    state: {
        docs: [],
        defaultSelectedKeys: [],
        currentDetailDoc: {
            docName: '',
            docKey: '',
            createTime: '',
            author: '',
            lastUpdateTime: '',
            content: '',
        }
    },
    effects: {
        *delDoc({ payload, cb }, { put, call}) {
            const res = yield call(deleteDoc, { ...payload });
            cb(res);
        },
        *newDoc({ payload, cb }, { put, call }) {
            const res = yield call(newDoc, { ...payload });
            yield put({
                type: 'fetchDocs',
            });
            cb(res);
            // routerRedux.push('//');
        },
        *fetchDocs(action, { put, call }) {
            const res = yield call(fetchDocs);
            const docs = res.d;
            if (docs) {
                const defaultSelectedKeys = docs[0] && [docs[0].docKey] || [];
                yield put({
                    'type': 'update',
                    payload: {
                        docs,
                        defaultSelectedKeys,
                        currentDetailDoc: {
                            ...docs[0],
                            content: '',
                        },
                    },
                });
                yield put({
                    type: 'fetchDoc',
                    payload: {
                        docKey: defaultSelectedKeys[0]
                    },
                });
            }
        },
        *fetchDoc({ payload }, { put, call, select }) {
            const res = yield call(fetchDoc, payload);

            let currentDetailDoc = yield select(state => {
                return state.doc.currentDetailDoc;
            });
            currentDetailDoc = {
                ...currentDetailDoc,
                content: res.d,
            };
            yield put({
                type: 'update',
                payload: {
                    currentDetailDoc,
                },
            });
        },
    },
    reducers: {
        update(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        }
    },
}
