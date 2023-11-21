import { isObject,same } from "./utils.js"
import { reactive } from "./reactive.js";
import { track } from "./track.js";
import { TrackOpTypes,TriggerOpTypes } from "./operations.js";

export const handler = {
    get(target, key, receiver) {
        const hadKey = target.hasOwnProperty(key)
        if (hadKey) track(target, TrackOpTypes.GET, key)
        const val = Reflect.get(target, key, receiver)
        if (!isObject(val)) return val
        return reactive(val)
    },
    set(target, key, val, receiver) {
        const type = target.hasOwnProperty(key) ? TriggerOpTypes.SET : TriggerOpTypes.ADD
        const oldVal = target[key]
        const result = Reflect.set(target, key, val, receiver)
        if (result && !same(oldVal,val)) track(target,type,key)
        return result
    },
    has(target, key) {
        track(target, key, TrackOpTypes.HAS)
        return Reflect.has(target,key)
    },
    deleteProperty(target, key) {
        const hadKey = target.hasOwnProperty(key)
        const result = Reflect.deleteProperty(target, key)
        if (result && hadKey) track(target, TriggerOpTypes.DELETE, key)
        return result
    },
    ownKeys(target) {
        track(target, TrackOpTypes.ITERATE)
        return Reflect.ownKeys(target)
    }
}
