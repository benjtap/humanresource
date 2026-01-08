import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style.css' // Import global styles if available, or create them

const app = createApp(App)

app.use(store)
app.use(router)

// Initialize data if user is logged in
if (store.state.token) {
    store.dispatch('fetchInitialData')
}

app.mount('#app')
