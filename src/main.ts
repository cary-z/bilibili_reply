import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './popup/main.css'

import AppComponent from './popup/App.vue'
const app = createApp(AppComponent)
app.use(ElementPlus)
app.mount('#insetApp')
