import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style.css' // Import global styles if available, or create them

const app = createApp(App)

app.use(store)
app.use(router)

// CRITICAL: Restore token from localStorage if vuex-persistedstate didn't sync it yet
// This handles the migration from manual storage to persisted state
const rawToken = localStorage.getItem('token')
if (rawToken && !store.state.token) {
    console.log('Restoring token from localStorage (migration fix)')
    store.commit('SET_TOKEN', rawToken)
}

// Initialize data if user is logged in
if (store.state.token) {
    store.dispatch('fetchInitialData')
}

app.mount('#app')
