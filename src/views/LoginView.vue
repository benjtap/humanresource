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
        
        <!-- Mock/Demo Login Button -->
        <button type="button" class="btn-secondary-action" @click="bypassLogin" style="margin-top: 10px;">
          Connexion Démo (Mock)
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
                maxlength="6"
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
const authContext = ref('inscription') // 'inscription' or 'connexion'

const form = reactive({
  idNumber: '',
  phoneNumber: ''
})

const handleIdentityCheck = async () => {
  isLoading.value = true
  try {
    // 1. Essayer Inscription
    const payload = {
      Username: form.idNumber,
      Telephone: form.phoneNumber
    }
    
    // Note: Endpoint paths case sensitive? Typically lowercase in URL. Controller is "Auth".
    // Using /api/Auth/inscription
    const response = await api.post('/Auth/inscription', payload)
    
    if (response.data.succes) {
        authContext.value = 'inscription'
        showOtpModal.value = true
        return
    }

    // Si pas succès, vérifier si c'est parce que l'utilisateur existe
    // Le message peut varier, on regarde si ça contient des mots clés ou si succes est false tout simplement
    // Si l'utilisateur existe, on tente une connexion
    
    console.log("Inscription failed, trying login...", response.data.message)
    await tryLoginFlow()

  } catch (error) {
    console.error('Identity check failed:', error)
    // Si 400 (Bad Request), peut-être validation échouée ou utilisateur existe (selon implémentation)
    // On essaie le login flow en fallback si l'erreur n'est pas critique
    
    // Si c'est une vraie erreur réseau ou autre, on alerte
    if (error.response && error.response.status === 400) {
         // Si c'est "déjà utilisé", on tente le login
         // Malheureusement le message est dans response.data.message
         if (error.response.data && !error.response.data.succes) {
            await tryLoginFlow()
            return
         }
    }
    
    alert('Erreur: ' + (error.response?.data?.message || 'Vérifiez vos informations.'))
  } finally {
    isLoading.value = false
  }
}

const tryLoginFlow = async () => {
    // Tentative de connexion (Demande OTP)
    try {
        const response = await api.post('/Auth/connexion/demander', { 
            Username: form.idNumber 
        })
        
        if (response.data.succes) {
            authContext.value = 'connexion'
            showOtpModal.value = true
        } else {
            // Echec aussi du login (ex: compte inactif, ou tel non vérifié qui nécessite inscription code resend)
            if (response.data.message.includes("vérifier votre téléphone")) {
                // Cas spécial: existe mais pas vérifié. On doit renvoyer le code inscription
                await resendInscriptionCode()
            } else {
                alert(response.data.message || 'Compte introuvable.')
            }
        }
    } catch (e) {
         console.error("Login attempt failed", e)
         alert("Erreur lors de la connexion.")
    }
}

const resendInscriptionCode = async () => {
    try {
        const response = await api.post('/Auth/inscription/renvoyer-code', { 
            Username: form.idNumber 
        })
        if (response.data.succes) {
            authContext.value = 'inscription' // On retourne en mode inscription pour la vérif
            showOtpModal.value = true
            alert("Un nouveau code d'inscription a été envoyé.")
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
</style>
