<template>
  <div 
    class="settings-page"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  >
    <!-- Header -->
    <header class="header">
      <button class="icon-btn" @click.stop="isMenuOpen = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>

      <div class="header-title-area">
          <span>הגדרות</span>
      </div>

      <button class="icon-btn" style="visibility: hidden;">
         <div style="width: 24px;"></div>
      </button>
    </header>



    <!-- Main Content -->
    <div class="content-scroll">
        
        <!-- Section Header (Teal) -->
        <div class="section-header">
            הגדרות שכר
        </div>

        <div class="settings-body">
            
            <!-- Hourly Wage -->
            <div class="setting-group">
                <p class="instruction-text">נא להכניס שכר לשעת עבודה רגילה.</p>
                <div class="wage-input-wrapper">
                    <button class="refresh-btn" @click="syncSettings">
                        <svg :class="{ 'spinning': isSaving }" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    </button>
                    <div class="wage-box" @click="openWageModal">
                        <span class="currency-symbol">₪</span>
                        <input type="number" :value="hourlyWage" class="wage-input" readonly />
                    </div>
                </div>
            </div>

            <!-- Start Day -->
            <div class="setting-group">
                <p class="instruction-text">נא לבחור יום התחלה של החודש בו יתחיל החישוב שכר.</p>
                <div class="days-grid">
                    <div 
                        v-for="day in 31" 
                        :key="day" 
                        class="day-cell" 
                        :class="{ selected: salaryStartDay === day }"
                        @click="handleDayClick(day)"
                    >
                        {{ day }}
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Wage Modal -->
    <transition name="fade">
      <div v-if="isWageModalOpen" class="input-modal-overlay" @click.self="isWageModalOpen = false">
        <div class="input-modal">
           <div class="input-modal-title">שכר לשעה</div>
           <div class="input-title-divider"></div>
           <div class="input-modal-body">
               <p class="input-instruction">נא להכניס שכר לשעה</p>
               <input type="number" v-model="tempHourlyWage" class="modal-input" placeholder="שכר לשעה" inputmode="decimal" />
           </div>
           <div class="input-modal-footer">
               <button class="modal-btn confirm" @click="saveWage">אישור</button>
               <button class="modal-btn cancel" @click="isWageModalOpen = false">ביטול</button>
           </div>
        </div>
      </div>
    </transition>

    <!-- Calculation Day Confirmation Modal -->
    <transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
        <div class="modal-content">
          <div class="modal-header">
            יום חישוב
          </div>
          <div class="modal-divider"></div>
          
          <div class="modal-body">
            <p>חישוב החודש יחול מה {{ selectedTempDay }} עד ה {{ getEndDay(selectedTempDay) }} בחודש שאחריו, להמשיך?</p>
          </div>
          
          <div class="modal-footer">
             <button class="modal-btn confirm" @click="confirmStartDay">אישור</button>
             <button class="modal-btn cancel" @click="isModalOpen = false">ביטול</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Bottom Scrollable Tabs -->
    <div class="bottom-tabs-container">
        <div class="bottom-tabs-scroll">
            <button class="bottom-tab active">
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
            <button class="bottom-tab" @click="$router.push('/tax-deductions')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                <span>מס הכנסה</span>
            </button>
            <button class="bottom-tab" @click="$router.push('/general-settings')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                <span>כללי</span>
            </button>
        </div>
    </div>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" v-if="isMenuOpen" @click="isMenuOpen = false"></div>

    <!-- Sidebar Menu -->
    <aside class="sidebar" :class="{ open: isMenuOpen }">
      <!-- Sidebar Header -->
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

      <!-- Menu Items -->
      <div class="menu-items">
        <router-link to="/shifts" class="menu-item" @click="isMenuOpen = false">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </span>
          <span>משמרות</span>
        </router-link>
        <router-link to="/summary" class="menu-item" @click="isMenuOpen = false">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </span>
          <span>פירוט שכר</span>
        </router-link>
        <router-link to="/weekly-schedules" class="menu-item" @click="isMenuOpen = false">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          </span>
          <span>סידור עבודה</span>
        </router-link>
        <router-link to="/shift-types" class="menu-item" @click="isMenuOpen = false">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </span>
          <span>הגדרת סוג משמרת</span>
        </router-link>
        <router-link to="/settings" class="menu-item active-menu-item" @click="isMenuOpen = false">
          <span class="item-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
          </span>
          <span>הגדרות</span>
        </router-link>
        <div class="spacer-small"></div>
        <a href="#" class="menu-item">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </span>
          <span>דוח אקסל</span>
        </a>
        <div class="spacer-small"></div>
        
        <a href="#" class="menu-item" @click.prevent="logout">
           <span class="item-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
           </span>
           <span>יציאה</span>
        </a>
      </div>

      <div class="sidebar-footer"></div>
    </aside>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();
const isMenuOpen = ref(false);

// Hourly Wage
const hourlyWage = computed({
    get: () => store.getters.hourlyWage,
    set: (val) => store.dispatch('updateHourlyWage', val)
});

// Salary Start Day Logic
const salaryStartDay = computed(() => store.getters.salaryStartDay);
const isModalOpen = ref(false);
const selectedTempDay = ref(1);

// Wage Modal Logic
const isWageModalOpen = ref(false);
const tempHourlyWage = ref(0);

const openWageModal = () => {
    tempHourlyWage.value = hourlyWage.value;
    isWageModalOpen.value = true;
};

const saveWage = () => {
    hourlyWage.value = parseFloat(tempHourlyWage.value);
    isWageModalOpen.value = false;
};

const handleDayClick = (day) => {
    selectedTempDay.value = day;
    isModalOpen.value = true;
};

const getEndDay = (startDay) => {
    // If start is 1, end is 31 (conceptually end of month, logic might vary but simply: Start - 1)
    // If start is 25, end is 24.
    if (startDay === 1) return 31; // Simplification for UI text
    return startDay - 1;
};

const confirmStartDay = () => {
    store.commit('SET_SALARY_START_DAY', selectedTempDay.value);
    isModalOpen.value = false;
};

const logout = () => {
    store.dispatch('logout');
    router.push({ name: 'login' });
};

// Swipe & Navigation Handlers (Optional for navigation)
const touchStartX = ref(0);
const touchEndX = ref(0);

const onTouchStart = (e) => { touchStartX.value = e.changedTouches[0].screenX; };
const onTouchEnd = (e) => { touchEndX.value = e.changedTouches[0].screenX; handleSwipe(); };
const onMouseDown = (e) => { touchStartX.value = e.screenX; };
const onMouseUp = (e) => { touchEndX.value = e.screenX; handleSwipe(); };

const handleSwipe = () => {
    // Swipe logic if needed
};

const isSaving = ref(false);

const syncSettings = async () => {
    isSaving.value = true;
    try {
        await store.dispatch('saveAllSettings');
    } catch (e) {
        console.error("Failed to sync settings", e);
        store.dispatch('showToast', { message: 'שגיאה בשמירת הגדרות', type: 'error' });
    } finally {
        setTimeout(() => isSaving.value = false, 1000);
    }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.spinning {
    animation: spin 1s linear infinite;
}

.settings-page {
  font-family: 'Heebo', sans-serif;
  background-color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: #333;
  direction: rtl;
  min-height: 100vh;
}

/* Header */
.header {
  background-color: #0093AB;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  color: white;
  flex-direction: row-reverse; 
  flex-shrink: 0;
  z-index: 10;
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

/* Page Title Bar */
.page-title-bar {
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 15px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #4DB6CD; 
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
}

.title-icon {
    background-color: #0093AB; 
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.title-icon svg { width: 20px; height: 20px; }

/* Sub Header */
.section-header {
    background-color: #4DD0E1; /* Teal */
    color: white;
    text-align: center;
    padding: 12px;
    font-size: 1.1rem;
    font-weight: 500;
}

/* Content */
.content-scroll {
    flex: 1;
    overflow-y: auto;
    background-color: white;
    padding-bottom: 80px; /* Space above tabs */
}

.settings-body {
    padding: 30px 20px;
    text-align: center;
}

.setting-group {
    margin-bottom: 40px;
}

.instruction-text {
    color: #666;
    margin-bottom: 20px;
    font-size: 1rem;
}

/* Wage Input */
.wage-input-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}

.refresh-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    color: #333;
}

.wage-box {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 15px 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 200px;
    justify-content: center;
}

.wage-input {
    border: none;
    font-size: 1.8rem;
    width: 100px;
    text-align: center;
    outline: none;
}

.currency-symbol {
    font-size: 1.2rem;
    color: #333;
}

/* Days Grid */
.days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: -1px; /* Overlap borders */
    border: 1px solid #eee;
    max-width: 350px;
    margin: 0 auto;
}

.day-cell {
    border: 1px solid #eee;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
}

.day-cell.selected {
    background-color: #E0F7FA;
    font-weight: 700;
}

/* Bottom Tabs (Swipeable & Scrollable) */
.bottom-tabs-container {
    height: 70px;
    background-color: #0093AB;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    direction: rtl; /* Ensure RTL context for scrolling */
    
    /* Mobile Scrolling Fixes */
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
}

.bottom-tabs-container::-webkit-scrollbar {
    display: none;
}

.bottom-tabs-scroll {
    display: flex;
    flex-direction: row; /* Standard row, RTL will handle visual order */
    height: 100%;
    min-width: 100%;
    width: max-content;
}

.bottom-tab {
    flex: 0 0 auto; /* Do not grow, do not shrink, based on width/content */
    width: 100px; /* Fixed width base */
    min-width: 100px;
    height: 100%;
    background: none;
    border: none;
    color: rgba(255,255,255,0.7);
    display: flex;
    flex-direction: column;
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


/* Sidebar Styles (Copied) */
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
    display: flex;
    flex-direction: column;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    text-decoration: none;
    color: #444;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.2s;
}

.menu-item:hover, .menu-item.active-menu-item {
    background-color: rgba(0,0,0,0.05);
}

.item-icon {
    margin-left: 16px;
    color: #555;
    display: flex;
    align-items: center;
}

.spacer-small {
    height: 16px;
}

.sidebar-footer {
    padding: 16px;
    margin-left: 20px;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3000;
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 320px;
    border-radius: 4px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    overflow: hidden;
    direction: rtl; 
    text-align: center;
}

.modal-header {
    background-color: white;
    color: #03A9F4; /* Light Blue */
    font-size: 1.2rem;
    font-weight: bold;
    padding: 15px;
}

.modal-divider {
    height: 2px;
    background-color: #03A9F4;
    width: 100%;
}

.modal-body {
    padding: 20px;
    font-size: 1rem;
    color: #333;
    line-height: 1.4;
}

.modal-footer {
    display: flex;
    direction: rtl; 
    border-top: 1px solid #eee;
}

.modal-btn {
    flex: 1;
    padding: 15px;
    border: none;
    background: white;
    font-size: 1rem;
    cursor: pointer;
    font-weight: 500;
}

.modal-btn.confirm {
    color: #333;
    border-right: 1px solid #eee; /* Divider between buttons */
}

.modal-btn.cancel {
    color: #333;
}

.modal-btn:hover {
    background-color: #f9f9f9;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Input Modal Styles (Matched with ShiftsView) */
.input-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  backdrop-filter: blur(2px);
}

.input-modal {
  background: white;
  width: 85%;
  max-width: 300px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  padding: 0; 
  position: relative;
  background-color: white;
  border-radius: 2px;
}

.input-modal-title {
  color: #29B6F6; /* Light Blue */
  font-size: 1.4rem;
  font-weight: 500;
  padding: 20px 20px 10px 20px;
  text-align: right;
}

.input-title-divider {
  height: 2px;
  background-color: #29B6F6;
  width: 100%;
}

.input-modal-body {
    padding: 25px 20px;
}

.input-instruction {
  color: #333;
  margin: 0 0 15px 0;
  font-size: 1rem;
  text-align: right;
}

.modal-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #29B6F6;
  font-size: 1.1rem;
  padding: 8px 0;
  outline: none;
  text-align: right;
  color: #333;
  background: transparent;
  direction: rtl;
}

.modal-input::placeholder {
  color: #ccc;
  font-weight: 300;
}

.input-modal-footer {
  display: flex;
  border-top: 1px solid #eee;
  direction: rtl;
}

.modal-btn {
  flex: 1;
  background: white;
  border: none;
  font-size: 1rem;
  padding: 15px;
  cursor: pointer;
  color: #333;
  transition: background 0.2s;
  font-weight: 500;
}

.modal-btn.confirm {
    border-left: 1px solid #eee;
}

.modal-btn:active {
    background-color: #f5f5f5;
}
</style>
