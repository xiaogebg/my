import { TrackOpTypes } from "./operations.js";
let trigger = true
export function resetTriggrt() {
    trigger = true
}
export function unTriggrt() {
    trigger = false
}
export function track(target, type, key) {
   if (trigger) {
    if (type === TrackOpTypes.ITERATE) console.log(`${type}`);
    else console.log(`${type}`,key);
   }
}
