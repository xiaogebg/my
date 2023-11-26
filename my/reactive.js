import {
    weekmap,
    isObject
} from "./utils.js"
import {
    handler
} from "./handler.js"

export const reactive = (obj) => {
    if (!isObject(obj)) return obj
    if (weekmap.has(obj)) return weekmap.get(obj)
    const proxy = new Proxy(obj, handler)
    weekmap.set(proxy)
    return proxy
}