import { createApp } from 'vue'
// import 'element-plus/es/components/message/style/css'
// import { ElButton, ElInput, ElMessage, ElForm, ElFormItem } from 'element-plus'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import AppComponent from './App.vue'
const app = createApp(AppComponent)

// const ElArr = [ElButton, ElInput, ElMessage, ElForm, ElFormItem]
// ElArr.forEach((item) => app.use(item))
app.use(ElementPlus)
app.mount('#app')
