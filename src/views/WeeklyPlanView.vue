<template>
  <div class="weekly-plan-page">
    
    <!-- Top App Bar -->
    <header class="app-header">
        <button class="icon-btn back-btn" @click="goBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <div class="header-title">סידור עבודה</div>
        <div class="header-spacer"></div> <!-- Balance the back button -->
    </header>

    <!-- Week Selector Bar -->
    <div class="week-selector">
        <button class="arrow-btn" @click="nextWeek" v-if="showNavigation">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <div class="current-week-label">{{ weekRangeLabel }}</div>
        <button class="arrow-btn" @click="prevWeek" v-if="showNavigation">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
    </div>

    <!-- Main Content Container -->
    <div class="plan-content">
        <!-- Table Header -->
        <div class="plan-header-row">
            <div class="col-day">יום</div>
            <div class="col-shift">משמרת</div>
            <div class="col-time">כניסה</div>
            <div class="col-time">יציאה</div>
            <div class="col-status">סטטוס</div>
        </div>

        <!-- Table Body -->
        <div class="plan-body">
            <div v-for="(day, index) in currentPlan" :key="index" class="plan-row" :class="{ 'inactive': !day.isActive }">
                
                <!-- Day Name -->
                <div class="col-day title">{{ day.dayName }}</div>
                
                <!-- Shift Name (Readonly, triggers modal) -->
                <div class="col-shift">
                    <input type="text" v-model="day.shiftName" class="table-input" @click="openShiftModal(index)" readonly placeholder="משמרת">
                </div>

                <!-- Entry -->
                <div class="col-time">
                     <input type="time" v-model="day.entry" class="table-input time" readonly>
                </div>

                <!-- Exit -->
                <div class="col-time">
                     <input type="time" v-model="day.exit" class="table-input time" readonly>
                </div>

                <!-- Status (Checkbox) -->
                <div class="col-status">
                    <label class="checkbox-container">
                        <input type="checkbox" v-model="day.isActive">
                        <span class="checkmark"></span>
                        <span class="status-text" v-if="day.isActive">פעיל</span>
                    </label>
                </div>

            </div>
        </div>
    </div>

    <!-- Fixed Footer -->
    <div class="plan-footer">
        <button class="action-btn approve" @click="savePlan">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            אישור
        </button>
        <button class="action-btn cancel" @click="resetPlan">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ביטול
        </button>
        <button class="action-btn share" @click="sharePlan">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            שתף
        </button>
    </div>

    <!-- Shift Type Selection Modal -->
    <div v-if="showShiftModal" class="modal-overlay" @click.self="showShiftModal = false">
        <div class="modal-card">
            <div class="modal-title">נא לבחור סוג משמרת</div>
            <div class="modal-list">
                <div v-for="type in allShiftTypes" :key="type.id" class="modal-item" @click="selectShift(type.name)">
                     <label class="radio-label">
                        <span class="type-name">{{ type.name }}</span>
                        <input type="radio" name="shiftType" :value="type.name" :checked="selectedDayIndex !== null && currentPlan.length > 0 && currentPlan[selectedDayIndex].shiftName === type.name">
                        <span class="radio-custom"></span>
                     </label>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

const props = defineProps({
    planId: String,
    mode: String,
    isModal: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

const router = useRouter();
const route = useRoute();
const store = useStore();

const allPlans = computed(() => store.getters.allWeeklyPlans);
const allShiftTypes = computed(() => store.getters.allShiftTypes);

// State
const currentWeekStart = ref(new Date());
const currentPlanId = ref(null);
const isNewMode = ref(false);

const showShiftModal = ref(false);
const selectedDayIndex = ref(null);

// Helper
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 is Sunday
    const diff = d.getDate() - day; 
    return new Date(d.setDate(diff));
};

const dayNames = ['יום א', 'יום ב', 'יום ג', 'יום ד', 'יום ה', 'יום ו', 'שבת'];
const currentPlan = ref([]);

onMounted(() => {
    // Prioritize props for Modal usage needed by parent
    const id = props.planId || route.query.id;
    const mode = props.mode || route.query.mode;

    if (id) {
        currentPlanId.value = id;
        const found = allPlans.value.find(p => p.id === id);
        if (found) {
            currentWeekStart.value = new Date(found.weekStart);
            currentPlan.value = JSON.parse(JSON.stringify(found.days));
        }
    } else if (mode === 'new') {
        isNewMode.value = true;
        currentWeekStart.value = getStartOfWeek(new Date());
        generateTemplate();
    } else {
         generateTemplate();
    }
});

const generateTemplate = () => {
    currentPlan.value = dayNames.map(name => {
        const isShabbat = name === 'שבת';
        const shiftName = name === 'יום ו' ? 'יום ו' : 'בוקר';
        const type = allShiftTypes.value.find(t => t.name === shiftName);

        return {
            dayName: name,
            shiftName: shiftName,
            entry: isShabbat ? '--:--' : (type?.entry || '07:00'),
            exit: isShabbat ? '--:--' : (type?.exit || '17:15'),
            isActive: !isShabbat 
        };
    });
};

const weekRangeLabel = computed(() => {
    const start = new Date(currentWeekStart.value);
    const end = new Date(start);
    end.setDate(end.getDate() + 5); 
    const format = (d) => `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
    return `${format(start)} - ${format(end)}`;
});

const showNavigation = computed(() => {
    const m = props.mode || route.query.mode;
    return m === 'new';
});

const loadPlanForWeek = (date) => {
    // Reset time to compare dates only
    const d = new Date(date);
    d.setHours(0,0,0,0);
    
    // Find plan starting on this date
    // We compare weekStart timestamps
    const found = allPlans.value.find(p => {
        const pDate = new Date(p.weekStart);
        pDate.setHours(0,0,0,0);
        return pDate.getTime() === d.getTime();
    });

    if (found) {
        currentPlanId.value = found.id;
        currentWeekStart.value = new Date(found.weekStart);
        currentPlan.value = JSON.parse(JSON.stringify(found.days));
        isNewMode.value = false;
    } else {
        currentPlanId.value = null;
        isNewMode.value = true;
        currentWeekStart.value = d;
        generateTemplate();
    }
};

const prevWeek = () => {
    const d = new Date(currentWeekStart.value);
    d.setDate(d.getDate() - 7);
    loadPlanForWeek(d);
};

const nextWeek = () => {
    const d = new Date(currentWeekStart.value);
    d.setDate(d.getDate() + 7);
    loadPlanForWeek(d);
};

const validateTimes = (index) => {
    // Validation
};

const openShiftModal = (index) => {
    selectedDayIndex.value = index;
    showShiftModal.value = true;
};

const selectShift = (name) => {
    if (selectedDayIndex.value !== null) {
        const day = currentPlan.value[selectedDayIndex.value];
        day.shiftName = name;
        day.isActive = true;

        const type = allShiftTypes.value.find(t => t.name === name);
        if (type) {
             day.entry = type.entry;
             day.exit = type.exit;
        }

        showShiftModal.value = false;
    }
};

const checkOverlap = () => {
    const newStart = new Date(currentWeekStart.value);
    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + 5);
    newStart.setHours(0,0,0,0);
    newEnd.setHours(23,59,59,999);

    for (const plan of allPlans.value) {
        if (currentPlanId.value && plan.id === currentPlanId.value) continue;
        const existingStart = new Date(plan.weekStart);
        const existingEnd = new Date(plan.weekEnd);
        existingStart.setHours(0,0,0,0);
        existingEnd.setHours(23,59,59,999);
        
        if (newStart <= existingEnd && newEnd >= existingStart) {
            alert(`שגיאה: קיים כבר סידור עבודה שחופף לתאריכים אלו (${plan.label})`);
            return false;
        }
    }
    return true;
};

const savePlan = async () => {
    if (!checkOverlap()) return;
    
    const start = new Date(currentWeekStart.value);
    const end = new Date(start);
    end.setDate(end.getDate() + 5); 
    const format = (d) => `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`;
    const label = `${format(start)} - ${format(end)}`;

    const newEntry = {
        id: currentPlanId.value, // let backend generate if null? or store handles it? 
        // If creating new, id is null. Store action handles it.
        // If update, id is set.
        weekStart: currentWeekStart.value.toISOString(),
        weekEnd: end.toISOString(),
        label: label,
        days: JSON.parse(JSON.stringify(currentPlan.value))
    };

    try {
        if (currentPlanId.value) {
             await store.dispatch('updateWeeklyPlan', newEntry);
        } else {
             await store.dispatch('addWeeklyPlan', newEntry);
        }
    
        if (props.isModal) {
            emit('close');
        } else {
            router.back();
        }
    } catch (e) {
        console.error(e);
        alert('שגיאה בשמירת סידור עבודה');
    }
};

const sharePlan = () => {
    alert('Share functionality not implemented yet');
};

const resetPlan = () => {
    if (props.isModal) {
        emit('close');
    } else {
        router.back();
    }
};

const goBack = () => {
    if (props.isModal) {
        emit('close');
    } else {
        router.back();
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

.weekly-plan-page {
  font-family: 'Heebo', sans-serif;
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #333;
  direction: rtl;
}

/* App Header */
.app-header {
    background-color: #0093AB;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 10;
}

.header-title {
    font-size: 1.2rem;
    font-weight: bold;
}

.icon-btn.back-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
}

.header-spacer { width: 40px; }

/* Week Selector */
.week-selector {
    background-color: #00ABC1; /* Lighter teal */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    color: white;
    flex-shrink: 0;
}

.current-week-label {
    font-weight: 500;
    font-size: 1.1rem;
    letter-spacing: 0.5px;
}

.arrow-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 5px;
    opacity: 0.9;
}

.arrow-btn:hover { opacity: 1; }

/* Main Content */
.plan-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: white;
}

.plan-header-row {
    background-color: #E0F7FA;
    color: #00838F; /* Dark Teal text for contrast on light header */
    display: grid;
    grid-template-columns: 0.8fr 1.2fr 1fr 1fr 1.2fr;
    padding: 12px 10px;
    font-size: 0.9rem;
    font-weight: 700;
    text-align: center;
    border-bottom: 1px solid #B2EBF2;
}

.plan-body {
    flex: 1;
    overflow-y: auto;
}

.plan-row {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr 1fr 1fr 1.2fr;
    padding: 12px 10px;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
    text-align: center;
    font-size: 0.95rem;
}

.plan-row.inactive {
    background-color: #fafafa;
    opacity: 0.6;
}

.col-day.title {
    font-weight: 600;
    color: #444;
}

/* Inputs */
.table-input {
    width: 100%;
    border: none;
    padding: 4px;
    text-align: center;
    font-family: inherit;
    font-size: 0.95rem;
    background-color: transparent;
    color: #333;
    border-radius: 4px;
}

.table-input:focus {
    outline: none;
    background-color: #E0F7FA;
    border: 1px solid #B2EBF2;
}

.col-shift .table-input {
    cursor: pointer;
}

.table-input.time::-webkit-calendar-picker-indicator {
    display: none;
}

/* Checkbox */
.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input { display: none; }

.checkmark {
  height: 20px;
  width: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
  background-color: white;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #0093AB;
  border-color: #0093AB;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.status-text {
    font-size: 0.9rem;
    color: #0093AB;
    font-weight: 500;
}

/* Footer (Sticky at bottom) */
.plan-footer {
    display: flex;
    height: 60px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    z-index: 10;
}

.action-btn {
    flex: 1;
    border: none;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
    transition: filter 0.2s;
}

.action-btn:hover {
    filter: brightness(1.1);
}

/* Footer Gradient from Image */
.action-btn.approve {
    background-color: #00838F; /* Darkest Teal (Right) */
}
.action-btn.cancel {
    background-color: #00ACC1; /* Medium Teal (Middle) */
}
.action-btn.share {
    background-color: #4DD0E1; /* Light Teal (Left) */
}

/* Modal Styling */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-card {
    background: white;
    width: 300px;
    border-radius: 4px; /* Simulating simple card from image */
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    border-top: 5px solid #00ACC1; /* Blue top border like image */
}

.modal-title {
    text-align: center;
    padding: 15px;
    color: #00ACC1; /* Bright blue title */
    font-size: 1.2rem;
    font-weight: 500;
    border-bottom: 2px solid #00ACC1;
}

.modal-list {
    display: flex;
    flex-direction: column;
}

.modal-item {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

.modal-item:last-child {
    border-bottom: none;
}

.radio-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    cursor: pointer;
}

.type-name {
    font-size: 1.1rem;
    color: #333;
}

.radio-label input {
    display: none;
}

.radio-custom {
    width: 20px;
    height: 20px;
    border: 2px solid #999;
    border-radius: 50%;
    position: relative;
    box-sizing: border-box;
}

.radio-label input:checked ~ .radio-custom {
    border-color: #999; /* Outer ring remains grey mostly in standard radio but let's make it styled */
    border: 2px solid #999;
}

.radio-label input:checked ~ .radio-custom:after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 10px;
    height: 10px;
    background-color: black; /* Or dark grey per image */
    border-radius: 50%;
}
</style>
