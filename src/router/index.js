import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/Users.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  //to 表示将要访问的路径 ， from表示从哪个路径跳转而来 next是一个函数表示放行
  // next() 放行 next('强制跳转的路径') 强制跳转
  if (to.path === '/login') return next()
  // 除此之外都要token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
