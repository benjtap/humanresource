import axios from 'axios'

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Export a setup function to inject store and configure interceptors
export const setupInterceptors = (store) => {
    // Request interceptor
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

    // Response interceptor
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                store.dispatch('logout')
            }
            return Promise.reject(error)
        }
    )
}

export default api
