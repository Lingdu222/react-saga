import { RESPONSE_MAP } from './utils';
const Dirty = {};

// Dirty.getURl = (url) => {
//     const newUrl = url + (url.indexOf('?') === -1 ? '?' : '&');
//     return _.trim(newUrl, '&');
// };
Dirty.getFetchParams = (payload) => {
    const params = payload.params || {};
    // 可在此处增加公共参数

    // 填补ie的坑，只要不是第一次请求都会从缓存里拿数据
    params.v = moment().unix();
    return {
        url: payload.url,
        params
    };
};

Dirty.isSuccessReq = (data) => {
    const name = _.intersection(_.keys(data), _.keys(RESPONSE_MAP))[0];

    return name && data[name] === RESPONSE_MAP[name].succcessCode;
};
Dirty.getMsg = (data) => {
    const name = _.intersection(_.keys(data), _.keys(RESPONSE_MAP))[0];
    const config = RESPONSE_MAP[name];
    if (config && data[config.msgKey]) {
        return data[config.msgKey];
    }
    return '系统错误';
};
export default Dirty;