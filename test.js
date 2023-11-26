import {reactive,ref,unref} from 'vue'
const obj = {name:'cai'}
const arr = ref([1,2,obj]);
console.log(JSON.stringify(arr[2]) === JSON.stringify(obj));