<template>
  <div class="page-container">
    <!-- Header -->
    <header class="header">
      <button class="icon-btn" @click.stop="isMenuOpen = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      
      <div class="header-title-area">
          <span>הוספות \ הורדות</span>
      </div>

       <button class="icon-btn" style="visibility: hidden;">
         <!-- Spacer -->
      </button>
    </header>

    <!-- Main Content -->
    <div class="content-container">
        
        <!-- Instruction Text -->
        <div class="instruction-section">
            <p>
                יש למלא את כל הפרטים וללחוץ על הוסף כדי להוסיף הוספה או הורדה חדשה.
                כדי למחוק הוספה או הורדה מהרשימה יש ללחוץ לחיצה ארוכה על הרשימה.
            </p>
        </div>

        <!-- Form Card -->
        <div class="form-card">
            <!-- Type -->
            <div class="form-row">
                <label>סוג:</label>
                <div class="input-wrapper">
                    <input type="text" :value="typeLabel" class="form-input" readonly @click="isTypeModalOpen = true">
                </div>
            </div>

            <!-- Period -->
            <div class="form-row">
                <label>תקופה:</label>
                <div class="input-wrapper">
                    <input type="text" :value="periodLabel" class="form-input" readonly @click="isPeriodModalOpen = true">
                </div>
            </div>

            <!-- Description -->
            <div class="form-row">
                <label>תאור:</label>
                <div class="input-wrapper">
                    <input type="text" v-model="form.description" class="form-input" placeholder="">
                </div>
            </div>

            <!-- Time (Minutes) -->
            <div class="form-row">
                <label>זמן:</label>
                <div class="input-wrapper with-suffix">
                     <input type="radio" value="time" v-model="form.mode" class="mode-radio">
                     <input type="number" v-model="form.minutes" class="form-input" :disabled="form.mode !== 'time'" placeholder="0">
                     <span class="suffix">דק'</span>
                </div>
            </div>

            <!-- Amount -->
            <div class="form-row">
                <label>סכום:</label>
                <div class="input-wrapper with-suffix">
                    <input type="radio" value="amount" v-model="form.mode" class="mode-radio">
                    <input type="number" v-model="form.amount" class="form-input" :disabled="form.mode !== 'amount'">
                    <span class="suffix">ש"ח</span>
                </div>
            </div>

            <!-- Shift Scope -->
            <div class="form-row">
                <label>משמרת:</label>
                <div class="input-wrapper">
                    <select v-model="form.shiftId" class="form-input">
                        <option :value="null">כל המשמרות</option>
                        <option v-for="shift in shiftTypes" :key="shift.id" :value="shift.id">
                            {{ shift.name }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Buttons -->
            <div class="form-actions">
                <button class="action-btn add" @click="addItem">הוסף</button>
                <button class="action-btn reset" @click="resetForm">איפוס</button>
            </div>
        </div>

        <!-- List of Items -->
        <div class="items-list">
             <div v-for="item in items" :key="item.id" class="list-item" @click="confirmDelete(item)">
                 <div class="item-icon" :class="item.type">
                     <!-- Icon depending on type -->
                     <svg v-if="item.type === 'addition'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                     <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                 </div>
                 <div class="item-details">
                     <div class="item-title">{{ item.description || getItemLabel(item.type) }}</div>
                     <div class="item-subtitle">
                         {{ getPeriodLabel(item.period) }} | 
                         {{ getShiftName(item.shiftId) }}
                     </div>
                 </div>
                 <div class="item-amount" :class="item.type">
                     <span v-if="item.mode === 'time'">{{ item.minutes }} דק'</span>
                     <span v-else>{{ item.amount }} ₪</span>
                 </div>
             </div>
             
             <div v-if="items.length === 0" class="empty-state">
                 אין נתונים להצגה
             </div>
        </div>

    </div>

    <!-- Type Selection Modal -->
    <transition name="fade">
      <div v-if="isTypeModalOpen" class="input-modal-overlay" @click.self="isTypeModalOpen = false">
        <div class="input-modal">
          <div class="input-modal-title">
             נא לבחור סוג
          </div>
          <div class="input-title-divider"></div>
          
          <div class="shift-type-body">
             <label v-for="opt in typeOptions" :key="opt.value" class="shift-type-option" @click.prevent="selectType(opt.value)">
               <span class="option-label">{{ opt.label }}</span>
               <input type="radio" :checked="form.type === opt.value" class="option-radio" readonly>
             </label>
          </div>
        </div>
      </div>
    </transition>

    <!-- Period Selection Modal -->
    <transition name="fade">
      <div v-if="isPeriodModalOpen" class="input-modal-overlay" @click.self="isPeriodModalOpen = false">
        <div class="input-modal">
          <div class="input-modal-title">
             נא לבחור תקופה
          </div>
          <div class="input-title-divider"></div>
          
          <div class="shift-type-body">
             <label v-for="opt in periodOptions" :key="opt.value" class="shift-type-option" @click.prevent="selectPeriod(opt.value)">
               <span class="option-label">{{ opt.label }}</span>
               <input type="radio" :checked="form.period === opt.value" class="option-radio" readonly>
             </label>
          </div>
        </div>
      </div>
    </transition>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" v-if="isMenuOpen" @click="isMenuOpen = false"></div>

    <!-- Sidebar Menu (Copied structure for consistency) -->
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
        <router-link to="/settings" class="menu-item" @click="isMenuOpen = false">
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
            <button class="bottom-tab" @click="$router.push('/overtime-settings')"> <!-- Correct link to Overtime Settings as per flow -->
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                <span>סוגי משמרות</span>
            </button>
            <button class="bottom-tab active">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                <span>הוספות \ הורדות</span>
            </button>
            <button class="bottom-tab" @click="$router.push('/tax-deductions')">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                <span>מס הכנסה</span>
            </button>

        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const isMenuOpen = ref(false);

const isTypeModalOpen = ref(false);
const isPeriodModalOpen = ref(false);

const shiftTypes = computed(() => store.getters.allShiftTypes);
const items = computed(() => store.getters.allAdditionsDeductions || []); 

const form = reactive({
    type: 'deduction', 
    period: 'daily',   
    description: '',
    amount: 0,
    minutes: 0,
    mode: 'amount', // 'amount' or 'time'
    shiftId: null 
});

const typeOptions = [
    { value: 'deduction', label: 'הורדה' },
    { value: 'addition', label: 'הוספה' },
    { value: 'net_deduction', label: 'הורדה מנטו' },
    { value: 'tax_value', label: 'שווי מס' }
];

const periodOptions = [
    { value: 'daily', label: 'יומי' },
    { value: 'monthly', label: 'חודשי' }
];

const typeLabel = computed(() => {
    const opt = typeOptions.find(o => o.value === form.type);
    return opt ? opt.label : '';
});

const periodLabel = computed(() => {
    const opt = periodOptions.find(o => o.value === form.period);
    return opt ? opt.label : '';
});

const selectType = (val) => {
    form.type = val;
    isTypeModalOpen.value = false;
};

const selectPeriod = (val) => {
    form.period = val;
    isPeriodModalOpen.value = false;
};

const addItem = () => {
    // Validation
    if (form.mode === 'amount' && form.amount <= 0) {
        alert('נא להזין סכום');
        return;
    }
    if (form.mode === 'time' && form.minutes <= 0) {
         alert('נא להזין זמן בדקות');
         return;
    }

    const newItem = {
        id: Date.now(),
        type: form.type,
        period: form.period,
        description: form.description,
        shiftId: form.shiftId,
        mode: form.mode,
        amount: form.mode === 'amount' ? form.amount : 0,
        minutes: form.mode === 'time' ? form.minutes : 0
    };

    store.dispatch('addAdditionDeduction', newItem);
    resetForm();
};

const resetForm = () => {
    form.type = 'addition';
    form.period = 'monthly';
    form.description = '';
    form.amount = 0;
    form.minutes = 0;
    form.mode = 'amount';
    form.shiftId = null;
};

const confirmDelete = (item) => {
    if (confirm('האם למחוק פריט זה מהרשימה?')) {
        store.dispatch('deleteAdditionDeduction', item.id);
    }
};

const getShiftName = (id) => {
    if (!id) return 'כל המשמרות';
    const s = shiftTypes.value.find(t => t.id === id);
    return s ? s.name : 'Unknown';
}

const getItemLabel = (typeVal) => {
    const opt = typeOptions.find(o => o.value === typeVal);
    return opt ? opt.label : typeVal;
}

const getPeriodLabel = (periodVal) => {
    const opt = periodOptions.find(o => o.value === periodVal);
    return opt ? opt.label : periodVal;
}

const logout = () => {
    store.dispatch('saveToken', null);
    store.commit('SET_USER', null);
    router.push({ name: 'login' });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

.page-container {
  font-family: 'Heebo', sans-serif;
  background-color: #f5f5f5; 
  height: 100vh;
  display: flex;
  flex-direction: column;
  direction: rtl;
  color: #333;
}

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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.content-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

.instruction-section {
    text-align: right;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 20px;
    line-height: 1.4;
}

/* Form Card */
.form-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}

.form-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.form-row label {
    width: 60px;
    font-weight: 500;
    color: #444;
    text-align: right;
    margin-left: 10px;
}

.input-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
}

.form-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    background: white;
}

.input-wrapper.with-suffix .form-input {
    text-align: center;
}

.suffix {
    position: absolute;
    left: 10px;
    color: #666;
}

.form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.action-btn {
    flex: 1;
    padding: 14px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    font-size: 1rem;
    font-family: inherit;
    border: none;
}

.action-btn.add {
    background-color: #4DB6AC; /* Teal-ish like image */
    color: white;
}

.action-btn.reset {
    background-color: transparent;
    border: 1px solid #4DB6AC;
    color: #0093AB; /* Darker teal text? Image shows specific blueish */
    background-color: #4DB6AC; /* Wait, image shows both filled? No, reset usually outline. Image shows blue filled 'Reset' and 'Add'? Let's stick to standard ux or image. Image 1 shows ONE button 'Add' blue. Image 2 shows 'Reset' (Blue) and 'Add' (Blue)? Both seem flat blue buttons. */
    background-color: #4DB6AC; 
    color: white;
    /* Actually they look identical in the crop. */
}

/* List */
.items-list {
    margin-top: 20px;
}

.list-item {
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer; /* Indication for long press/click */
    border-right: 4px solid transparent;
}

.list-item:active {
    background-color: #f9f9f9;
}

.item-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12px;
    flex-shrink: 0;
}

.item-icon.addition {
    background-color: #E8F5E9;
    color: #4CAF50;
}
.item-icon.deduction {
    background-color: #FFEBEE;
    color: #F44336;
}
.list-item:hover .item-icon.addition { border-right-color: #4CAF50; }

.item-details {
    flex: 1;
}

.item-title {
    font-weight: 500;
    color: #333;
    font-size: 1rem;
}

.item-subtitle {
    font-size: 0.8rem;
    color: #888;
}

.item-amount {
    font-weight: 700;
    font-size: 1.1rem;
}
.item-amount.addition { color: #4CAF50; }
.item-amount.deduction { color: #F44336; }

.empty-state {
    text-align: center;
    padding: 40px;
    color: #999;
}

/* Sidebar Styles (Duplicated from ShiftTypesView) */
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
}

.bottom-tabs-scroll {
    display: flex;
    flex-direction: row-reverse; /* RTL Order */
    height: 100%;
    width: 100%;
}

.bottom-tab {
    flex: 1;
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
}

.bottom-tab.active {
    color: white;
    background-color: rgba(0,0,0,0.1);
}
/* Input Modal Styles */
.input-modal-overlay {
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

.input-modal {
    background: white;
    width: 85%;
    max-width: 320px;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    text-align: center;
}

.input-modal-title {
    color: #4facfe; /* Light Blue */
    font-size: 1.2rem;
    font-weight: 500;
    padding: 15px;
    background-color: white;
}

.input-title-divider {
    height: 2px;
    background-color: #4facfe;
    width: 100%;
}

.shift-type-body {
    display: flex;
    flex-direction: column;
}

.shift-type-option {
    display: flex;
    justify-content: space-between; /* Text Right, Radio Left */
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    font-size: 1.1rem;
    color: #333;
}

.shift-type-option:last-child {
    border-bottom: none;
}

.option-radio {
    width: 18px;
    height: 18px;
    accent-color: #4facfe;
    cursor: pointer;
}
</style>
