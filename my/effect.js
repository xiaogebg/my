import {
    TrackOpTypes,TriggerOpTypes
} from "./operations.js";
let shouldTrack = true
export function resetTrigger() {
    shouldTrack = true
}
export function unTrigger() {
    shouldTrack = false
}
let activeEffect = null
const targetMap = new WeakMap()
const ITERATE_KEY = Symbol('iterate')
export function track(target, type, key) {
    if (!shouldTrack || !activeEffect) return
    let propMap = targetMap.get(target)
    if (!propMap) {
        propMap = new Map()
        targetMap.set(target, propMap)
    }
    if (type === TrackOpTypes.ITERATE) {
        key = ITERATE_KEY
    }
    let typeMap = propMap.get(key)
    if (!typeMap) {
        typeMap = new Map()
        propMap.set(key, typeMap)
    }
    let depSet = typeMap.get(type)
    if (!depSet) {
        depSet = new Set()
        typeMap.set(type,depSet)
    }
    depSet.add(activeEffect)
    if (type === TrackOpTypes.ITERATE) console.log(`${type}`);
    else console.log(`${type}`, key);
}
export function effect(fn) {
    const effectFn = function () {
        activeEffect = effectFn
        fn()
        activeEffect = null
    }
    effectFn()
}
export function trigger(target, type, key) {
    const fns = getEffectFns(target,type,key)
    for (const fn of fns) {
        if (fn === activeEffect) continue
        fn()
    }
}

const triggerMap = {
    [TriggerOpTypes.SET] : [TrackOpTypes.GET],
    [TriggerOpTypes.ADD] : [TrackOpTypes.GET,TrackOpTypes.HAS,TrackOpTypes.ITERATE],
    [TriggerOpTypes.DELETE] : [TrackOpTypes.GET,TrackOpTypes.HAS,TrackOpTypes.ITERATE]
}
function getEffectFns(target, type, key) {
    const fns = new Set()
    const keys = [key] 
    if (type === TriggerOpTypes.ADD || type === TriggerOpTypes.DELETE) keys.push(ITERATE_KEY)
    const propMap = targetMap.get(target)
    if (!propMap) return fns
    for (const key of keys) {
        const typeMap = propMap.get(key)
        if (typeMap) {
            const trackTypes = triggerMap[type]
            for (const track of trackTypes) {
                const deps = typeMap.get(track)
                if (deps) {
                    for (const fn of deps) {
                        fns.add(fn)
                    }
                }
            }
        }
    }
    return fns
}