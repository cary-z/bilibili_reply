export function wrapState(action:string) {
  // 获取原始定义
  let raw = history[action]
  return function (this:unknown) {
      // 经过包装的pushState或replaceState
      let wrapper = raw.apply(this, arguments)

      // 定义名为action的事件
      let e = new Event(action)

      // 将调用pushState或replaceState时的参数作为stateInfo属性放到事件参数event上
      e['stateInfo'] = {...arguments}
      // 调用pushState或replaceState时触发该事件
      window.dispatchEvent(e)
      return wrapper
  }
}

//修改原始定义
history.pushState = wrapState("pushState");
history.replaceState = wrapState("replaceState");

import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './popup/main.css'

import AppComponent from './popup/App.vue'
const app = createApp(AppComponent)
app.use(ElementPlus)
app.mount('#insetApp')
