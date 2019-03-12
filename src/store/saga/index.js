/* eslint-disable no-console */
import {
    call, put, take, fork, cancel, race
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { message } from 'antd';
import FE from './fetch';
import Dirty from './dirty';
import {
    SAGA_ACTION_PREFIX,
    FRONTEND_ERROR,
    LOADING_ACTION_PREFIX,
    FETCH_SUCCESS_PREFIX,
    FETCH_ERROR_PREFIX,
    FETCH_TIMEOUT_PREFIX,
    getSagaActionName,
    getSagaActionType
} from './utils';

const { getFetchParams, isSuccessReq, getMsg } = Dirty;
function* fetchSaga(fetch, taskArray, action) {
    const name = getSagaActionName(action.type);

    if (
        !action.payload.cache
        || !taskArray[action.type]
        || !_.isEqual(taskArray[action.type].action, action)
    ) {
        try {
            let result = false;
            const task = {};

            if (action.payload.race) { // 延迟队列
                action.payload.race.forEach(
                    (item) => {
                        if (item.delay) {
                            task.delay = call(delay, item.delay * 1000);
                        } else {
                            task[item.url] = call(fetch, getFetchParams(item));
                        }
                    }
                );
                result = yield race(task);
                result = !result.delay && _.values(result)[0];
            } else if (action.payload.con) { // 并行发请求
                result = yield action.payload.con.map(
                    item => call(
                        FE[_.camelCase(item.fetchType)] || fetch,
                        getFetchParams(item)
                    )
                );
            } else if (action.payload.serial) { // 串行发请求
                result = [];
                const { serial } = action.payload;
                for (let i = 0; i < serial.length; i += 1) {
                    if (i === 0 || isSuccessReq(result[i - 1])) {
                        result[i] = yield call(
                            FE[_.camelCase(serial[i].fetchType)] || fetch,
                            getFetchParams(serial[i])
                        );
                        result[i] = yield result[i].json();
                    } else {
                        result[i] = FRONTEND_ERROR.NO_REQUEST;
                    }
                }
            } else {
                result = yield call(fetch, getFetchParams(action.payload));
            }

            if (result) {
                let data;
                if (_.isArray(result)) {
                    if (_.isArray(action.payload.serial)) {
                        data = result;
                    } else {
                        data = yield result.map(item => item.json());
                    }
                } else {
                    data = yield result.json();
                }
                // 成功的action，params也给出去
                if (
                    (_.isArray(data) && _.every(data, item => isSuccessReq(item)))
                    || isSuccessReq(data)
                ) {
                    const payload = { data, filters: {} };
                    if (!_.isArray(data)) {
                        payload.data = data.info || data.data;
                        payload.filters = action.payload.params;
                    } else if (action.payload.con) {
                        payload.filters = action.payload.con.map(i => i.params);
                    } else if (action.payload.serial) {
                        payload.filters = action.payload.serial.map(i => i.params);
                    }
                    yield put({
                        type: `${FETCH_SUCCESS_PREFIX}${name}`,
                        payload
                    });
                    if (action.payload.message) {
                        message.success(action.payload.message);
                    }
                    if (action.payload.success) {
                        const successReturn = _.isFunction(action.payload.success)
                            ? _.toPlainObject(action.payload.success.call(null, payload))
                            : action.payload.success;
                        if (successReturn && successReturn.type) {
                            yield put(successReturn);
                        }
                    }
                } else {
                    yield put({ type: `${FETCH_ERROR_PREFIX}${name}`, payload: data });
                    if (_.isArray(data)) {
                        data.forEach(i => !isSuccessReq(i) && message.error(getMsg(i)));
                    } else {
                        message.error(getMsg(data));
                    }
                    if (action.payload.failure) {
                        yield put(
                            _.isFunction(action.payload.failure)
                                ? _.toPlainObject(action.payload.failure.call(null, data))
                                : action.payload.failure
                        );
                    }
                }
            } else {
                // 请求超时，同样无法阻止该次请求被发出去
                yield put({ type: `${FETCH_TIMEOUT_PREFIX}${name}` });
            }
        } catch (error) {
            // 捕获到异常了
            yield put({ type: `${FETCH_ERROR_PREFIX}${name}`, payload: error });
            message.error('系统错误');
            console.error(error);
            if (action.payload.failure) {
                yield put(
                    _.isFunction(action.payload.failure)
                        ? _.toPlainObject(action.payload.failure.call(null, error))
                        : action.payload.failure
                );
            }
        }
    } else {
        // 缓存模式，reducer里面去判断payload是否为undefined
        yield put({ type: `${FETCH_SUCCESS_PREFIX}${name}` });
        if (action.payload.success) {
            yield put(
                _.isFunction(action.payload.success)
                    ? _.toPlainObject(action.payload.success.call(null, action.payload))
                    : action.payload.success
            );
        }
    }
    // 该次fetch的loading结束
    yield put({ type: `${LOADING_ACTION_PREFIX}${name}`, payload: false });

    // 如果任务列表空了，那么全部loading结束
    if (_.isEmpty(_.compact(_.map(
        taskArray,
        (i, k) => k.split('_').slice(2).join('_') !== name && i.task.isRunning()
    )))) {
        yield put({ type: '_ADING', payload: false });
    }
}
function* watchSaga() {
    // 当前任务加进列表
    const taskArray = {};

    // 监听开始，必须保证每次fetch发起后都要走到这里来
    while (true) {
        // 只监听actionType带有REQUEST的
        const action = yield take(
            i => !_.isEmpty(i.type.match(SAGA_ACTION_PREFIX))
        );
        // fetch类型
        const type = getSagaActionType(action.type);
        // fetch名称
        const name = getSagaActionName(action.type);

        if (type && name && action.payload) {
            // 如果任务列表空了，那么此次fetch会带来大的loading，用于小黄条
            if (_.isEmpty(_.compact(_.map(taskArray, i => i.task.isRunning())))) {
                yield put({ type: '_ADING', payload: true });
                // window.Loading.show()
            }

            // 此次fetch的小loading，如果相同的fetchTask没有结束，那么不再重复发起该action
            if (
                (taskArray[action.type] && !taskArray[action.type].task.isRunning())
                || !taskArray[action.type]
            ) {
                yield put({ type: `${LOADING_ACTION_PREFIX}${name}`, payload: true });
            }

            // 无条件cancel同样的task，重新开始，解决请求竞争问题，但是无法阻止请求被发出去（废话）
            yield taskArray[action.type] && cancel(taskArray[action.type].task);

            const task = yield fork(fetchSaga, FE[_.camelCase(type) || 'get'], taskArray, action);

            // 当前任务加进列表
            taskArray[action.type] = { task, action };
        }
    }
}

const rootSaga = otherSaga => function* generator() {
    // 给出接入其他的saga的接口
    yield otherSaga ? [call(watchSaga), call(otherSaga)] : call(watchSaga);
};
export default rootSaga;
