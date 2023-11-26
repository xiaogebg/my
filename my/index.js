import {
    reactive
} from "./reactive.js";
import {
    effect
} from "./effect.js";
// const obj = reactive({
//     a: 1,
//     b: '2',
//     get c() {
//         return this.a + this.b
//     },
//     set c(val) {
//     },
//     d: {
//         name: '123',
//         hobby: {
//             swim: '4'
//         }
//     }
// });
// function a() {
//     // obj.c

// }
// a()
// obj.a = 1
// // for (const iterator in obj) {

// // }
// obj.c = 2
const obj = reactive({
    name: 'cai'
})
// const arr = reactive([1,2,obj]);
// arr.shift(7)
function fn() {
    console.log(obj.name);
    obj.name = obj.name + 1
}
// effect(fn)
// for (const iterator in obj) {
//     iterator
// }
effect(fn)