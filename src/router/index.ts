import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import KnowledgeView from '../views/KnowledgeView.vue'
import KnowledgeDetailView from '../views/KnowledgeDetailView.vue'
import MenuView from '../views/MenuView.vue'
import ShoppingListView from '../views/ShoppingListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: KnowledgeView,
    },
    {
      path: '/knowledge/:slug',
      name: 'knowledge-detail',
      component: KnowledgeDetailView,
    },
    {
      path: '/menu',
      name: 'menu',
      component: MenuView,
    },
    {
      path: '/shopping-list',
      name: 'shopping-list',
      component: ShoppingListView,
    },
  ],
})

export default router
