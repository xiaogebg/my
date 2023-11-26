import { isObject,same } from "./utils.js"
import { reactive } from "./reactive.js";
import { track,unTrigger,resetTrigger,trigger } from "./effect.js";
import { TrackOpTypes,TriggerOpTypes } from "./operations.js";

const KEY = Symbol('has')
const arrayIns = {};
['indexOf','includes','lastIndexOf'].forEach(key => {
    arrayIns[key] = function(...args) {
        const result = Array.prototype[key].apply(this,args)
        if (result < 0 || result === false) return Array.prototype[key].apply(this[KEY],args)
        return result
    }
});
['push','pop','shift','unshift','splice'].forEach(key => {
    arrayIns[key] = function(...args) {
        unTrigger()
        const result = Array.prototype[key].apply(this,args)
        resetTrigger()
        return result
    }
})
function get(target, key, receiver) {
    if (key === KEY) return target
    track(target, TrackOpTypes.GET, key)
    if (arrayIns.hasOwnProperty(key) && Array.isArray(target))  {
        return arrayIns[key]
    }
    const val = Reflect.get(target, key, receiver)
    if (!isObject(val)) return val
    return reactive(val)
}
function set(target, key, val, receiver) {
    const type = target.hasOwnProperty(key) ? TriggerOpTypes.SET : TriggerOpTypes.ADD
    const oldVal = target[key]
    const oldLen = Array.isArray(target) ?  target.length :undefined
    const result = Reflect.set(target, key, val, receiver)
    const newLen = Array.isArray(target) ?  target.length :undefined
    if (result && !same(oldVal,val)) {
        trigger(target,type,key)
        if (key !== 'length' && oldLen !== newLen && Array.isArray(target)) track(target,TriggerOpTypes.SET,'length')
        if (key === 'length' && oldLen > newLen ) {
            for (let i = newLen; i <= oldLen;i++) {
                track(target,TriggerOpTypes.DELETE,i.toString())
            }
        }
    }
    return result
}
function has(target, key) {
    track(target, key, TrackOpTypes.HAS)
    return Reflect.has(target,key)
}
function deleteProperty(target, key) {
    const hadKey = target.hasOwnProperty(key)
    const result = Reflect.deleteProperty(target, key)
    if (result && hadKey) trigger(target, TriggerOpTypes.DELETE, key)
    return result
}

function ownKeys(target) {
    track(target, TrackOpTypes.ITERATE)
    return Reflect.ownKeys(target)
}
export const handler = {
   get,
   set,
   has,
   deleteProperty,
   ownKeys
}
