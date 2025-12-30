import axios from 'axios'
import store from '../store'

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://selfapproj.onrender.com' : '/'),
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
    (config) => {
        const token = store.state.token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle 401/403 errors (optional but good practice)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Handle unauthorized access (e.g., logout user)
            store.dispatch('logout')
            // You might want to redirect to login page here
        }
        return Promise.reject(error)
    }
)

export default api
