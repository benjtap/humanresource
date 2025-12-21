<template>
  <div class="login-container">
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>

    <div class="login-card">
      <div class="card-header">
        <h1>Bienvenue</h1>
        <p>Veuillez vous identifier pour continuer</p>
      </div>

      <form @submit.prevent="handleIdentityCheck" class="login-form">
        <div class="form-group">
          <label for="idNumber">Tehoudat Zehout</label>
          <input 
            type="text" 
            id="idNumber" 
            v-model="form.idNumber" 
            placeholder="Entrez votre numéro d'identité"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="phoneNumber">Téléphone</label>
          <input 
            type="tel" 
            id="phoneNumber" 
            v-model="form.phoneNumber" 
            placeholder="05X-XXXXXXX"
            required
            :disabled="isLoading"
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="loader"></span>
          <span v-else>Vérifier</span>
        </button>
      </form>
    </div>

    <!-- OTP Modal Popup -->
    <transition name="fade">
      <div v-if="showOtpModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Code de Vérification</h3>
            <p>Un code a été envoyé à votre numéro.</p>
          </div>
          
          <form @submit.prevent="handleCodeVerification">
            <div class="form-group">
              <input 
                type="text" 
                class="otp-input"
                v-model="verificationCode" 
                placeholder="Ex: 123456"
                autofocus
                required
              />
            </div>

            <div class="modal-actions">
              <button type="button" @click="showOtpModal = false" class="btn-secondary">Annuler</button>
              <button type="submit" class="btn-primary">Confirmer</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import api from '../services/api'

const router = useRouter()
const store = useStore()

const isLoading = ref(false)
const showOtpModal = ref(false)
const verificationCode = ref('')

const form = reactive({
  idNumber: '',
  phoneNumber: ''
})

const handleIdentityCheck = async () => {
  isLoading.value = true
  try {
    // 1. Chained Request: Send ID and Phone to API endpoint
    // Replace '/auth/check' with your actual endpoint
    const response = await api.post('/auth/check', {
      tehoudat_zehout: form.idNumber,
      phone: form.phoneNumber
    })
    
    // If successful match (concordance), show popup
    // You might want to check response.data.success or similar depending on API
    if (response.data) {
        showOtpModal.value = true
    }
    
  } catch (error) {
    console.error('Identity check failed:', error)
    alert('Erreur lors de la vérification. Veuillez vérifier vos informations.')
  } finally {
    isLoading.value = false
  }
}

const handleCodeVerification = async () => {
  try {
    // 2. Post verification code
    const response = await api.post('/auth/verify', {
      code: verificationCode.value,
      tehoudat_zehout: form.idNumber // Send context if needed
    })

    // 3. If concordance, get JWT token
    const token = response.data.token
    
    if (token) {
      // 4. Store token in Vuex (which also sets the Axios header)
      store.dispatch('saveToken', token)
      
      // Redirect to dashboard
      router.push('/')
    } else {
        alert('Code invalide')
    }
  } catch (error) {
    console.error('Code verification failed:', error)
    alert('Code incorrect ou expiré.')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.background-shapes .shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
}
.shape-1 {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.3);
  top: -50px;
  left: -50px;
}
.shape-2 {
  width: 400px;
  height: 400px;
  background: rgba(79, 70, 229, 0.4);
  bottom: -100px;
  right: -100px;
}

.login-card {
  background: var(--surface);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}
.card-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}
.card-header p {
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 2px solid #e5e7eb;
  background: #f9fafb;
  transition: all 0.2s;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
  background: white;
}

.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.otp-input {
  text-align: center;
  letter-spacing: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-secondary {
  flex: 1;
  padding: 0.75rem;
  background: transparent;
  border: 2px solid #e5e7eb;
  color: var(--text-main);
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background: #f3f4f6;
}

/* Animations */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.loader {
    width: 20px;
    height: 20px;
    border: 3px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}
@keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
