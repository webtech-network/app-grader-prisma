import { createRouter, createWebHistory } from 'vue-router'
import ClassesPage from '../views/ClassesPage.vue'
import ActivitiesPage from '../views/ActivitiesPage.vue'
import ProblemPage from '../views/ProblemPage.vue'

const routes = [
  {
    path: '/',
    name: 'classes',
    component: ClassesPage
  },
  {
    path: '/class/:classId/activities',
    name: 'activities',
    component: ActivitiesPage
  },
  {
    path: '/problem/:id',
    name: 'problem',
    component: ProblemPage
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
