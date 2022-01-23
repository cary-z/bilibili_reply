const flag = window.location.pathname.includes('video')
if (flag) {
  const bvid = window.location.pathname.replace('/video/', '')
  console.log(bvid)
}
const div = document.createElement('div')
div.id = 'testapp'
div.style.width = '600px'
div.style.position = 'fixed'
div.style.right = '0'
div.style.top = '0'
div.style.height = '100vh'
document.body.append(div)
console.log('testapp')

// const script = document.createElement('script')
// script.type = 'module'
// script.src = '/main.js'
// document.body.append(script)

import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './popup/main.css'

import AppComponent from './popup/App.vue'
const app = createApp(AppComponent)
// const ElArr = [ElButton, ElInput, ElMessage, ElForm, ElFormItem]
// ElArr.forEach((item) => app.use(item))
app.use(ElementPlus)
app.mount('#testapp')
