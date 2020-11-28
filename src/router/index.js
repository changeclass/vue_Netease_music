import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home/discover/personal'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home/home.vue'),
    redirect: '/home/discover/personal',
    children: [
      {
        path: '/home/discover',
        name: 'Discover',
        redirect: '/home/discover/personal',
        component: () => import(/* webpackChunkName: "home" */ '../views/home/discover.vue'),
        // 子路由
        children: [
          {
            path: '/home/discover/personal',
            name: 'Personal',
            component: () => import(/* webpackChunkName: "discover" */ '../views/home/discover/personal.vue')
          },
          {
            path: '/home/discover/sheet',
            name: 'SongSheet',
            component: () => import(/* webpackChunkName: "discover" */ '../views/home/discover/songSheet.vue')
          },
          {
            path: '/home/discover/station',
            name: 'radioStation',
            component: () => import(/* webpackChunkName: "discover" */ '../views/home/discover/radioStation.vue')
          },
          {
            path: '/home/discover/rank',
            name: 'ranKingList',
            component: () => import(/* webpackChunkName: "discover" */ '../views/home/discover/rankingList.vue')
          },
          {
            path: '/home/discover/singer',
            name: 'Singer',
            component: () => import(/* webpackChunkName: "discover" */ '../views/home/discover/singer.vue')
          },
          {
            path: '/home/discover/newmusic',
            name: 'newestMusic',
            component: () => import(/* webpackChunkName: "discover" */ '../views/home/discover/newestMusic.vue')
          }
        ]
      },
      {
        path: '/home/artist',
        name: 'Artist',
        component: () => import(/* webpackChunkName: "home" */ '../views/home/artist.vue')
      },
      {
        path: '/home/list/:id',
        name: 'musicList',
        component: () => import(/* webpackChunkName: "home" */ '../views/home/music.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/user/login.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
