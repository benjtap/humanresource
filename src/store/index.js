import { createStore } from 'vuex'
import api from '../services/api'
import createPersistedState from 'vuex-persistedstate'
import { mockShiftTypes } from '../services/mockShiftTypes'
import { mockPaymentTypes } from '../services/mockPaymentTypes'
import { mockSickTypes } from '../services/mockSickTypes'
import { mockWeeklyPlans } from '../services/mockWeeklyPlans'
import { mockShifts } from '../services/mockShifts'
import shiftService from '../services/shiftService'

import weeklyPlanService from '../services/weeklyPlanService'
import shiftTypeService from '../services/shiftTypeService'
import settingsService from '../services/settingsService'
import additionDeductionService from '../services/additionDeductionService'
import systemDataService from '../services/systemDataService'

export default createStore({
    state: {
        // Auth
        token: localStorage.getItem('token') || '',
        user: null,

        // Data (Offline-first)
        shifts: [],
        pendingSync: [],
        lastSync: null,

        isSyncing: false,
        isMockMode: false,

        // Metadata (Persistent)
        shiftTypes: [],
        paymentTypes: [],
        sickTypes: [],
        weeklyPlans: [],
        additionsDeductions: [],

        // Settings (Persistent)
        settings: {
            salaryStartDay: 1, // Default 1st of month
            hourlyWage: 50.0
        },
        taxSettings: {
            creditPoints: 2.25,
            pointValue: 242,
            isIncomeTaxExempt: false,
            isNationalInsuranceExempt: false,
            isHealthTaxExempt: false,
            isShiftTaxCredit: false,
            studyFund: 0,
            isStudyFundFixed182: false,
            pensionFund: 6, // Updated from payslip analysis
            isPensionFundFixed182: false
        }
    },
    getters: {
        isAuthenticated: state => !!state.token,
        currentUser: state => state.user,
        allShifts: state => state.shifts,
        syncStatus: state => state.isSyncing,

        allShiftTypes: state => state.shiftTypes,
        allPaymentTypes: state => state.paymentTypes,
        allSickTypes: state => state.sickTypes,

        allWeeklyPlans: state => state.weeklyPlans,
        allAdditionsDeductions: state => state.additionsDeductions,

        // Settings Getters
        salaryStartDay: state => state.settings?.salaryStartDay || 1,
        hourlyWage: state => state.settings?.hourlyWage || 50.0,

        // Tax Getters
        taxSettings: state => state.taxSettings || {},
        taxCreditPoints: state => state.taxSettings?.creditPoints || 2.25,
        taxPointValue: state => state.taxSettings?.pointValue || 242,
        taxIsIncomeTaxExempt: state => state.taxSettings?.isIncomeTaxExempt || false,
        taxIsNationalInsuranceExempt: state => state.taxSettings?.isNationalInsuranceExempt || false,
        taxIsHealthTaxExempt: state => state.taxSettings?.isHealthTaxExempt || false,
        taxIsShiftTaxCredit: state => state.taxSettings?.isShiftTaxCredit || false,
        taxStudyFund: state => state.taxSettings?.studyFund || 0,
        taxIsStudyFundFixed182: state => state.taxSettings?.isStudyFundFixed182 || false,
        taxPensionFund: state => state.taxSettings?.pensionFund || 5, // Default 5?

        taxIsPensionFundFixed182: state => state.taxSettings?.isPensionFundFixed182 || false,

        isMockMode: state => state.isMockMode
    },
    mutations: {
        // Auth Mutations
        SET_TOKEN(state, token) {
            state.token = token
            localStorage.setItem('token', token)
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
            // Optional: Clear data on logout? 
            // state.shifts = []
        },

        // Data Mutations
        SET_SHIFTS(state, shifts) { state.shifts = shifts },
        ADD_SHIFT(state, shift) {
            state.shifts.push(shift)
            state.pendingSync.push({ type: 'add', item: shift })
        },
        UPDATE_SHIFT(state, { id, shift }) {
            const index = state.shifts.findIndex(s => s.id === id)
            if (index !== -1) state.shifts[index] = shift
            state.pendingSync.push({ type: 'update', id, item: shift })
        },
        DELETE_SHIFT(state, id) {
            state.shifts = state.shifts.filter(s => s.id !== id)
            state.pendingSync.push({ type: 'delete', id })
        },
        CLEAR_PENDING(state) { state.pendingSync = [] },
        SET_LAST_SYNC(state, timestamp) { state.lastSync = timestamp },

        SET_SYNCING(state, syncing) { state.isSyncing = syncing },
        TOGGLE_MOCK_MODE(state) { state.isMockMode = !state.isMockMode },
        SET_MOCK_MODE(state, value) { state.isMockMode = value },

        // Metadata Mutations
        // Combining duplicated logic from original file into single blocks where possible, 
        // prioritizing the second/"shadowing" block seen in the original file.

        SET_SHIFT_TYPES(state, types) { state.shiftTypes = types },

        ADD_SHIFT_TYPE(state, type) { state.shiftTypes.push(type) },

        UPDATE_SHIFT_TYPE(state, type) {
            const idx = state.shiftTypes.findIndex(t => t.id === type.id || t.numericId === type.numericId);
            if (idx !== -1) {
                state.shiftTypes.splice(idx, 1, type);
            }
        },

        DELETE_SHIFT_TYPE(state, id) {
            state.shiftTypes = state.shiftTypes.filter(t => t.id !== id)
        },

        // Weekly Plans Mutations
        SET_WEEKLY_PLANS(state, plans) { state.weeklyPlans = plans },
        ADD_WEEKLY_PLAN(state, plan) { state.weeklyPlans.push(plan) },
        DELETE_WEEKLY_PLAN(state, id) { state.weeklyPlans = state.weeklyPlans.filter(p => p.id !== id) },
        UPDATE_WEEKLY_PLAN(state, plan) {
            const idx = state.weeklyPlans.findIndex(p => p.id === plan.id)
            if (idx !== -1) state.weeklyPlans.splice(idx, 1, plan)
        },

        // Additions/Deductions
        ADD_ADDITION_DEDUCTION(state, item) { state.additionsDeductions.push(item) },
        DELETE_ADDITION_DEDUCTION(state, id) { state.additionsDeductions = state.additionsDeductions.filter(item => item.id !== id) },
        UPDATE_ADDITION_DEDUCTION(state, item) {
            const idx = state.additionsDeductions.findIndex(i => i.id === item.id);
            if (idx !== -1) state.additionsDeductions.splice(idx, 1, item);
        },

        // Settings Mutations
        SET_SALARY_START_DAY(state, day) {
            if (!state.settings) state.settings = {}
            state.settings.salaryStartDay = day
        },
        SET_HOURLY_WAGE(state, wage) {
            if (!state.settings) state.settings = {}
            state.settings.hourlyWage = wage
        },

        // Tax Mutations
        SET_TAX_SETTING(state, { key, value }) {
            if (!state.taxSettings) state.taxSettings = {};
            state.taxSettings[key] = value;
        },
        SET_TAX_SETTINGS_BULK(state, settings) {
            state.taxSettings = { ...state.taxSettings, ...settings }
        },

        SET_PAYMENT_TYPES(state, types) { state.paymentTypes = types },
        SET_SICK_TYPES(state, types) { state.sickTypes = types },
        SET_ADDITIONS_DEDUCTIONS(state, items) { state.additionsDeductions = items },
        SET_TAX_CREDIT_POINTS(state, points) {
            if (!state.taxSettings) state.taxSettings = {}
            state.taxSettings.creditPoints = points
        },
        SET_TAX_POINT_VALUE(state, value) {
            if (!state.taxSettings) state.taxSettings = {}
            state.taxSettings.pointValue = value
        }
    },
    actions: {
        // Auth Actions
        saveToken({ commit, dispatch }, token) {
            commit('SET_TOKEN', token)
            dispatch('fetchInitialData')
        },
        logout({ commit }) {
            commit('LOGOUT')
        },

        // Data Actions
        async fetchInitialData({ dispatch }) {
            try {
                await Promise.all([
                    dispatch('fetchShifts'),
                    dispatch('fetchWeeklyPlans'),
                    dispatch('fetchShiftTypes'),
                    dispatch('fetchSettings'),
                    dispatch('fetchAdditionsDeductions'),
                    dispatch('fetchSystemData')
                ])
                console.log('Initial data fetched successfully')
            } catch (error) {
                console.error('Error fetching initial data:', error)
            }
        },

        async fetchShifts({ commit, state }) {
            if (state.isMockMode) {
                commit('SET_SHIFTS', mockShifts)
                commit('SET_LAST_SYNC', Date.now())
                return
            }
            try {
                const response = await shiftService.getShifts()
                if (response.data) {
                    const normalized = response.data.map(s => {
                        const d = new Date(s.date);
                        return {
                            ...s,
                            dayNumber: d.getDate().toString().padStart(2, '0'),
                            fullDate: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
                        };
                    });
                    commit('SET_SHIFTS', normalized)
                    commit('SET_LAST_SYNC', Date.now())
                }
            } catch (error) {
                console.error('Failed to fetch shifts:', error)
                throw error
            }
        },

        async fetchWeeklyPlans({ commit, state }) {
            if (state.isMockMode) {
                commit('SET_WEEKLY_PLANS', [])
                return
            }
            try {
                const response = await weeklyPlanService.getWeeklyPlans()
                if (response.data) {
                    commit('SET_WEEKLY_PLANS', response.data)
                }
            } catch (error) {
                console.error('Failed to fetch weekly plans:', error)
            }
        },

        async addShift({ commit, state }, shift) {
            commit('ADD_SHIFT', shift)
            if (!state.isMockMode) {
                try {
                    await shiftService.createShift(shift)
                } catch (e) {
                    console.error('Failed to create shift API', e);
                }
            }
        },

        async updateShift({ commit, state }, { id, shift }) {
            commit('UPDATE_SHIFT', { id, shift })
            if (!state.isMockMode) {
                try {
                    await shiftService.updateShift(id, shift)
                } catch (e) {
                    console.error('Failed to update shift API', e);
                }
            }
        },

        async deleteShift({ commit, state }, id) {
            commit('DELETE_SHIFT', id)
            if (!state.isMockMode) {
                try {
                    await shiftService.deleteShift(id)
                } catch (e) {
                    console.error('Failed to delete shift API', e);
                }
            }
        },

        // Helper to handle CRUD based on Mode
        async sync({ commit, state, dispatch }) {
            if (state.isMockMode || state.isSyncing || !state.token) return
            commit('SET_SYNCING', true)
            try {
                if (state.pendingSync.length > 0) {
                    await dispatch('pushPending')
                }
                await dispatch('fetchShifts')
            } catch (error) {
                console.error('Sync failed:', error)
            } finally {
                commit('SET_SYNCING', false)
            }
        },

        async pushPending({ state, commit }) {
            if (state.isMockMode) return
            const pending = [...state.pendingSync]

            for (const op of pending) {
                try {
                    if (op.type === 'add') {
                        await shiftService.createShift(op.item)
                    } else if (op.type === 'update') {
                        await shiftService.updateShift(op.id, op.item)
                    } else if (op.type === 'delete') {
                        await shiftService.deleteShift(op.id)
                    }
                } catch (error) {
                    console.error(`Failed to sync ${op.type}:`, error)
                }
            }
            commit('CLEAR_PENDING')
        },

        // Metadata Actions
        async fetchShiftTypes({ commit, state }) {
            if (state.isMockMode) {
                commit('SET_SHIFT_TYPES', mockShiftTypes)
                return
            }
            try {
                const response = await shiftTypeService.getShiftTypes()
                if (response.data) commit('SET_SHIFT_TYPES', response.data)
            } catch (e) { console.error(e) }
        },
        async addShiftType({ commit, state }, type) {
            commit('ADD_SHIFT_TYPE', type)
            if (!state.isMockMode) await shiftTypeService.createShiftType(type)
        },
        async updateShiftType({ commit, state }, type) {
            if (!state.isMockMode) {
                try {
                    const res = await shiftTypeService.updateShiftType(type.id, type)
                    if (res.data) {
                        commit('UPDATE_SHIFT_TYPE', res.data)
                    }
                } catch (e) {
                    console.error(e)
                }
            } else {
                commit('UPDATE_SHIFT_TYPE', type)
            }
        },
        async deleteShiftType({ commit, state }, id) {
            commit('DELETE_SHIFT_TYPE', id)
            if (!state.isMockMode) await shiftTypeService.deleteShiftType(id)
        },

        // Weekly Plans Actions
        async addWeeklyPlan({ commit, state }, plan) {
            commit('ADD_WEEKLY_PLAN', plan)
            if (!state.isMockMode) await weeklyPlanService.createWeeklyPlan(plan)
        },
        async deleteWeeklyPlan({ commit, state }, id) {
            commit('DELETE_WEEKLY_PLAN', id)
            if (!state.isMockMode) await weeklyPlanService.deleteWeeklyPlan(id)
        },
        async updateWeeklyPlan({ commit, state }, plan) {
            commit('UPDATE_WEEKLY_PLAN', plan)
            if (!state.isMockMode) await weeklyPlanService.updateWeeklyPlan(plan.id, plan)
        },

        // Additions/Deductions
        async fetchAdditionsDeductions({ commit, state }) {
            if (state.isMockMode) {
                return
            }
            try {
                const res = await additionDeductionService.getAll()
                if (res.data) commit('SET_ADDITIONS_DEDUCTIONS', res.data)
            } catch (e) { console.error(e) }
        },
        async fetchSystemData({ commit, state }) {
            if (state.isMockMode) {
                commit('SET_PAYMENT_TYPES', mockPaymentTypes)
                commit('SET_SICK_TYPES', mockSickTypes)
                return
            }
            try {
                const [payRes, sickRes] = await Promise.all([
                    systemDataService.getPaymentTypes(),
                    systemDataService.getSickTypes()
                ])
                if (payRes.data) commit('SET_PAYMENT_TYPES', payRes.data)
                if (sickRes.data) commit('SET_SICK_TYPES', sickRes.data)
            } catch (e) { console.error('Error fetching system data', e) }
        },
        async addAdditionDeduction({ commit, state }, item) {
            commit('ADD_ADDITION_DEDUCTION', item)
            if (!state.isMockMode) await additionDeductionService.create(item)
        },
        async deleteAdditionDeduction({ commit, state }, id) {
            commit('DELETE_ADDITION_DEDUCTION', id)
            if (!state.isMockMode) await additionDeductionService.delete(id)
        },
        async updateAdditionDeduction({ commit, state }, item) {
            commit('UPDATE_ADDITION_DEDUCTION', item)
            if (!state.isMockMode) await additionDeductionService.update(item.id, item)
        },

        // Settings Actions
        async fetchSettings({ commit, state }) {
            if (state.isMockMode) return
            try {
                const res = await settingsService.getSettings()
                if (res.data) {
                    // Update state from DB settings
                    commit('SET_SALARY_START_DAY', res.data.salaryStartDay)
                    commit('SET_HOURLY_WAGE', res.data.hourlyWage)
                    if (res.data.taxSettings) {
                        commit('SET_TAX_SETTINGS_BULK', res.data.taxSettings)
                    }
                }
            } catch (e) { console.error(e) }
        },
        async saveAllSettings({ state }) {
            if (state.isMockMode) return
            const settings = {
                salaryStartDay: state.settings.salaryStartDay,
                hourlyWage: state.settings.hourlyWage,
                taxSettings: state.taxSettings
            }
            await settingsService.saveSettings(settings)
        },

        updateSalaryStartDay({ commit, dispatch }, day) {
            commit('SET_SALARY_START_DAY', day)
            dispatch('saveAllSettings')
        },
        updateHourlyWage({ commit, dispatch }, wage) {
            commit('SET_HOURLY_WAGE', wage)
            dispatch('saveAllSettings')
        },

        // Tax Actions
        updateTaxSetting({ commit, dispatch }, payload) {
            commit('SET_TAX_SETTING', payload)
            dispatch('saveAllSettings')
        },
        updateTaxCreditPoints({ commit, dispatch }, points) {
            commit('SET_TAX_CREDIT_POINTS', points)
            dispatch('saveAllSettings')
        },
        updateTaxPointValue({ commit, dispatch }, value) {
            commit('SET_TAX_POINT_VALUE', value)
            dispatch('saveAllSettings')
        },

        // Rate/Overtime Actions
        addShiftRate({ commit, state }, { shiftId, rate }) {
            const shiftType = state.shiftTypes.find(t => t.id === shiftId)
            if (!shiftType) return

            const updatedRates = [...(shiftType.rates || []), rate]
            commit('UPDATE_SHIFT_TYPE', { ...shiftType, rates: updatedRates })
        },
        updateShiftRate({ commit, state }, { shiftId, index, rate }) {
            const shiftType = state.shiftTypes.find(t => t.id === shiftId)
            if (!shiftType || !shiftType.rates) return

            const updatedRates = [...shiftType.rates]
            updatedRates.splice(index, 1, rate)
            commit('UPDATE_SHIFT_TYPE', { ...shiftType, rates: updatedRates })
        },
        deleteShiftRate({ commit, state }, { shiftId, index }) {
            const shiftType = state.shiftTypes.find(t => t.id === shiftId)
            if (!shiftType || !shiftType.rates) return

            const updatedRates = shiftType.rates.filter((_, i) => i !== index)
            commit('UPDATE_SHIFT_TYPE', { ...shiftType, rates: updatedRates })
        }
    },
    plugins: [
        createPersistedState({
            key: 'human-resource-data',
            paths: ['token', 'user', 'shifts', 'pendingSync', 'lastSync', 'shiftTypes', 'paymentTypes', 'sickTypes', 'weeklyPlans', 'settings', 'additionsDeductions', 'taxSettings', 'isMockMode']
        })
    ]
})
