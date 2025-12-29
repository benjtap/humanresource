import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView,
            meta: { guest: true }
        },
        {
            path: '/shifts',
            name: 'shifts',
            component: () => import('../views/ShiftsView.vue'),
            meta: { requiresAuth: true } // Or false if testing without login
        }
    ]
})

import store from '../store'

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login' })
    } else if (to.meta.guest && isAuthenticated) {
        next({ name: 'shifts' }) // Redirect to dashboard if already logged in
    } else {
        next()
    }
})

export default router
