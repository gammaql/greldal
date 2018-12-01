"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const lodash_2 = require("lodash");
const lodash_3 = require("lodash");
exports.isntString = (str) => !lodash_2.isString(str);
exports.indexBy = (arr, path) => {
    const prop = lodash_3.property(path);
    return arr.reduce((result, item) => {
        result[prop(item)] = item;
        return result;
    }, {});
};
function interceptThrough(val, interceptor) {
    if (lodash_2.isNil(interceptor))
        return val;
    const intercepted = interceptor(val);
    if (lodash_2.isNil(intercepted))
        return val;
    return intercepted;
}
exports.interceptThrough = interceptThrough;
exports.uid = (label) => lodash_1.uniqueId(`GQL_DAL_${label}__`);
function MemoizeGetter(target, propertyKey, descriptor) {
    const { get } = descriptor;
    if (!get) {
        throw new Error("MemoizeGetter can only be applied to a getter");
    }
    descriptor.get = function () {
        const value = get.apply(this);
        Object.defineProperty(this, propertyKey, { value });
        return value;
    };
}
exports.MemoizeGetter = MemoizeGetter;
//# sourceMappingURL=utils.js.map