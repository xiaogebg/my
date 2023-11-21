import { reactive } from "./reactive.js";
const obj = reactive({
    a: 1,
    b: '2',
    get c() {
        return this.a + this.b
    },
    d: {
        name: '123',
        hobby: {
            swim: '4'
        }
    }
});
function a() {
    // obj.c
    obj.cc
}
a()
obj.a = 1
for (const iterator in obj) {
    
}
obj.y = 4
