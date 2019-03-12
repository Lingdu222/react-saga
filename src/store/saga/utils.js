import {
    put, take, fork, cancel, call
} from 'redux-saga/effects';
import { delay } from 'redux-saga';

// 只监听actionType带有REQUEST的
export const SAGA_ACTION_PREFIX = 'REQUEST_';
export const LOADING_ACTION_PREFIX = '_ADING_';
export const FETCH_SUCCESS_PREFIX = 'SUCCESS_RCV_';
export const FETCH_ERROR_PREFIX = 'ERROR_RCV_';
export const FETCH_TIMEOUT_PREFIX = 'ERROR_TIMEOUT_';
export const POLLING_START_PREFIX = 'POLLING_START_';
export const POLLING_END_PREFIX = 'POLLING_END_';

export const FETCH_TYPE = {
    GET: 'GET',
    POST: 'POST',
    POSTFORM: 'POSTFORM',
    POSTJSON: 'POSTJSON',
    POSTFILE: 'POSTFILE',
    PUT: 'PUT',
    DELETE: 'DELETE'
};
// 前端报错，errno都大于0
export const FRONTEND_ERROR = {
    NO_REQUEST: {
        errno: '1',
        errmsg: '',
        remark: 'No request occurred'
    }
};

// 响应状态码字段map
export const RESPONSE_MAP = {
    errno: {
        succcessCode: 0,
        msgKey: 'errmsg'
    },
    errcode: {
        succcessCode: 0,
        msgKey: 'errmsg'
    }
};

// 生成saga的action类型字符串
export const generateSagaAction = (
    fetchType = FETCH_TYPE.GET,
    name
) => `${SAGA_ACTION_PREFIX}${fetchType}_${name}`;

export const getSagaActionName = actionType => actionType
    && actionType.split('_').slice(2).join('_');

export const getSagaActionType = actionType => actionType && actionType.split('_')[1];

// 轮询器
function* pollingSaga(fetchAction) {
    const { defaultInterval, mockInterval } = fetchAction;

    while (true) {
        try {
            const result = yield put(fetchAction.detailAction);
            const interval = mockInterval || result.interval;

            yield call(delay, interval * 1000);
        } catch (e) {
            yield call(delay, defaultInterval * 1000);
        }
    }
}

export function* beginPolling(pollingAction) {
    const {
        defaultInterval = 5, mockInterval, detailAction, id
    } = pollingAction;

    if (!detailAction.type) {
        throw Error('pollingAction type is null');
    }

    const fetchAction = {
        detailAction,
        mockInterval,
        defaultInterval
    };

    const pollingTaskId = yield fork(pollingSaga, fetchAction);
    const pattern = action => action.type === `${POLLING_END_PREFIX}${id}` || action.stopPolling;
    // 轮询不具备自己的id，这是很无奈、很悲惨的事情，所以如果使用stopPolling，即只允许一个轮询器存在
    yield take(pattern);
    yield cancel(pollingTaskId);
}