import { createStore } from 'vuex'
import api from '../services/api'

export default createStore({
    state: {
        token: localStorage.getItem('token') || '',
        user: null
    },
    getters: {
        isAuthenticated: state => !!state.token,
        currentUser: state => state.user
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            localStorage.setItem('token', token)
            // Update the api header immediately
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        },
        SET_USER(state, user) {
            state.user = user
        },
        LOGOUT(state) {
            state.token = ''
            state.user = null
            localStorage.removeItem('token')
            delete api.defaults.headers.common['Authorization']
        }
    },
    actions: {
        // This action handles the final step of the login process
        saveToken({ commit }, token) {
            commit('SET_TOKEN', token)
        },
        logout({ commit }) {
            commit('LOGOUT')
        }
    }
})
