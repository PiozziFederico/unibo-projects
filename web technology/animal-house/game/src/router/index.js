import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/new-animal',
    name: 'new-animal',
    component: () => import('../views/NewAnimal.vue')
  },
  {
    path: '/my-animals',
    name: 'my-animals',
    component: () => import('../views/MyAnimals.vue')
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('../views/games/QuizView.vue')
  },
  {
    path: '/memory',
    name: 'memory',
    component: () => import('../views/games/MemoryView.vue')
  },
  {
    path: '/impiccato',
    name: 'impiccato',
    component: () => import('../views/games/ImpiccatoView.vue')
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('../views/VideoView.vue')
  },
  {
    path: '/curiosity',
    name: 'curiosity',
    component: () => import('../views/CuriosityView.vue')
  },
]

const router = new VueRouter({
  //mode: 'history',
  base: 'game',
  routes
})

router.afterEach((to, from) => {
  Vue.nextTick( () => {
    document.title = 'Game';
  });
})

export default router
