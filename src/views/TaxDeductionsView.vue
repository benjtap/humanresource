<template>
  <div class="page-container">
    <!-- Header -->
    <header class="header">
      <button class="icon-btn" @click.stop="isMenuOpen = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      
      <div class="header-title-area">
          <span>הגדרות מס הכנסה</span>
      </div>

       <button class="icon-btn" style="visibility: hidden;">
         <!-- Spacer -->
      </button>
    </header>

    <!-- Main Content -->
    <div class="content-scroll">
        <div class="settings-list">
            
            <!-- Action Buttons (Moved to Top) -->
            <div class="action-footer" style="padding: 20px 20px 0 20px; box-shadow: none; background: transparent;">
                <button class="action-button update" @click="saveChanges">עדכן</button>
                <button class="action-button cancel" @click="cancelChanges">ביטול</button>
            </div>
            <!-- Income Tax Exemption -->
            <div class="setting-card">
                <div class="setting-main">
                    <div class="setting-info">
                        <div class="setting-title">פטור ממס הכנסה</div>
                        <div class="setting-desc">אפשרות זו תבטל את חישוב מס הכנסה (כגון לחייל משוחרר,...)</div>
                    </div>
                    <div class="setting-control">
                        <label class="switch">
                            <input type="checkbox" v-model="form.isIncomeTaxExempt">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Credit Points -->
            <div class="setting-card">
                 <div class="setting-main vertical">
                    <div class="setting-info center-text">
                        <div class="setting-title">נקודות זיכוי</div>
                        <div class="setting-desc">נא להכניס כמות נקודות זיכוי</div>
                    </div>
                    <div class="setting-control center-control">
                         <div class="counter-wrapper">
                             <button class="counter-btn" @click="updateCreditPoints(-0.25)">-</button>
                             <span class="counter-value">{{ form.creditPoints.toFixed(2) }}</span>
                             <button class="counter-btn" @click="updateCreditPoints(0.25)">+</button>
                         </div>
                    </div>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Study Fund -->
            <div class="setting-card">
                 <div class="setting-main vertical">
                    <div class="setting-header-row">
                         <div class="setting-info">
                            <div class="setting-title">קרן השתלמות</div>
                         </div>
                         <div class="setting-control-checkbox">
                             <span class="checkbox-label">חישוב קבוע מבוסיס 182 שעות</span>
                            <input type="checkbox" v-model="form.isStudyFundFixed182" class="checkbox-box">
                         </div>
                    </div>
                    <div class="setting-desc full-width">נא להכניס אחוזים לקרן השתלמות (0% אומר שלא יחושב קרן השתלמות)</div>
                    
                    <div class="setting-control center-control mt-2">
                         <div class="counter-wrapper">
                             <button class="counter-btn" @click="updateStudyFund(-1)">-</button>
                             <span class="counter-value">{{ form.studyFund }}</span>
                             <button class="counter-btn" @click="updateStudyFund(1)">+</button>
                         </div>
                    </div>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Pension Fund -->
            <div class="setting-card">
                 <div class="setting-main vertical">
                    <div class="setting-header-row">
                         <div class="setting-info">
                            <div class="setting-title">קרן פנסיה</div>
                         </div>
                         <div class="setting-control-checkbox">
                             <span class="checkbox-label">חישוב קבוע מבוסיס 182 שעות</span>
                            <input type="checkbox" v-model="form.isPensionFundFixed182" class="checkbox-box">
                         </div>
                    </div>
                    <div class="setting-desc full-width">נא להכניס אחוזים לקרן פנסיה</div>
                    
                    <div class="setting-control center-control mt-2">
                         <div class="counter-wrapper">
                             <button class="counter-btn" @click="updatePensionFund(-1)">-</button>
                             <span class="counter-value">{{ form.pensionFund }}</span>
                             <button class="counter-btn" @click="updatePensionFund(1)">+</button>
                         </div>
                    </div>
                </div>
            </div>

             <div class="divider"></div>

            <!-- National Insurance Exempt -->
            <div class="setting-card">
                <div class="setting-main">
                    <div class="setting-info">
                        <div class="setting-title">פטור מביטוח לאומי</div>
                        <div class="setting-desc">ניתן לבטל חישוב ביטוח לאומי כגון לנכי ביטוח לאומי</div>
                    </div>
                    <div class="setting-control">
                        <label class="switch">
                            <input type="checkbox" v-model="form.isNationalInsuranceExempt">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="divider"></div>

             <!-- Health Tax Exempt -->
            <div class="setting-card">
                <div class="setting-main">
                    <div class="setting-info">
                        <div class="setting-title">פטור ממס בריאות</div>
                        <div class="setting-desc">ניתן לבטל חישוב מס בריאות כגון לנכי ביטוח לאומי</div>
                    </div>
                    <div class="setting-control">
                        <label class="switch">
                            <input type="checkbox" v-model="form.isHealthTaxExempt">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

             <div class="divider"></div>

             <!-- Shift Tax Credit -->
            <div class="setting-card">
                <div class="setting-main">
                    <div class="setting-info">
                        <div class="setting-title">זיכוי מס במשמרת</div>
                        <div class="setting-desc">יש לסמן כדי לקבל זיכוי מס במשמרות לילה וצהריים</div>
                    </div>
                    <div class="setting-control">
                        <label class="switch">
                            <input type="checkbox" v-model="form.isShiftTaxCredit">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>



        </div>
    </div>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" v-if="isMenuOpen" @click="isMenuOpen = false"></div>

    <!-- Sidebar Menu -->
    <aside class="sidebar" :class="{ open: isMenuOpen }">
      <div class="sidebar-header">
        <div class="header-bg-decor"></div>
        <div class="sidebar-top-row">
          <span class="account-name">חשבון: עבודה 1</span>
        </div>
        <div class="sidebar-bottom-row">
          <div class="menu-label-group">
            <button class="icon-btn" @click="isMenuOpen = false">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <span class="menu-text">תפריט</span>
          </div>
          <div class="user-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#ccc" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="avatar-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
        </div>
      </div>

      <div class="menu-items">
        <router-link to="/shifts" class="menu-item" @click="isMenuOpen = false">
           <span class="item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span>
           <span>משמרות</span>
        </router-link>
        <router-link to="/summary" class="menu-item" @click="isMenuOpen = false">
           <span class="item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></span>
           <span>פירוט שכר</span>
        </router-link>
        <router-link to="/weekly-schedules" class="menu-item" @click="isMenuOpen = false">
           <span class="item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg></span>
           <span>סידור עבודה</span>
        </router-link>
        <router-link to="/shift-types" class="menu-item" @click="isMenuOpen = false">
           <span class="item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></span>
           <span>הגדרת סוג משמרת</span>
        </router-link>
        <router-link to="/settings" class="menu-item active-menu-item" @click="isMenuOpen = false">
           <span class="item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg></span>
           <span>הגדרות</span>
        </router-link>
        
        <div class="spacer-small"></div>
        <a href="#" class="menu-item" @click.prevent="logout">
           <span class="item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></span>
           <span>יציאה</span>
        </a>
      </div>
      <div class="sidebar-footer"></div>
    </aside>

    <!-- Bottom Navigation -->
    <div class="bottom-tabs-container">
        <div class="bottom-tabs-scroll">
            <button class="bottom-tab" @click="$router.push('/settings')">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <span>הגדרות שכר</span>
            </button>
            <button class="bottom-tab" @click="$router.push('/overtime-settings')"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                <span>סוגי משמרות</span>
            </button>
            <button class="bottom-tab" @click="$router.push('/additions-deductions')">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                <span>הוספות \ הורדות</span>
            </button>
             <button class="bottom-tab active">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                <span>מס הכנסה</span>
            </button>
            <button class="bottom-tab" @click="$router.push('/general-settings')">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                <span>כללי</span>
            </button>

        </div>
    </div>

    <!-- Toast Notification -->
    <transition name="fade-fast">
        <div v-if="toastVisible" class="toast-notification">
            <div class="toast-content" :class="toastType">
                <div class="toast-icon-wrapper">
                    <svg v-if="toastType === 'success'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <div class="toast-text">{{ toastMessage }}</div>
            </div>
        </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const isMenuOpen = ref(false);

// Toast Logic
const toastVisible = ref(false);
const toastMessage = ref('');
const toastType = ref('success'); // 'success' or 'error'

const showToast = (message, type = 'success') => {
    toastMessage.value = message;
    toastType.value = type;
    toastVisible.value = true;
    setTimeout(() => {
        toastVisible.value = false;
    }, 3000);
};

const form = reactive({
    isIncomeTaxExempt: false,
    creditPoints: 2.25,
    studyFund: 0,
    isStudyFundFixed182: false,
    pensionFund: 0,
    isPensionFundFixed182: false,
    isNationalInsuranceExempt: false,
    isHealthTaxExempt: false,
    isShiftTaxCredit: false
});

const initForm = () => {
    form.isIncomeTaxExempt = store.getters.taxIsIncomeTaxExempt;
    form.creditPoints = store.getters.taxCreditPoints;
    form.studyFund = store.getters.taxStudyFund;
    form.isStudyFundFixed182 = store.getters.taxIsStudyFundFixed182;
    form.pensionFund = store.getters.taxPensionFund;
    form.isPensionFundFixed182 = store.getters.taxIsPensionFundFixed182;
    form.isNationalInsuranceExempt = store.getters.taxIsNationalInsuranceExempt;
    form.isHealthTaxExempt = store.getters.taxIsHealthTaxExempt;
    form.isShiftTaxCredit = store.getters.taxIsShiftTaxCredit;
};

onMounted(() => {
    initForm();
});

const updateCreditPoints = (delta) => {
    form.creditPoints = Math.max(0, form.creditPoints + delta);
};

const updateStudyFund = (delta) => {
    form.studyFund = Math.max(0, form.studyFund + delta);
};

const updatePensionFund = (delta) => {
    form.pensionFund = Math.max(0, form.pensionFund + delta);
};

const saveChanges = async () => {
    try {
        // Commit all changes to store
        // We use Commit instead of Dispatch to avoid triggering individual saves if using the existing actions.
        store.commit('SET_TAX_SETTING', { key: 'isIncomeTaxExempt', value: form.isIncomeTaxExempt });
        store.commit('SET_TAX_CREDIT_POINTS', form.creditPoints);
        store.commit('SET_TAX_SETTING', { key: 'studyFund', value: form.studyFund });
        store.commit('SET_TAX_SETTING', { key: 'isStudyFundFixed182', value: form.isStudyFundFixed182 });
        store.commit('SET_TAX_SETTING', { key: 'pensionFund', value: form.pensionFund });
        store.commit('SET_TAX_SETTING', { key: 'isPensionFundFixed182', value: form.isPensionFundFixed182 });
        store.commit('SET_TAX_SETTING', { key: 'isNationalInsuranceExempt', value: form.isNationalInsuranceExempt });
        store.commit('SET_TAX_SETTING', { key: 'isHealthTaxExempt', value: form.isHealthTaxExempt });
        store.commit('SET_TAX_SETTING', { key: 'isShiftTaxCredit', value: form.isShiftTaxCredit });

        // Now dispatch a single save
        await store.dispatch('saveAllSettings');
        showToast("הגדרות נשמרו בהצלחה", 'success');
    } catch (e) {
        console.error("Failed to save settings", e);
        showToast("שגיאה בשמירת הגדרות", 'error');
    }
};

const cancelChanges = () => {
    initForm();
};

const logout = () => {
    store.dispatch('saveToken', null);
    store.commit('SET_USER', null);
    router.push({ name: 'login' });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

/* Toast Styles */
.toast-notification {
    position: fixed;
    bottom: 90px; /* Above bottom nav */
    left: 50%;
    transform: translateX(-50%);
    z-index: 5000;
}

.toast-content {
    background-color: white;
    border-radius: 50px;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    direction: rtl;
    min-width: 280px;
    justify-content: space-between;
}

.toast-content.success .toast-icon-wrapper {
    color: #4CAF50;
}

.toast-content.error .toast-icon-wrapper {
    color: #F44336;
}

.toast-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.toast-text {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

.page-container {
  font-family: 'Heebo', sans-serif;
  background-color: white; 
  height: 100vh;
  display: flex;
  flex-direction: column;
  direction: rtl;
  color: #333;
}

.header {
  background-color: #5ab9c9; /* Lighter Cyan/Blue matching image */
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  color: white;
  flex-direction: row-reverse;
  flex-shrink: 0;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.icon-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
}

.header-title-area {
    font-size: 1.1rem;
    font-weight: 500;
    color: white;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
}

.content-scroll {
    flex: 1;
    overflow-y: auto;
    background-color: white;
}

.settings-list {
    display: flex;
    flex-direction: column;
    padding-bottom: 80px; /* Space for footer */
}

.setting-card {
    padding: 24px 20px;
    background: white;
}

.setting-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.setting-main.vertical {
    flex-direction: column;
    align-items: stretch;
}

.setting-main.vertical .setting-info {
    text-align: center;
    margin-bottom: 20px;
}

.setting-main.vertical .setting-control {
    justify-content: center;
    width: 100%;
}

.setting-info {
    flex: 1;
    padding-left: 20px;
}

.setting-info.center-text {
    text-align: center;
    padding-left: 0;
}

.setting-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
    text-align: right;
}

.setting-info.center-text .setting-title {
    text-align: center;
}

.setting-desc {
    font-size: 0.95rem;
    color: #666;
    line-height: 1.4;
    text-align: right;
}

.setting-info.center-text .setting-desc {
     text-align: center;
}

.setting-control {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.setting-control.center-control {
    justify-content: center;
}

/* Header Row for Complex Cards (Pension/Study) */
.setting-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
}

.setting-header-row .setting-info {
    padding-left: 0;
    flex: 0 0 auto;
}

.setting-header-row .setting-title {
     margin-bottom: 0;
}

.setting-control-checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
}

.checkbox-label {
    font-size: 0.8rem;
    color: #666;
}

.checkbox-box {
    width: 18px;
    height: 18px;
    accent-color: #666;
}

.full-width {
    width: 100%;
    text-align: right;
}


/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input { 
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
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #5ab9c9; /* Theme Blue */
}

input:focus + .slider {
  box-shadow: 0 0 1px #5ab9c9;
}

input:checked + .slider:before {
  -webkit-transform: translateX(22px);
  -ms-transform: translateX(22px);
  transform: translateX(22px); /* LTR logic? No, check direction */
  /* In RTL or LTR, translateX moves right. */
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}


/* Counter Controls */
.counter-wrapper {
    display: flex;
    align-items: center;
    gap: 20px;
}

.counter-btn {
    width: 50px;
    height: 50px;
    background-color: #777;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.5rem;
    font-weight: 300;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.counter-value {
    font-size: 1.3rem;
    font-weight: 500;
    min-width: 40px;
    text-align: center;
}

.divider {
    height: 1px;
    background-color: #eee;
    width: 100%;
}

.mt-2 {
    margin-top: 20px;
}

/* Action Footer */
.action-footer {
    padding: 20px;
    display: flex;
    gap: 15px;
    justify-content: center;
    background-color: white;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}

.action-button {
    flex: 1;
    padding: 12px;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    max-width: 200px;
}

.action-button.update {
    background-color: #5ab9c9;
    color: white;
}

.action-button.cancel {
    background-color: #f0f0f0;
    color: #333;
}

/* Sidebar Styles (Copy for consistency) */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 80%;
  max-width: 320px;
  height: 100%;
  background-color: #F5F5F5;
  z-index: 2001;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-header {
  height: 160px;
  background: linear-gradient(135deg, #4DD0E1 0%, #0093AB 80%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  color: white;
  overflow: hidden;
}

.header-bg-decor {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 300px;
    background: rgba(255, 235, 59, 0.2);
    transform: rotate(45deg);
    z-index: 0;
}

.sidebar-top-row {
  display: flex;
  justify-content: flex-end;
  z-index: 1;
}

.account-name {
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
}

.sidebar-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 1;
}

.menu-label-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.menu-text {
    font-size: 1.2rem;
    font-weight: 700;
}

.user-avatar {
    width: 50px;
    height: 50px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-icon {
    width: 30px;
    height: 30px;
    fill: #ddd;
    stroke: #aaa;
}

.menu-items {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  color: #555;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  border-left: 4px solid transparent;
  transition: all 0.2s;
  flex-direction: row-reverse; 
}

.menu-item:hover {
  background-color: #e0f7fa;
  color: #0093AB;
}

.menu-item.active-menu-item {
  background-color: #E0F2F1;
  color: #0093AB;
  border-left-color: #0093AB; 
}

.item-icon {
  margin-left: 16px; 
  display: flex;
  align-items: center;
}

.spacer-small {
    height: 10px;
}

.sidebar-footer {
    height: 20px;
}

/* Bottom Tabs */
.bottom-tabs-container {
    height: 70px;
    background-color: #0093AB;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    overflow-x: auto; /* Scrollable horizontal */
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}
.bottom-tabs-container::-webkit-scrollbar {
    display: none;
}

.bottom-tabs-scroll {
    display: flex;
    flex-direction: row-reverse; /* RTL Order */
    height: 100%;
    min-width: 100%;
    width: max-content;
}

.bottom-tab {
    flex: 1 0 100px;
    min-width: 100px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.7);
    display: flex;
    flex-direction: column; /* Icon Top */
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    border-left: 1px solid rgba(255,255,255,0.1);
    padding: 0 16px; 
}

.bottom-tab.active {
    color: white;
    background-color: rgba(0,0,0,0.1);
}
</style>
