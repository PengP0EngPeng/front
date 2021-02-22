import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/css/global.css'

// 导入axios
import Axios from './axios/index.js'
// 配置请求根路径
const app = createApp(App)
app.config.globalProperties.$axios = Axios
app.use(store).use(router).use(ElementPlus).mount('#app')
