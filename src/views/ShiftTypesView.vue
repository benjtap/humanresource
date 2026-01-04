<template>
  <div class="shift-types-page">
    <!-- Header -->
    <header class="app-header">
        <button class="icon-btn back-btn" @click="$router.back()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <div class="header-title">סוגי משמרות</div>
        <div class="header-spacer"></div>
    </header>

    <!-- Main Content -->
    <div class="content-container">
        
        <!-- Info Section -->
        <div class="info-section">
            <h2 class="info-title">סוגי משמרת</h2>
            <p class="info-text">
                כאן ניתן להגדיר מספר בלתי מוגבל של כל סוגי המשמרות שתרצו,
                כגון משמרת בוקר, לילה, צהריים, מוצש, ועוד.
            </p>
            <p class="info-text">
                כדי לשנות את ההגדרות של המשמרת יש לבחור אותה מהרשימה.
            </p>
        </div>

        <div class="separator-line"></div>

        <!-- Shift List -->
        <div class="shift-list">
            <div v-for="type in shiftTypes" :key="type.id" class="shift-item" @click="editShiftType(type)">
                <span class="shift-name-text">{{ type.name }}</span>
                <button v-if="type.name !== 'בוקר'" class="delete-shift-btn" @click.stop="deleteShiftType(type)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
             <!-- Empty placeholder rows to fill separation lines if needed visually, but list is enough -->
        </div>

    </div>

    <!-- Bottom Action Area -->
    <div class="bottom-action-area">
        <button class="new-shift-btn" @click="createNewShiftType">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="12" y1="14" x2="12" y2="18"></line><line x1="10" y1="16" x2="14" y2="16"></line></svg>
            סוג משמרת חדשה
        </button>
    </div>

    <!-- New Shift Type Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
            <div class="modal-header">
                הגדרת משמרת
            </div>
            
            <div class="modal-body">
                <!-- Name and Color Row -->
                <div class="name-color-row">
                    <div class="name-input-wrapper">
                         <input type="text" v-model="shiftName" class="name-input">
                    </div>
                    <div class="name-label">שם המשמרת:</div>
                </div>

                <!-- Time Inputs Row -->
                <div class="timings-row">
                    <!-- Entry (Right Side in RTL) -->
                    <div class="time-block">
                        <div class="time-box" @click="openTimePicker('entry')">
                             <input type="text" v-model="defaultEntry" class="time-input-native" readonly>
                        </div>
                        <span class="red-label">כניסה:</span>
                    </div>

                    <!-- Exit (Left Side in RTL) -->
                    <div class="time-block">
                        <div class="time-box" @click="openTimePicker('exit')">
                             <input type="text" v-model="defaultExit" class="time-input-native" readonly>
                        </div>
                        <span class="red-label">יציאה:</span>
                    </div>
                </div>

                <!-- Rate Inputs -->
                <div class="rate-rows">
                    <!-- Break -->
                    <div class="rate-row">
                        <label>הפסקה (דק'):</label>
                        <div class="input-box-wrapper" @click="openBreakModal">
                            <input type="number" v-model="breakTime" class="rate-input" readonly>
                        </div>
                    </div>
                    
                    <!-- Extra -->
                    <div class="rate-row">
                        <label>תוספת יומית (ש"ח):</label>
                        <div class="input-box-wrapper" @click="openExtraModal">
                            <input type="number" v-model="extraAmount" class="rate-input" readonly>
                        </div>
                    </div>

                    <!-- Deduction -->
                    <div class="rate-row">
                        <label>הורדה יומית (ש"ח):</label>
                        <div class="input-box-wrapper" @click="openDeductionModal">
                            <input type="number" v-model="deductionAmount" class="rate-input" readonly>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Footer Actions -->
            <!-- Footer Actions -->
            <div class="modal-footer">
                <button class="footer-btn approve" @click="saveNewShiftType">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    אישור
                </button>
                <div class="footer-divider"></div>
                <button class="footer-btn cancel" @click="closeModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    ביטול
                </button>
            </div>
        </div>
    </div>

    <!-- Break (הפסקה) Modal -->
    <div v-if="isBreakModalOpen" class="input-modal-overlay" @click.self="cancelBreakModal">
        <div class="input-modal">
          <div class="input-modal-title">הפסקה</div>
          <div class="input-title-divider"></div>
          
          <div class="input-modal-body">
            <p class="input-instruction">נא להכניס זמן הפסקה</p>
            <input 
                type="number" 
                v-model="breakModalValue" 
                class="modal-input" 
                placeholder="זמן הפסקה בדקות"
                ref="breakInputRef"
            />
            <div class="input-line"></div>
          </div>
          
          <div class="input-modal-footer">
            <button class="modal-btn confirm" @click="confirmBreakModal">אישור</button>
            <button class="modal-btn cancel" @click="cancelBreakModal">ביטול</button>
          </div>
        </div>
    </div>

    <!-- Extra (הוספה) Modal -->
    <div v-if="isExtraModalOpen" class="input-modal-overlay" @click.self="cancelExtraModal">
        <div class="input-modal">
          <div class="input-modal-title">הוספה</div>
          <div class="input-title-divider"></div>
          
          <div class="input-modal-body">
            <p class="input-instruction">נא להכניס הוספה יומית</p>
            <input 
                type="number" 
                v-model="extraModalValue" 
                class="modal-input" 
                placeholder="הוספה יומית"
                ref="extraInputRef"
            />
            <div class="input-line"></div>
          </div>
          
          <div class="input-modal-footer">
            <button class="modal-btn confirm" @click="confirmExtraModal">אישור</button>
            <button class="modal-btn cancel" @click="cancelExtraModal">ביטול</button>
          </div>
        </div>
    </div>

    <!-- Deduction (הורדה) Modal -->
    <div v-if="isDeductionModalOpen" class="input-modal-overlay" @click.self="cancelDeductionModal">
        <div class="input-modal">
          <div class="input-modal-title">הורדה</div>
          <div class="input-title-divider"></div>
          
          <div class="input-modal-body">
            <p class="input-instruction">נא להכניס הורדה יומית</p>
            <input 
                type="number" 
                v-model="deductionModalValue" 
                class="modal-input" 
                placeholder="הורדה יומית"
                ref="deductionInputRef"
            />
            <div class="input-line"></div>
          </div>
          
          <div class="input-modal-footer">
            <button class="modal-btn confirm" @click="confirmDeductionModal">אישור</button>
            <button class="modal-btn cancel" @click="cancelDeductionModal">ביטול</button>
          </div>
        </div>
    </div>

    <!-- Custom Time Picker Modal -->
    <div v-if="isTimePickerOpen" class="picker-overlay" @click.self="closeTimePicker">
        <div class="picker-card">
            <div class="picker-header">
                {{ pickerTitle }}
            </div>
            
            <div class="picker-body">
                <div class="time-picker-container">
                   <!-- Hours -->
                   <div class="time-column">
                      <div class="time-cell prev" @click="adjustTime('hour', -1)">{{ prevHour }}</div>
                      <div class="time-cell current">
                        <input type="number" v-model="tempHour" @blur="formatTimeInputs" class="time-input"/>
                      </div>
                      <div class="time-cell next" @click="adjustTime('hour', 1)">{{ nextHour }}</div>
                   </div>
                   
                   <div class="time-colon">:</div>

                   <!-- Minutes -->
                   <div class="time-column">
                      <div class="time-cell prev" @click="adjustTime('minute', -1)">{{ prevMinute }}</div>
                      <div class="time-cell current">
                        <input type="number" v-model="tempMinute" @blur="formatTimeInputs" class="time-input"/>
                      </div>
                      <div class="time-cell next" @click="adjustTime('minute', 1)">{{ nextMinute }}</div>
                   </div>
                </div>
                
                <div class="time-selection-lines">
                   <div class="line top"></div>
                   <div class="line bottom"></div>
                </div>
            </div>

             <div class="modal-footer">
                <button class="footer-btn approve" @click="confirmTimePicker">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    אישור
                </button>
                 <div class="footer-divider"></div>
                <button class="footer-btn cancel" @click="closeTimePicker">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    ביטול
                </button>
            </div>
        </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const shiftTypes = computed(() => store.getters.allShiftTypes); // Reactive from store

const isModalOpen = ref(false);
const shiftName = ref('');
const shiftColor = ref('#FFFFFF'); // Default circle color
const defaultEntry = ref('07:00');
const defaultExit = ref('16:15');
const breakTime = ref(0);
const extraAmount = ref(0);
const deductionAmount = ref(0);

// Break Modal Logic... (Keep existing)
// ... (Lines 185-285 are largely modal logic, keeping them as is by targeting around line 408)

// Jump to logic section
// ...
const editingTypeId = ref(null);

const editShiftType = (type) => {
    editingTypeId.value = type.id;
    shiftName.value = type.name;
    // Assuming mock data might hold these, or fallback
    defaultEntry.value = type.entry || '07:00';
    defaultExit.value = type.exit || '16:15';
    breakTime.value = type.break || 0;
    extraAmount.value = type.extra || 0;
    deductionAmount.value = type.deduction || 0;
    
    isModalOpen.value = true;
};

const deleteShiftType = (type) => {
    if (type.name === 'בוקר') {
        alert('לא ניתן למחוק משמרת בוקר');
        return;
    }
    if (confirm('האם למחוק סוג משמרת זה?')) {
        store.dispatch('deleteShiftType', type.id);
    }
};

const createNewShiftType = () => {
    editingTypeId.value = null;
    // Reset defaults
    shiftName.value = '';
    shiftColor.value = '#FFFFFF';
    defaultEntry.value = '07:00';
    defaultExit.value = '16:15';
    breakTime.value = 0;
    extraAmount.value = 0;
    deductionAmount.value = 0;
    isModalOpen.value = true;
};

const saveNewShiftType = () => {
    if (!shiftName.value) {
        alert('נא להזין שם משמרת');
        return;
    }

    const data = {
        name: shiftName.value,
        entry: defaultEntry.value,
        exit: defaultExit.value,
        break: breakTime.value,
        extra: extraAmount.value,
        deduction: deductionAmount.value
    };

    if (editingTypeId.value) {
        // Update
        store.dispatch('updateShiftType', { id: editingTypeId.value, ...data });
    } else {
        // Create
        const newId = Math.max(0, ...shiftTypes.value.map(t => t.id)) + 1;
        store.dispatch('addShiftType', { id: newId, ...data });
    }

    isModalOpen.value = false;
};

const closeModal = () => {
    isModalOpen.value = false;
};

// Break Modal Logic
const isBreakModalOpen = ref(false);
const breakModalValue = ref('');
const breakInputRef = ref(null);

const openBreakModal = () => {
  breakModalValue.value = breakTime.value;
  isBreakModalOpen.value = true;
  nextTick(() => {
    breakInputRef.value?.focus();
  });
};

const confirmBreakModal = () => {
    breakTime.value = breakModalValue.value; 
    isBreakModalOpen.value = false;
};

const cancelBreakModal = () => {
    isBreakModalOpen.value = false;
};

// Extra Modal Logic
const isExtraModalOpen = ref(false);
const extraModalValue = ref('');
const extraInputRef = ref(null);

const openExtraModal = () => {
  extraModalValue.value = extraAmount.value;
  isExtraModalOpen.value = true;
  nextTick(() => {
    extraInputRef.value?.focus();
  });
};

const confirmExtraModal = () => {
    extraAmount.value = extraModalValue.value; 
    isExtraModalOpen.value = false;
};

const cancelExtraModal = () => {
    isExtraModalOpen.value = false;
};

// Deduction Modal Logic
const isDeductionModalOpen = ref(false);
const deductionModalValue = ref('');
const deductionInputRef = ref(null);

const openDeductionModal = () => {
  deductionModalValue.value = deductionAmount.value;
  isDeductionModalOpen.value = true;
  nextTick(() => {
    deductionInputRef.value?.focus();
  });
};

const confirmDeductionModal = () => {
    deductionAmount.value = deductionModalValue.value; 
    isDeductionModalOpen.value = false;
};

const cancelDeductionModal = () => {
    isDeductionModalOpen.value = false;
};

// Time Picker State
const isTimePickerOpen = ref(false);
const pickerTarget = ref(null); // 'entry' or 'exit'
const pickerTitle = ref('');
const tempHour = ref('00');
const tempMinute = ref('00');

// Computed neighbors for visual spinner effect
const prevHour = computed(() => {
  const h = parseInt(tempHour.value);
  const prev = (h - 1 + 24) % 24;
  return prev.toString().padStart(2, '0');
});

const nextHour = computed(() => {
  const h = parseInt(tempHour.value);
  const next = (h + 1) % 24;
  return next.toString().padStart(2, '0');
});

const prevMinute = computed(() => {
  const m = parseInt(tempMinute.value);
  const prev = (m - 1 + 60) % 60;
  return prev.toString().padStart(2, '0');
});

const nextMinute = computed(() => {
  const m = parseInt(tempMinute.value);
  const next = (m + 1) % 60;
  return next.toString().padStart(2, '0');
});

const adjustTime = (unit, delta) => {
    if (unit === 'hour') {
        let val = parseInt(tempHour.value) + delta;
        val = (val + 24) % 24;
        tempHour.value = val.toString().padStart(2, '0');
    } else {
        let val = parseInt(tempMinute.value) + delta;
        val = (val + 60) % 60;
        tempMinute.value = val.toString().padStart(2, '0');
    }
};

const formatTimeInputs = () => {
    // Ensure 2 digits
    let h = parseInt(tempHour.value);
    if (isNaN(h)) h = 0;
    tempHour.value = Math.min(23, Math.max(0, h)).toString().padStart(2, '0');

    let m = parseInt(tempMinute.value);
    if (isNaN(m)) m = 0;
    tempMinute.value = Math.min(59, Math.max(0, m)).toString().padStart(2, '0');
};

const openTimePicker = (target) => {
    pickerTarget.value = target;
    pickerTitle.value = target === 'entry' ? 'זמן כניסה' : 'זמן יציאה';
    const timeStr = target === 'entry' ? defaultEntry.value : defaultExit.value;
    const [h, m] = timeStr.split(':');
    tempHour.value = h;
    tempMinute.value = m;
    isTimePickerOpen.value = true;
};

const closeTimePicker = () => {
    isTimePickerOpen.value = false;
};

const confirmTimePicker = () => {
    formatTimeInputs();
    const newVal = `${tempHour.value}:${tempMinute.value}`;
    if (pickerTarget.value === 'entry') defaultEntry.value = newVal;
    else defaultExit.value = newVal;
    isTimePickerOpen.value = false;
};




</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

.shift-types-page {
  font-family: 'Heebo', sans-serif;
  background-color: white; 
  height: 100vh;
  display: flex;
  flex-direction: column;
  direction: rtl;
  color: #333;
}
/* Header */
.app-header {
    background-color: #4DB6CD; 
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-title { font-size: 1.1rem; font-weight: 500; }
.icon-btn.back-btn { background: none; border: none; color: white; cursor: pointer; padding: 8px; display: flex; align-items: center; }
.header-spacer { width: 40px; }

/* Content */
.content-container { flex: 1; overflow-y: auto; background-color: white; }
.info-section { padding: 20px; }
.info-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 10px; margin-top: 0; color: #333; text-align: right; }
.info-text { font-size: 0.95rem; color: #555; line-height: 1.4; margin-bottom: 5px; text-align: right; }
.separator-line { height: 1px; background-color: #e0e0e0; margin: 0; }

/* List */
.shift-list { display: flex; flex-direction: column; }
.shift-item { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
    background: white;
}
.shift-item:hover { background-color: #f9f9f9; }

.shift-name-text {
    flex: 1;
    text-align: right; /* RTL */
    font-size: 1.1rem;
    color: #333;
}

.delete-shift-btn {
    background: none;
    border: none;
    padding: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}
.delete-shift-btn:hover {
    background-color: rgba(255, 82, 82, 0.1);
}

/* Bottom Action */
.bottom-action-area { padding: 20px; display: flex; justify-content: center; align-items: center; background-color: white; }
.new-shift-btn { background-color: #4DB6CD; color: white; border: none; border-radius: 4px; padding: 12px 20px; font-size: 1.1rem; font-family: inherit; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); cursor: pointer; flex: 1; max-width: 300px; }
.new-shift-btn:hover { background-color: #00ACC1; }
.btn-icon { stroke-width: 2.5; }

/* Modal Styling */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-card { background: white; width: 100%; max-width: 340px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; flex-direction: column; }
.modal-header { background-color: #4DB6CD; color: white; text-align: center; padding: 12px; font-size: 1.1rem; font-weight: 500; }
.modal-body { padding: 20px; text-align: center; background: #fff; border-bottom: 1px solid #eee; }

/* Times Row */
.timings-row {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 25px;
    padding: 0 10px;
}

.time-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.time-box {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px;
    width: 100%;
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
}


.time-input-native {
    border: none;
    font-size: 1.6rem;
    font-family: inherit;
    text-align: center;
    width: 100%;
    outline: none;
    color: #333;
    background: transparent;
    cursor: pointer;
}

.red-label {
    color: #e53935; /* Red per image */
    font-size: 0.95rem;
    font-weight: 500;
}

/* Rate Rows */
.rate-rows {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0 5px;
}

.rate-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.rate-row label {
    font-size: 1rem;
    color: #555;
    text-align: right;
    flex: 1; /* Pushes input group to left */
}


.input-box-wrapper {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px;
    width: 80px;
    display: flex;
    justify-content: center;
}

.rate-input {
    border: none;
    width: 100%;
    text-align: center;
    font-size: 1.1rem;
    outline: none;
    font-family: inherit;
    color: #333;
}

.modal-footer {
    display: flex;
    height: 50px;
}

.footer-btn {
    flex: 1;
    border: none;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
    font-weight: 500;
}

.footer-btn.approve { background-color: #00ACC1; }
.footer-btn.cancel { background-color: #00ACC1; border-right: 1px solid rgba(0,0,0,0.1); }

/* --- Picker Specific Styles --- */
.picker-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background-color: rgba(0,0,0,0.5); 
    display: flex; align-items: center; justify-content: center; 
    z-index: 2000; /* Above modal */
}
.picker-card {
    background: white; width: 280px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
    display: flex; flex-direction: column;
}
.picker-header {
    text-align: right; padding: 20px; color: #4DB6CD; /* Cyan Text */
    font-size: 1.4rem; font-weight: 500;
    border-bottom: 2px solid #4DB6CD; 
    background: white;
}
.picker-body {
    padding: 30px 20px;
    position: relative;
    display: flex;
    justify-content: center;
    background: #fff;
    direction: ltr; /* Ensure HH:MM order */
}

/* Reusing ShiftsView Styles */
.time-picker-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    z-index: 2; /* Above lines */
}


/* Name and Color Row Styles */
.name-color-row {
    display: flex;
    align-items: center;
    justify-content: flex-end; 
    flex-direction: row-reverse; /* HTML: Input, Label -> RTL: Input(R), Label(L)? No. See thought process. Visual: Input(Left), Label(Right). */
    gap: 15px;
    padding: 25px 20px; /* Increased top/bottom padding */
    margin-bottom: 10px; /* Extra spacing from line below */
}

.name-label {
    font-size: 1rem;
    color: #666;
    font-weight: 500;
}

.name-input {
    border: 1px solid #eee;
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 1rem;
    width: 140px;
    outline: none;
    text-align: right;
    color: #333;
    font-family: inherit;
}



/* Update Modal Header to match image cyan */
.modal-header {
    background-color: #4DB6CD;
    color: white;
    padding: 15px;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 500;
    border-bottom: none !important; /* Remove any border if exists */
}

.time-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.time-cell {
    font-family: 'Heebo', sans-serif;
    color: #999;
    font-size: 1.2rem;
    font-weight: 400;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s;
}

.time-cell.current {
    color: #333;
    font-size: 2rem;
    font-weight: 500;
    margin: 5px 0;
}

.time-input {
    border: none;
    text-align: center;
    font-size: 2rem;
    font-family: inherit;
    color: inherit;
    background: transparent;
    width: 60px;
    outline: none;
    font-weight: 500;
}

/* Chrome, Safari, Edge, Opera */
.time-input::-webkit-outer-spin-button,
.time-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
.time-input {
  -moz-appearance: textfield;
  appearance: textfield;
}

.time-colon {
    font-size: 2rem;
    font-weight: 500;
    color: #333;
    margin-top: -5px;
}

.time-selection-lines {
    position: absolute;
    top: 50%;
    left: 20px;
    right: 20px;
    transform: translateY(-50%);
    pointer-events: none;
    height: 60px; /* height of current area approx */
}

.line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #4DB6CD; /* Blue lines */
}

.line.top { top: 0; }

/* Generic Input Modal Styles (Copied from ShiftsView) */
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
  max-width: 340px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  padding: 0; 
  position: relative;
  background-color: white;
}

.input-modal-title {
  color: #29B6F6; /* Light Blue */
  font-size: 1.6rem;
  font-weight: 400;
  padding: 20px 20px 10px 20px;
  text-align: right;
}

.input-title-divider {
  height: 2px;
  background-color: #29B6F6;
  width: 100%;
}

.input-modal-body {
    padding: 20px;
}

.input-instruction {
  color: #333;
  margin: 0 0 30px 0;
  font-size: 1rem;
  text-align: right;
}

.modal-input {
  width: 100%;
  border: none;
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

.input-line {
  height: 2px;
  background-color: #29B6F6;
  width: 100%;
  margin-top: 0;
  margin-bottom: 20px;
}

.input-modal-footer {
  display: flex;
  border-top: 1px solid #eee;
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
}

.modal-btn.confirm {
    border-left: 1px solid #eee; 
    font-weight: 500;
}

.modal-btn:active {
    background-color: #f5f5f5;
}

</style>
