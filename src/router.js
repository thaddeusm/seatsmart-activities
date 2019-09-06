import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Code from './views/Code.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
          path: '/',
          name: 'home',
          component: Home,
          props: (route) => ({
              room: route.query.room
          })
        },
        {
          path: '/activity',
          name: 'activity',
          // route level code-splitting
          // this generates a separate chunk (activity.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "activity" */ './views/Activity.vue')
        },
        {
          path: '/code',
          name: 'code',
          component: Code
        },
        {
          path: '/end',
          name: 'end',
          // route level code-splitting
          // this generates a separate chunk (end.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "end" */ './views/End.vue')
        },
        {
          path: '/cancel',
          name: 'cancel',
          // route level code-splitting
          // this generates a separate chunk (cancel.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "cancel" */ './views/Cancel.vue')
        },
        {
          path: '/error',
          name: 'error',
          // route level code-splitting
          // this generates a separate chunk (error.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "error" */ './views/Error.vue')
        }
    ]
})
