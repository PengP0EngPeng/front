import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/css/global.css'
// const app = createApp(App)
// 导入axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://aerowang.cn:6688/api/private/v1/'
createApp(App).config.globalProperties.$axios = axios
createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
