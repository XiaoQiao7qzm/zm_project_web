import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/layout'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import( '../views/users/login')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import( '../views/users/register')
  },
  {
    path: '/layout',
    name: 'layout',
    redirect: '/layout/personnel',
    component: () => import( '../views/layout'),
    children: [
      {
        path: 'personnel',
        name: 'personnel',
        component: () => import( '../views/layout/personnel'),
      },
      {
        path: 'monthly-profit',
        name: 'monthly-profit',
        component: () => import( '../views/layout/monthly-profit'),
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: '/zm_project',
  routes
})

export default router
