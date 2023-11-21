import { TrackOpTypes } from "./operations.js";

export function track(target, type, key) {
    if (type === TrackOpTypes.ITERATE) console.log(`${type}`);
    else console.log(`${type}-${key}`);
}
