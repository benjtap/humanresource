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
          <span v-else>Continuer</span>
        </button>
        
        <div class="mode-toggle-container">
            <label class="toggle-switch">
                <input type="checkbox" :checked="isMockMode" @change="toggleMode">
                <span class="slider round"></span>
            </label>
            <span class="mode-label">{{ isMockMode ? 'Mode Données Test (Mock)' : 'Mode API (MongoDB)' }}</span>
        </div>
        
        <div style="text-align: center; margin-top: 10px;">
             <a href="#" @click.prevent="fillMockData" style="color: #666; font-size: 0.8rem;">Remplir Données Test (050...)</a>
        </div>
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
                maxlength="6"
              />
            </div>

            <div class="modal-actions">
              <button type="button" @click="showOtpModal = false" class="btn-secondary">Annuler</button>
              <button type="button" @click="simulateSmsReceived" class="btn-secondary" style="font-size: 0.8rem;">Simuler SMS (Dev)</button>
              <button type="submit" class="btn-primary">Confirmer</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import api from '../services/api'

const router = useRouter()
const store = useStore()

const isLoading = ref(false)
const showOtpModal = ref(false)
const verificationCode = ref('')
const authContext = ref('inscription') // 'inscription' or 'connexion'

const form = reactive({
  idNumber: '',
  phoneNumber: ''
})

const isMockMode = computed(() => store.getters.isMockMode);

const toggleMode = () => {
    store.commit('TOGGLE_MOCK_MODE');
};

const handleIdentityCheck = async () => {
  isLoading.value = true
  
  if (isMockMode.value) {
      // Direct Mock Login
      setTimeout(() => {
          bypassLogin();
          isLoading.value = false;
      }, 500);
      return;
  }

  try {
    // 1. Tenter la Connexion d'abord (Cas le plus fréquent + Login direct si vérifié)
    const response = await api.post('/Auth/connexion/demander', { 
        Username: form.idNumber 
    })

    if (response.data.succes) {
         // CAS: Utilisateur vérifié (Login direct)
         const data = response.data.data
         if (data && (data.token || data.Token)) {
            const token = data.token || data.Token
            store.dispatch('saveToken', token)
            store.commit('SET_USER', data.utilisateur || data.Utilisateur)
            router.push({ name: 'shifts' })
            return
         }
         
         // CAS: Utilisateur existe mais nécessite OTP de connexion ?
         // Note: Avec la modif backend, ce cas n'arrive plus si verifié=true (token) ou false (erreur).
         // Mais on garde pour robustesse si backend change.
         authContext.value = 'connexion'
         showOtpModal.value = true

    } else {
         // ECHEC CONNEXION
         const msg = response.data.message || ''
         
         if (msg.toLowerCase().includes('introuvable')) {
             // 2. Utilisateur inconnu -> Inscription
             await doInscription()
         } else if (msg.toLowerCase().includes('vérifier votre téléphone')) {
             // 3. Utilisateur existe mais non vérifié -> Renvoyer code Inscription
             await resendInscriptionCode()
         } else {
             // Autre erreur
             alert(msg)
         }
    }

  } catch (error) {
    console.error('Identity check failed:', error)
    // Fallback: Si erreur réseau ou 400 bizarre, on essaie inscription si on a pas de meilleur indice, 
    // mais "Introuvable" est généralement géré dans le bloc 'else' du success false.
    if (error.response && error.response.status === 400) {
         // Si l'API retourne 400 pour "User not found" au lieu de 200 {succes:false}
         if (error.response.data && error.response.data.message && error.response.data.message.includes('introuvable')) {
             await doInscription()
             return
         }
    }
    alert('Erreur: ' + (error.response?.data?.message || 'Une erreur est survenue.'))
  } finally {
    isLoading.value = false
  }
}

const doInscription = async () => {
    try {
        const payload = {
            Username: form.idNumber,
            Telephone: form.phoneNumber
        }
        const response = await api.post('/Auth/inscription', payload)
        
        if (response.data.succes) {
            authContext.value = 'inscription'
            showOtpModal.value = true
        } else {
            alert(response.data.message || "Erreur lors de l'inscription")
        }
    } catch (e) {
        console.error("Inscription failed", e)
        alert("Erreur lors de la création du compte.")
    }
}

const resendInscriptionCode = async () => {
    try {
        const response = await api.post('/Auth/inscription/renvoyer-code', { 
            Username: form.idNumber 
        })
        if (response.data.succes) {
            authContext.value = 'inscription' 
            showOtpModal.value = true
            // alert("Un message a été envoyé.") // Optionnel
        } else {
            alert(response.data.message)
        }
    } catch (e) {
        alert("Impossible de renvoyer le code.")
    }
}

const handleCodeVerification = async () => {
  if (!/^\d{6}$/.test(verificationCode.value)) {
    alert('Le code doit contenir exactement 6 chiffres.')
    return
  }

  isLoading.value = true
  try {
    const endpoint = authContext.value === 'inscription' 
        ? '/Auth/inscription/verifier' 
        : '/Auth/connexion/verifier'

    const payload = {
        Username: form.idNumber,
        Code: verificationCode.value
    }
    
    const response = await api.post(endpoint, payload)

    if (response.data.succes) {
        // Succès ! Le token devrait être dans response.data.data.token (camelCase) ou Token
        // API .NET retourne souvent PascalCase pour les propriétés anonymes ou DTO standard sauf config
        // Mon DTO 'ConnexionResponse' a 'Token' et 'Utilisateur'.
        const data = response.data.data
        const token = data.token || data.Token

        if (token) {
            store.dispatch('saveToken', token)
            store.commit('SET_USER', data.utilisateur || data.Utilisateur) // Save user info too if store supports it
            router.push({ name: 'shifts' })
        } else {
             // Cas rare: succès sans token ? (Ne devrait pas arriver avec ma modif backend)
             alert('Vérification réussie, veuillez vous connecter.')
             showOtpModal.value = false
             // Switch to login flow manually if needed, but easier to just ask user to click "Verifier" again
        }
    } else {
        alert(response.data.message || 'Code invalide')
    }
  } catch (error) {
    console.error('Code verification failed:', error)
    alert(error.response?.data?.message || 'Code incorrect ou expiré.')
  } finally {
    isLoading.value = false
  }
}


const bypassLogin = () => {
    // Generate fake token
    const fakeToken = 'mock-token-' + Date.now();
    const fakeUser = {
        Id: 'mock-user-id',
        Username: 'DemoUser',
        Telephone: '0500000000',
        TelephoneVerifie: true
    };
    
    store.dispatch('saveToken', fakeToken);
    store.commit('SET_USER', fakeUser);
    
    router.push({ name: 'shifts' });
};

const fillMockData = () => {
    form.idNumber = '111111111';
    form.phoneNumber = '0500000000';
};

const simulateSmsReceived = () => {
    verificationCode.value = '123456';
};
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

.btn-secondary-action {
  width: 100%;
  padding: 0.875rem;
  background: transparent;
  color: var(--text-muted);
  border: 1px dashed #ccc;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary-action:hover {
  background: rgba(0,0,0,0.05);
  color: var(--text-main);
  border-color: var(--text-muted);
}
.btn-secondary-action:hover {
  background: rgba(0,0,0,0.05);
  color: var(--text-main);
  border-color: var(--text-muted);
}

.mode-toggle-container {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.mode-label {
    font-size: 0.9rem;
    color: var(--text-muted);
    font-weight: 500;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
