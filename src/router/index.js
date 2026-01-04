import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // History mode
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
        },
        {
            path: '/summary',
            name: 'summary',
            component: () => import('../views/SummaryView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/weekly-plan',
            name: 'weekly-plan',
            component: () => import('../views/WeeklyPlanView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/weekly-schedules',
            name: 'weekly-schedules',
            component: () => import('../views/WeeklySchedulesListView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/shift-types',
            name: 'shift-types',
            component: () => import('../views/ShiftTypesView.vue'),
            meta: { requiresAuth: true }
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
