<template>
  <div class="settings-page">
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

    <!-- Page Title Bar -->
    <div class="page-title-bar">
        <span>הגדרות כלליות</span>
        <div class="title-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </div>
    </div>

    <!-- Main Content -->
    <div class="content-scroll">
        
        <div class="settings-body">
            
            <!-- Action Buttons (Moved to Top) -->
            <div class="actions-row" style="margin-bottom: 20px;">
                 <button class="action-btn save" @click="saveChanges">עדכן</button>
                <button class="action-btn cancel" @click="cancelChanges">ביטול</button>
            </div>
            <!-- Fixed Break -->
            <div class="setting-row">
                 <div class="setting-info">
                    <div class="setting-title">הפסקה קבועה</div>
                    <div class="setting-sub">
                        נא להכניס דקות להפסקה קבועה.
                        <br>
                        <span style="font-size: 0.85rem; color: #ff5252;">(הפעלה שוות ערך להורדה מזמן העבודה)</span>
                    </div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" v-model="form.fixedBreak">
                    <span class="slider round"></span>
                </label>
            </div>
             <div class="counter-row">
                <button class="counter-btn" @click="updateFixedBreak(-5)">-</button>
                <span class="counter-val">{{ form.fixedBreakMinutes }}</span>
                <button class="counter-btn" @click="updateFixedBreak(5)">+</button>
            </div>

            <!-- Recuperation Payment -->
            <div class="setting-block top-border">
                <div class="setting-title-center">תשלום הבראה</div>
                <div class="setting-sub-center">נא להכניס סכום לתשלום יום הבראה.</div>
                <div class="input-wrapper-center">
                    <div class="currency-box">
                        <span class="currency-symbol">₪</span>
                        <input type="number" v-model="form.recuperationValue" class="clean-input">
                    </div>
                </div>
            </div>

            <!-- Unpaid Leave -->
             <div class="setting-block top-border">
                <div class="setting-title-center">יום חופש ללא תשלום</div>
                <div class="setting-sub-center">אפשר יום חופש ללא תשלום</div>
                <div class="input-wrapper-center">
                    <label class="checkbox-container">
                        <input type="checkbox" v-model="form.allowUnpaidLeave">
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>

            <!-- Vacation Day -->
            <!-- Vacation Day -->
            <div class="setting-block">
                <div class="setting-title-center">יום חופש</div>
                <div class="setting-sub-center">נא להכניס שעות ואחוזים ליום חופש.</div>
                <div class="double-input-row centered-row">
                     <div class="input-group">
                        <input type="text" v-model="form.vacationDay.hours" class="box-input" readonly @click="openTimePicker('vacationDay')">
                        <span class="red-label">שעות:</span>
                    </div>
                    <div class="input-group">
                        <input type="number" v-model="form.vacationDay.percent" class="box-input">
                        <span class="red-label">אחוזים:</span>
                    </div>
                </div>
            </div>

             <!-- Holiday -->
            <div class="setting-block top-border">
                <div class="setting-title-center">יום חג</div>
                <div class="setting-sub-center">נא להכניס שעות ואחוזים ליום חג.</div>
                <div class="double-input-row centered-row">
                     <div class="input-group">
                        <input type="text" v-model="form.holiday.hours" class="box-input" readonly @click="openTimePicker('holiday')">
                        <span class="red-label">שעות:</span>
                    </div>
                    <div class="input-group">
                        <input type="number" v-model="form.holiday.percent" class="box-input">
                        <span class="red-label">אחוזים:</span>
                    </div>
                </div>
            </div>

            <!-- Sick Days -->
            <div class="setting-block top-border">
                <div class="setting-title-center">יום מחלה ראשון</div>
                <div class="setting-sub-center">נא להכניס שעות ואחוזים ליום מחלה ראשון.</div>
                <div class="double-input-row centered-row">
                     <div class="input-group">
                        <input type="text" v-model="form.sickDay1.hours" class="box-input" readonly @click="openTimePicker('sickDay1')">
                        <span class="red-label">שעות:</span>
                    </div>
                    <div class="input-group">
                        <input type="number" v-model="form.sickDay1.percent" class="box-input">
                        <span class="red-label">אחוזים:</span>
                    </div>
                </div>
            </div>
             <div class="setting-block top-border">
                <div class="setting-title-center">יום מחלה שני</div>
                <div class="setting-sub-center">נא להכניס שעות ואחוזים ליום מחלה שני.</div>
                <div class="double-input-row centered-row">
                     <div class="input-group">
                        <input type="text" v-model="form.sickDay2.hours" class="box-input" readonly @click="openTimePicker('sickDay2')">
                        <span class="red-label">שעות:</span>
                    </div>
                    <div class="input-group">
                        <input type="number" v-model="form.sickDay2.percent" class="box-input">
                        <span class="red-label">אחוזים:</span>
                    </div>
                </div>
            </div>
             <div class="setting-block top-border">
                <div class="setting-title-center">יום מחלה שלישי</div>
                <div class="setting-sub-center">נא להכניס שעות ואחוזים ליום מחלה שלישי.</div>
                <div class="double-input-row centered-row">
                     <div class="input-group">
                        <input type="text" v-model="form.sickDay3.hours" class="box-input" readonly @click="openTimePicker('sickDay3')">
                        <span class="red-label">שעות:</span>
                    </div>
                    <div class="input-group">
                        <input type="number" v-model="form.sickDay3.percent" class="box-input">
                        <span class="red-label">אחוזים:</span>
                    </div>
                </div>
            </div>
             <div class="setting-block top-border">
                <div class="setting-title-center">יום מחלה רביעי והלאה</div>
                <div class="setting-sub-center">נא להכניס שעות ואחוזים ליום מחלה רביעי והלאה.</div>
                <div class="double-input-row centered-row">
                     <div class="input-group">
                        <input type="text" v-model="form.sickDay4.hours" class="box-input" readonly @click="openTimePicker('sickDay4')">
                        <span class="red-label">שעות:</span>
                    </div>
                    <div class="input-group">
                        <input type="number" v-model="form.sickDay4.percent" class="box-input">
                        <span class="red-label">אחוזים:</span>
                    </div>
                </div>
            </div>



        </div>
    </div>

    <!-- Bottom Scrollable Tabs -->
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
        <button class="bottom-tab" @click="$router.push('/tax-deductions')">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            <span>מס הכנסה</span>
        </button>
        <button class="bottom-tab active">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>כללי</span>
        </button>
        </div>
    </div>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" v-if="isMenuOpen" @click="isMenuOpen = false"></div>

    <!-- Time Picker Modal -->
    <div v-if="isTimeModalOpen" class="input-modal-overlay" @click.self="isTimeModalOpen = false">
        <div class="input-modal">
            <div class="input-modal-title">
                בחר שעות
            </div>
            <div class="input-title-divider"></div>
            
            <div class="time-modal-body">
                <div class="time-picker-container">
                    <!-- Hours -->
                    <div class="time-column">
                        <div class="time-cell prev" @click="adjustTime('hour', -1)">{{ prevHour }}</div>
                        <div class="time-cell current">
                            <input type="number" v-model="tempHour" class="time-input" @blur="formatInput('hour')" @focus="$event.target.select()">
                        </div>
                        <div class="time-cell next" @click="adjustTime('hour', 1)">{{ nextHour }}</div>
                    </div>
                    
                    <div class="time-separator">:</div>

                    <!-- Minutes -->
                    <div class="time-column">
                        <div class="time-cell prev" @click="adjustTime('minute', -1)">{{ prevMinute }}</div>
                        <div class="time-cell current">
                             <input type="number" v-model="tempMinute" class="time-input" @blur="formatInput('minute')" @focus="$event.target.select()">
                        </div>
                        <div class="time-cell next" @click="adjustTime('minute', 1)">{{ nextMinute }}</div>
                    </div>
                </div>
                
                <div class="time-selection-lines">
                    <div class="line top"></div>
                    <div class="line bottom"></div>
                </div>
            </div>
            
            <div class="input-modal-footer">
                <button class="modal-btn confirm" @click="confirmTime">אישור</button>
                <button class="modal-btn cancel" @click="isTimeModalOpen = false">ביטול</button>
            </div>
        </div>
    </div>

    <Sidebar 
      :isOpen="isMenuOpen" 
      @update:isOpen="isMenuOpen = $event" 
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Sidebar from '../components/Sidebar.vue';

const router = useRouter();
const store = useStore();
const isMenuOpen = ref(false);

const form = ref({
    pushNotifications: true,
    workTimeMinutes: 0,
    fixedBreak: false,
    fixedBreakMinutes: 0,
    recuperationValue: 378,
    allowUnpaidLeave: false,
    vacationDay: { hours: '08:00', percent: 100 },
    holiday: { hours: '08:00', percent: 100 },
    sickDay1: { hours: '08:00', percent: 0 },
    sickDay2: { hours: '08:00', percent: 50 },
    sickDay3: { hours: '08:00', percent: 50 },
    sickDay4: { hours: '08:00', percent: 100 },
    jobDescriptions: {}
});

const isTimeModalOpen = ref(false);
const tempHour = ref('08');
const tempMinute = ref('00');
const editingField = ref(null);

const prevHour = computed(() => {
    let h = parseInt(tempHour.value) - 1;
    if (h < 0) h = 23;
    return h.toString().padStart(2, '0');
});

const nextHour = computed(() => {
    let h = parseInt(tempHour.value) + 1;
    if (h > 23) h = 0;
    return h.toString().padStart(2, '0');
});

const prevMinute = computed(() => {
    let m = parseInt(tempMinute.value) - 1;
    if (m < 0) m = 59;
    return m.toString().padStart(2, '0');
});

const nextMinute = computed(() => {
    let m = parseInt(tempMinute.value) + 1;
    if (m > 59) m = 0;
    return m.toString().padStart(2, '0');
});

const openTimePicker = (field) => {
    editingField.value = field;
    let currentVal = "08:00";
    if (field === 'vacationDay') currentVal = form.value.vacationDay.hours;
    else if (field === 'holiday') currentVal = form.value.holiday.hours;
    else if (field === 'sickDay1') currentVal = form.value.sickDay1.hours;
    else if (field === 'sickDay2') currentVal = form.value.sickDay2.hours;
    else if (field === 'sickDay3') currentVal = form.value.sickDay3.hours;
    else if (field === 'sickDay4') currentVal = form.value.sickDay4.hours;

    if (!currentVal) currentVal = "08:00";
    const parts = currentVal.split(':');
    tempHour.value = parts[0] || '08';
    tempMinute.value = parts[1] || '00';
    isTimeModalOpen.value = true;
};

const adjustTime = (unit, delta) => {
    if (unit === 'hour') {
        let h = parseInt(tempHour.value) + delta;
        if (h > 23) h = 0;
        if (h < 0) h = 23;
        tempHour.value = h.toString().padStart(2, '0');
    } else {
        let m = parseInt(tempMinute.value) + delta;
        if (m > 59) m = 0;
        if (m < 0) m = 59;
        tempMinute.value = m.toString().padStart(2, '0');
    }
};

const formatInput = (unit) => {
    if (unit === 'hour') {
        let h = parseInt(tempHour.value);
        if (isNaN(h)) h = 0;
        if (h > 23) h = 0; // wrap or cap? Image shows wrapping logic in roller, but input usually caps. Use loose.
        if (h < 0) h = 0;
        tempHour.value = h.toString().padStart(2, '0');
    } else {
        let m = parseInt(tempMinute.value);
        if (isNaN(m)) m = 0;
        if (m > 59) m = 59; // Cap minutes
        if (m < 0) m = 0;
        tempMinute.value = m.toString().padStart(2, '0');
    }
};

const confirmTime = () => {
    const newVal = `${tempHour.value}:${tempMinute.value}`;
    if (editingField.value === 'vacationDay') form.value.vacationDay.hours = newVal;
    else if (editingField.value === 'holiday') form.value.holiday.hours = newVal;
    else if (editingField.value === 'sickDay1') form.value.sickDay1.hours = newVal;
    else if (editingField.value === 'sickDay2') form.value.sickDay2.hours = newVal;
    else if (editingField.value === 'sickDay3') form.value.sickDay3.hours = newVal;
    else if (editingField.value === 'sickDay4') form.value.sickDay4.hours = newVal;
    
    isTimeModalOpen.value = false;
};

const initForm = () => {
    const settings = store.getters.generalSettings;
    // Deep copy to break reactivity references during editing
    form.value = JSON.parse(JSON.stringify(settings));
    // Default job descriptions if missing
    if (!form.value.jobDescriptions) {
        form.value.jobDescriptions = {};
    }
};


onMounted(() => {
   initForm();
});

const updateWorkTime = (delta) => {
    form.value.workTimeMinutes += delta;
};

const updateFixedBreak = (delta) => {
     form.value.fixedBreakMinutes = Math.max(0, form.value.fixedBreakMinutes + delta);
};

const saveChanges = async () => {
    try {
        store.commit('SET_GENERAL_SETTINGS_BULK', JSON.parse(JSON.stringify(form.value)));
        
        // Sync Fixed Break to Additions/Deductions list
        await store.dispatch('syncFixedBreakDeduction', { 
            enabled: form.value.fixedBreak, 
            minutes: form.value.fixedBreakMinutes 
        });

        await store.dispatch('saveAllSettings');
        store.dispatch('showToast', { message: 'הגדרות נשמרו בהצלחה', type: 'success' });
    } catch (e) {
        console.error("Failed to save settings", e);
        store.dispatch('showToast', { message: 'שגיאה בשמירת הגדרות', type: 'error' });
    }
};

const cancelChanges = () => {
    initForm();
    // No confirm per user request for cancel actions
};


// Logout handled by Sidebar
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

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
    padding: 10px 0;
    text-align: right; /* Default RTL alignment */
}

.instruction-text {
    color: #666;
    margin-bottom: 20px;
    font-size: 1rem;
    padding: 0 20px;
}

/* Setting Rows */
.setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
}
.setting-row.top-border {
    border-top: 1px solid #eee;
}

.setting-info {
    flex: 1;
}

.setting-title {
    font-weight: 700;
    font-size: 1rem;
    color: #333;
    margin-bottom: 4px;
}

.setting-sub {
    font-size: 0.9rem;
    color: #666;
}

/* Toggles */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
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
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #4CAF50; /* Green */
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Checkbox */
.checkbox-container {
    display: block;
    position: relative;
    padding-right: 35px; /* RTL checkbox */
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    user-select: none;
    width: 30px;
    height: 30px;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 0;
    right: 0; /* RTL */
    height: 24px;
    width: 24px;
    background-color: white;
    border: 2px solid #ccc;
    border-radius: 4px;
}

.checkbox-container:hover input ~ .checkmark {
    background-color: #f0f0f0;
}

.checkbox-container input:checked ~ .checkmark {
    background-color: #0093AB;
    border-color: #0093AB;
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
    display: block;
}

.checkbox-container .checkmark:after {
    left: 8px;
    top: 4px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}


/* Counters */
.counter-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    padding: 0 20px 20px 20px;
}

.counter-btn {
    width: 40px;
    height: 40px;
    background-color: #555; /* Dark grey */
    color: white;
    font-size: 1.5rem;
    border: none;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.counter-val {
    font-size: 1.2rem;
    font-weight: 500;
    min-width: 30px;
    text-align: center;
}

/* Centered Blocks (Recuperation) */
.setting-block {
    padding: 20px;
}
.setting-block.top-border {
     border-top: 1px solid #eee;
}

.setting-title-center {
    font-weight: 700;
    font-size: 1rem;
    color: #333;
    text-align: center;
    margin-bottom: 4px;
}
.setting-sub-center {
    font-size: 0.9rem;
    color: #666;
    text-align: center;
    margin-bottom: 15px;
}

.input-wrapper-center {
    display: flex;
    justify-content: center;
}

.currency-box {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 120px;
    justify-content: center;
}

.clean-input {
    border: none;
    outline: none;
    font-size: 1.1rem;
    width: 60px;
    text-align: center;
    font-family: inherit;
}

/* Right Aligned Blocks (Sick/Vacation) */
.setting-title-right {
    font-weight: 700;
    font-size: 1rem;
    color: #333;
    text-align: right;
    margin-bottom: 4px; 
}
.setting-sub-right {
    font-size: 0.9rem;
    color: #666;
    text-align: right;
    margin-bottom: 15px; 
}

.double-input-row {
     display: flex;
     justify-content: flex-start; /* Default alignment */
     gap: 20px;
     margin-top: 10px;
 }
 .double-input-row.centered-row {
     justify-content: center;
 }

.input-group {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.box-input {
    width: 80px;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
    font-size: 1rem;
    outline: none;
    margin-bottom: 4px;
}

.red-label {
    color: #ea4335; /* Google Red-ish */
    font-size: 0.8rem;
    font-weight: 500;
}

/* Jobs Grid */
.jobs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 10px;
}

.job-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
    font-size: 0.9rem;
    outline: none;
}

/* Actions */
.actions-row {
     display: flex;
    justify-content: space-between;
    padding: 20px;
    margin-top: 10px;
    gap: 15px;
}

.action-btn {
    flex: 1;
    padding: 12px;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
}

.action-btn.cancel {
    background-color: #e0e0e0;
    color: #333;
}

/* Actions */
.actions-row {
    padding: 20px;
    display: flex;
    gap: 15px;
    justify-content: center;
    background-color: white;
    /* Removed margin-top and space-between to match Tax view footer style */
}

.action-btn {
    flex: 1;
    padding: 12px;
    border-radius: 5px; /* Rounded corners like Tax view */
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    max-width: 200px; /* Constrain width */
}

.action-btn.cancel {
    background-color: #f0f0f0;
    color: #333;
}

.action-btn.save {
     background-color: #5ab9c9; /* Matching teal color */
     color: white;
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
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    scrollbar-width: none; /* Firefox */
}
.bottom-tabs-container::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
}

.bottom-tabs-scroll {
    display: flex;
    flex-direction: row-reverse; /* RTL Order */
    height: 100%;
    min-width: 100%; /* Ensure full width used */
    width: max-content; /* Allow content to overflow horizontally */
}

.bottom-tab {
    flex: 1 0 100px; /* Grow to fill, but minimum 100px basis */
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
    padding: 0 16px; /* Horizontal padding for spacing */
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



/* Modal Styles Reuse */
.input-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.input-modal {
  background: white;
  width: 90%;
  max-width: 320px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

.input-modal-title {
  padding: 15px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.input-title-divider {
  height: 2px;
  background-color: #5ab9c9;
  width: 100%;
}

.time-modal-body {
  padding: 20px;
  display: flex;
  justify-content: center;
  position: relative;
}

.time-picker-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    z-index: 2;
    direction: ltr;
}

.time-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.time-picker-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px; /* Increased gap */
    z-index: 2;
    direction: ltr;
}

.time-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px; /* Increased Vertical Gap */
    width: 60px; /* Fixed width */
}

.time-cell {
    font-size: 1.1rem;
    color: #999; /* Grey from image */
    cursor: pointer;
    user-select: none;
    transition: all 0.2s;
}

.time-cell.current {
    font-size: 1rem; /* Reset font size for container */
    color: #333;
    pointer-events: auto; /* Allow input interaction */
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
}

.time-input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    font-size: 2.2rem; /* Big */
    font-weight: 400; /* Regular weight */
    text-align: center;
    color: #333;
    outline: none;
    padding: 0;
    margin: 0;
    font-family: inherit;
}

.time-input:focus {
    background-color: #3b71ca; /* Blue Selection Background */
    color: white;
    border-radius: 2px; /* Slight rounding or sharp */
}

/* Hide spinners */
.time-input::-webkit-outer-spin-button,
.time-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.time-input {
  -moz-appearance: textfield;
}

.time-separator {
    font-size: 2.2rem;
    font-weight: 400;
    margin-bottom: 5px;
    color: #333;
}

.time-selection-lines {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%; /* Wider lines */
    height: 60px; /* Match input height roughly */
    pointer-events: none;
    z-index: 1;
}

.time-selection-lines .line {
    position: absolute;
    width: 100%;
    height: 2px; /* Thicker */
    background-color: #4dd0e1; /* Cyan/Turquoise from image */
    opacity: 0.8; /* More visible */
}

.time-selection-lines .line.top { top: 0; }
.time-selection-lines .line.bottom { bottom: 0; }


.input-modal-footer {
    display: flex;
    border-top: 1px solid #eee;
}

.modal-btn {
    flex: 1;
    padding: 15px;
    border: none;
    background: white;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.modal-btn.confirm {
    color: #5ab9c9;
    border-right: 1px solid #eee; /* RTL */
    font-weight: bold;
}

.modal-btn.cancel {
    color: #666;
}

.modal-btn:active {
    background-color: #f9f9f9;
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

/* Bottom Tabs */
.bottom-tabs-container {
    height: 70px;
    background-color: #0093AB;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    overflow-x: auto; /* Scrollable horizontal */
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    direction: rtl;

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
    flex-direction: row; /* Standard row */
    height: 100%;
    min-width: 100%;
    width: max-content;
}

.bottom-tab {
    flex: 0 0 auto;
    width: 100px; /* Fixed width */
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
