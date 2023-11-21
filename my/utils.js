export function isObject(obj) {
   return typeof obj === 'object' && obj !== null
}

export const same = (a,b) => Object.is(a,b)

export const weekmap = new WeakMap()
