<template>
  <div class="overtime-page">
    <!-- Header -->
    <header class="header">
      <button class="icon-btn" @click.stop="isMenuOpen = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      
      <div class="header-title-area">
          <span>הגדרות שעות נוספות</span>
      </div>

      <div class="header-spacer"></div>
    </header>

    <!-- Main Content -->
    <div class="content-container">
        <!-- Info Section -->
        <div class="info-section">
            <h2 class="info-title">תעריפי שעות נוספות</h2>
            <p class="info-text">
                כאן ניתן להגדיר את חישוב השעות הנוספות עבור כל סוג משמרת.
                לחץ על משמרת לעריכה.
            </p>
        </div>

        <!-- Shift List -->
        <div class="shift-list">
            <div v-for="type in shiftTypes" :key="type.id" class="shift-item" @click="openShiftModal(type)">
                <div class="shift-info">
                    <span class="shift-name-text">{{ type.name }}</span>
                    <span class="shift-detail-text">
                        {{ formatRulesSummary(type.rates) }}
                    </span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
        </div>
    </div>

    <!-- Main Modal: Shift Definition -->
    <div v-if="isShiftModalOpen" class="modal-overlay" @click.self="closeShiftModal">
        <div class="modal-card">
            <div class="modal-header">
                הגדרת משמרת
            </div>
            
            <div class="modal-body">
                <!-- Shift Name -->
                <div class="name-row">
                     <span class="label-text">שם המשמרת:</span>
                     <input type="text" v-model="tempShiftName" class="name-input" readonly>
                </div>

                <!-- Entry/Exit -->
                <div class="times-row">
                    <div class="time-block">
                        <div class="time-box clickable" @click="openTimePicker('shift-entry')">
                            <input type="text" v-model="tempEntry" class="time-input-box" readonly>
                        </div>
                        <span class="label-below red-label">כניסה:</span>
                    </div>
                    <div class="time-block">
                        <div class="time-box clickable" @click="openTimePicker('shift-exit')">
                            <input type="text" v-model="tempExit" class="time-input-box" readonly>
                        </div>
                        <span class="label-below red-label">יציאה:</span>
                    </div>
                </div>

                <div class="section-title">תעריפים ושעות:</div>

                <!-- Rules List -->
                <div class="rules-list">
                    <div v-for="(rule, index) in tempRules" :key="index" class="rule-item">
                        <div class="rule-actions">
                            <button class="action-btn delete" @click="deleteRule(index)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                            <button class="action-btn edit" @click="openRuleModal(index)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                        </div>
                        
                        <div class="rule-display">
                            <div class="rule-box percentage">
                                % {{ rule.value }}
                            </div>
                            <div class="rule-box duration">
                                {{ rule.limit }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add Rule Button -->
                 <button class="add-rule-btn" @click="openRuleModal(null)">
                    <span class="plus-icon">+</span>
                    הוסף תעריף נוסף
                </button>

                <!-- Bottom Inputs (Indicative Only - Managed Globally) -->
                <div class="bottom-inputs">
                    <div class="input-row"> <!-- Removed click handler -->
                        <input type="number" v-model="tempBreak" class="bottom-input" readonly style="opacity: 0.7; background: #f5f5f5;">
                        <label>הפסקה (דק'):</label>
                    </div>
                    <div class="input-row"> <!-- Removed click handler -->
                        <input type="number" v-model="tempExtra" class="bottom-input" readonly style="opacity: 0.7; background: #f5f5f5;">
                        <label>תוספת יומית (ש"ח):</label>
                    </div>
                    <div class="input-row"> <!-- Removed click handler -->
                        <input type="number" v-model="tempDeduction" class="bottom-input" readonly style="opacity: 0.7; background: #f5f5f5;">
                        <label>הורדה יומית (ש"ח):</label>
                    </div>
                </div>

            </div>

             <div class="modal-footer">
                <button class="footer-btn approve" @click="saveShiftChanges">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    אישור
                </button>
                 <div class="footer-divider"></div>
                <button class="footer-btn cancel" @click="closeShiftModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    ביטול
                </button>
            </div>
        </div>
    </div>

    <!-- Rule Edit/Add Overlay Modal -->
    <div v-if="isRuleModalOpen" class="modal-overlay sub-modal" @click.self="closeRuleModal">
         <div class="modal-card rule-card">
             <div class="modal-header rule-header">
                נא להכניס תעריף חדש
            </div>
            <div class="modal-body rule-body">
                
                <div class="rule-inputs-row">
                    <!-- Rate -->
                    <div class="input-block">
                        <div class="input-box clickable" @click="openInputModal('rate', tempRuleRate)">
                            <input type="number" v-model="tempRuleRate" class="clean-input" readonly>
                            <span class="unit-label">%</span>
                        </div>
                        <span class="label-below">אחוזים:</span>
                        <span v-if="tempRuleRate < 100 && tempRuleRate > 0" class="rate-preview">(סה"כ: {{ Number(tempRuleRate) + 100 }}%)</span>
                    </div>

                    <!-- Duration -->
                    <div class="input-block">
                         <div class="input-box clickable" @click="openTimePicker('rule-duration')">
                            <input type="text" v-model="tempRuleDuration" class="clean-input" readonly>
                        </div>
                        <span class="label-below">שעות:</span>
                    </div>
                </div>

            </div>
             <div class="modal-footer">
                <button class="footer-btn approve" @click="saveRule">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    אישור
                </button>
                 <div class="footer-divider"></div>
                <button class="footer-btn cancel" @click="closeRuleModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    ביטול
                </button>
            </div>
         </div>
    </div>


    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" v-if="isMenuOpen" @click="isMenuOpen = false"></div>

    <!-- Sidebar Menu (Reused) -->
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
        <button class="bottom-tab active">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>כללי</span>
        </button>
        </div>
    </div>

    <!-- Generic Input Modal -->
    <div v-if="isInputModalOpen" class="modal-overlay sub-modal" @click.self="closeInputModal">
        <div class="modal-card">
          <div class="modal-header">{{ inputModalTitle }}</div>
          
          <div class="modal-body">
            <input 
                type="number" 
                v-model="inputModalValue" 
                class="name-input" 
                ref="genericInputRef"
            />
          </div>
          
          <div class="modal-footer">
            <button class="footer-btn approve" @click="confirmInputModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                אישור
            </button>
            <div class="footer-divider"></div>
            <button class="footer-btn cancel" @click="closeInputModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ביטול
            </button>
          </div>
        </div>
    </div>

    <!-- Time Picker Modal -->
    <div v-if="isTimePickerOpen" class="modal-overlay sub-modal" @click.self="closeTimePicker">
        <div class="modal-card">
            <div class="modal-header">
                {{ pickerTitle }}
            </div>
            
            <div class="modal-body">
                <div class="time-picker-container">
                   <div class="time-column">
                      <div class="time-cell prev" @click="adjustTime('hour', -1)">{{ prevHour }}</div>
                      <div class="time-cell current">
                        <input type="number" v-model="tempHour" class="time-input clean-input"/>
                      </div>
                      <div class="time-cell next" @click="adjustTime('hour', 1)">{{ nextHour }}</div>
                   </div>
                   
                   <div class="time-colon">:</div>

                   <div class="time-column">
                      <div class="time-cell prev" @click="adjustTime('minute', -1)">{{ prevMinute }}</div>
                      <div class="time-cell current">
                        <input type="number" v-model="tempMinute" class="time-input clean-input"/>
                      </div>
                      <div class="time-cell next" @click="adjustTime('minute', 1)">{{ nextMinute }}</div>
                   </div>
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
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const isMenuOpen = ref(false);
const shiftTypes = computed(() => store.getters.allShiftTypes);

// Formatting for list view
const formatRulesSummary = (rules) => {
    if (!rules || rules.length === 0) return 'לא הוגדרו תעריפים';
    return rules.map(r => `${r.value}% (${r.limit})`).join(' | ');
};

// Main Shift Modal State
const isShiftModalOpen = ref(false);
const editingShiftId = ref(null);
const tempShiftName = ref('');
const tempEntry = ref('07:00');
const tempExit = ref('17:00');
const tempBreak = ref(0);
const tempExtra = ref(0);
const tempDeduction = ref(0);
const tempRules = ref([]);

const openShiftModal = (type) => {
    editingShiftId.value = type.id;
    tempShiftName.value = type.name;
    tempEntry.value = type.entry || '07:00';
    tempExit.value = type.exit || '17:00';
    
    // 1. Calculate Global Break (Master: General Settings/Rules)
    const allRules = store.getters.allAdditionsDeductions || [];
    const matchingRules = allRules.filter(r => {
        const isTimeBased = (r.type === 'deduction' && r.mode === 'time') || r.type === 'break' || (r.minutes && r.minutes > 0);
        if (!isTimeBased) return false;
        
        const ruleShiftIds = r.shiftIds || [];
        // Apply Global rules ONLY (User requested no specific overrides)
        // Or if specific logic is needed, we can keep it, but we won't SAVE it to the type.
        // For now, allow specific rules if defined in Rules engine, but normally "Global" implies empty shiftIds.
        if (ruleShiftIds.length === 0) return true;
        return ruleShiftIds.some(id => String(id) === String(type.id));
    });

    const calculatedBreak = matchingRules.reduce((sum, r) => {
        return sum + (Number(r.minutes) || Number(r.amount) || 0);
    }, 0);

    // Display Calculated Value (Indicative Only) - Do NOT use saved type.break
    tempBreak.value = calculatedBreak || 0;

    // 2. Calculate Global Extra/Deduction (Indicative Only)
    const rulesExtra = allRules.filter(r => 
        (r.type === 'addition') && (r.mode === 'amount') && (r.period === 'daily') &&
        ((r.shiftIds || []).length === 0 || (r.shiftIds || []).includes(type.id))
    ).reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const rulesDeduction = allRules.filter(r => 
        (r.type === 'deduction') && (r.mode === 'amount') && (r.period === 'daily') &&
        ((r.shiftIds || []).length === 0 || (r.shiftIds || []).includes(type.id))
    ).reduce((sum, r) => sum + Number(r.amount || 0), 0);

    tempExtra.value = rulesExtra;
    tempDeduction.value = rulesDeduction;

    // Deep copy rules or init array
    tempRules.value = type.rates ? JSON.parse(JSON.stringify(type.rates)) : [];
    
    isShiftModalOpen.value = true;
};

const closeShiftModal = () => {
    isShiftModalOpen.value = false;
};

const saveShiftChanges = () => {
    // Dispatch update to store with new rules
    if (editingShiftId.value !== null) {
        const type = shiftTypes.value.find(t => t.id === editingShiftId.value);
        if (type) {
            const payload = {
                id: type.id,
                numericId: type.numericId,
                name: tempShiftName.value,
                color: type.color, // Preserve color
                entry: tempEntry.value,
                exit: tempExit.value,
                // CRITICAL: Force 0 to ensure Shift Type does NOT override Global Rules.
                // These fields are now "Indicative" in the UI and controlled globally.
                break: 0,
                extra: 0,
                deduction: 0, 
                rates: JSON.parse(JSON.stringify(tempRules.value)) // Ensure clean array
            };
            store.dispatch('updateShiftType', payload);
            store.dispatch('showToast', { message: 'הגדרות עודכנו בהצלחה', type: 'success' });
        }
    }
    isShiftModalOpen.value = false;
};

// Rule Actions
const deleteRule = (index) => {
    tempRules.value.splice(index, 1);
};


// Sub Modal State (Add/Edit Rule)
const isRuleModalOpen = ref(false);
const editingRuleIndex = ref(null);
const tempRuleDuration = ref('00:00');
const tempRuleRate = ref(100);

const openRuleModal = (index) => {
    editingRuleIndex.value = index;
    if (index !== null) {
        // Edit existing
        const rule = tempRules.value[index];
        tempRuleDuration.value = rule.limit;
        tempRuleRate.value = rule.value;
    } else {
        // Add new
        tempRuleDuration.value = '02:00'; // Default per image example
        tempRuleRate.value = 125;
    }
    isRuleModalOpen.value = true;
};

const closeRuleModal = () => {
    isRuleModalOpen.value = false;
};

const formatRateOnBlur = () => {
    if (tempRuleRate.value < 100 && tempRuleRate.value > 0) {
        tempRuleRate.value += 100;
    }
};

const saveRule = () => {
    let finalRate = tempRuleRate.value;
    // Heuristic: automatically add 100 if user types just the bonus (e.g. 25 -> 125, 50 -> 150)
    if (finalRate < 100) {
        finalRate += 100;
    }

    const newRule = {
        limit: tempRuleDuration.value,
        value: finalRate
    };

    if (editingRuleIndex.value !== null) {
        // Update existing
        tempRules.value.splice(editingRuleIndex.value, 1, newRule);
    } else {
        // Add new
        tempRules.value.push(newRule);
    }
    isRuleModalOpen.value = false;
};




// --- Custom Modals Logic ---

// Input Modal State
const isInputModalOpen = ref(false);
const inputModalValue = ref('');
const inputModalTarget = ref(''); // 'break', 'extra', 'deduction', 'rate'
const inputModalTitle = ref('');
const genericInputRef = ref(null);

const openInputModal = (target, currentValue) => {
    inputModalTarget.value = target;
    inputModalValue.value = currentValue;
    
    // Set Title
    if (target === 'break') inputModalTitle.value = 'הפסקה (דק\')';
    else if (target === 'extra') inputModalTitle.value = 'תוספת (ש"ח)';
    else if (target === 'deduction') inputModalTitle.value = 'הורדה (ש"ח)';
    else if (target === 'rate') inputModalTitle.value = 'אחוז כפל';
    
    isInputModalOpen.value = true;
    nextTick(() => genericInputRef.value?.focus());
};

const closeInputModal = () => { isInputModalOpen.value = false; };

const confirmInputModal = () => {
    const val = Number(inputModalValue.value);
    if (inputModalTarget.value === 'break') tempBreak.value = val;
    else if (inputModalTarget.value === 'extra') tempExtra.value = val;
    else if (inputModalTarget.value === 'deduction') tempDeduction.value = val;
    else if (inputModalTarget.value === 'rate') tempRuleRate.value = val;
    
    closeInputModal();
};

// Time Picker State
const isTimePickerOpen = ref(false);
const pickerTarget = ref(''); // 'shift-entry', 'shift-exit', 'rule-duration'
const pickerTitle = ref('');
const tempHour = ref('00');
const tempMinute = ref('00');

const openTimePicker = (target) => {
    pickerTarget.value = target;
    let timeStr = '00:00';
    
    if (target === 'shift-entry') {
        pickerTitle.value = 'זמן כניסה';
        timeStr = tempEntry.value;
    } else if (target === 'shift-exit') {
        pickerTitle.value = 'זמן יציאה';
        timeStr = tempExit.value;
    } else if (target === 'rule-duration') {
        pickerTitle.value = 'משך שעות';
        timeStr = tempRuleDuration.value;
    }
    
    const [h, m] = (timeStr || '00:00').split(':');
    tempHour.value = h || '00';
    tempMinute.value = m || '00';
    
    isTimePickerOpen.value = true;
};

const closeTimePicker = () => { isTimePickerOpen.value = false; };

const adjustTime = (unit, delta) => {
    if (unit === 'hour') {
        let h = parseInt(tempHour.value);
        h = (h + delta + 24) % 24;
        tempHour.value = h.toString().padStart(2, '0');
    } else {
        let m = parseInt(tempMinute.value);
        m = (m + delta + 60) % 60;
        tempMinute.value = m.toString().padStart(2, '0');
    }
};

const prevHour = computed(() => {
    const h = parseInt(tempHour.value);
    return ((h - 1 + 24) % 24).toString().padStart(2, '0');
});
const nextHour = computed(() => {
    const h = parseInt(tempHour.value);
    return ((h + 1) % 24).toString().padStart(2, '0');
});
const prevMinute = computed(() => {
    const m = parseInt(tempMinute.value);
    return ((m - 1 + 60) % 60).toString().padStart(2, '0');
});
const nextMinute = computed(() => {
    const m = parseInt(tempMinute.value);
    return ((m + 1) % 60).toString().padStart(2, '0');
});

const confirmTimePicker = () => {
    const finalTime = `${tempHour.value}:${tempMinute.value}`;
    if (pickerTarget.value === 'shift-entry') tempEntry.value = finalTime;
    else if (pickerTarget.value === 'shift-exit') tempExit.value = finalTime;
    else if (pickerTarget.value === 'rule-duration') tempRuleDuration.value = finalTime;
    
    closeTimePicker();
};

const logout = () => {
    store.dispatch('saveToken', null);
    store.commit('SET_USER', null);
    router.push({ name: 'login' });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

.overtime-page {
  font-family: 'Heebo', sans-serif;
  background-color: white; 
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: #333;
  direction: rtl;
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

.header-spacer {
    width: 24px;
}

/* Content */
.content-container {
    flex: 1;
    overflow-y: auto;
    background: white;
    padding-bottom: 20px;
}

.info-section {
    padding: 30px 20px;
    text-align: right;
    border-bottom: 1px solid #eee;
}

.info-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: #444;
}

.info-text {
    font-size: 0.95rem;
    color: #777;
    line-height: 1.5;
    margin: 0;
}

/* List */
.shift-list {
    display: flex;
    flex-direction: column;
}

.shift-item {
    padding: 24px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background: white;
    transition: background 0.1s;
    /* direction: rtl by default */
}

.shift-item:hover {
    background-color: #f9f9f9;
}

.shift-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: right;
}

.shift-name-text {
    font-size: 1.1rem;
    color: #333;
    font-weight: 500;
    margin-bottom: 4px;
}

.shift-detail-text {
    font-size: 0.85rem;
    color: #888;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Sub modal needs higher z-index */
.modal-overlay.sub-modal {
    z-index: 2100;
}

.modal-card {
    background: white;
    width: 90%;
    max-width: 320px;
    border-radius: 4px; /* Slightly sharper corners as per image */
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    direction: rtl;
}

.modal-header {
    background-color: #4DB6CD; /* Lighter teal from image */
    color: white;
    padding: 15px;
    font-size: 1.1rem;
    font-weight: 500;
    text-align: center;
}

.modal-body {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.name-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 5px;
}

.color-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-top: 20px; /* Align visually with input */
    border: 2px solid #fff;
    box-shadow: 0 0 3px rgba(0,0,0,0.2);
    cursor: pointer; /* Potential for color picker */
}

.name-input-wrapper {
    display: flex;
    flex-direction: column;
    width: 60%;
}

.label-text {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 4px;
}

.name-input {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    font-size: 1rem;
    text-align: center;
}

.tutorial-link {
    text-align: center;
    color: #0093AB;
    font-size: 0.9rem;
    margin-bottom: 10px;
    cursor: pointer;
}

/* Rules List */
.rules-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.rule-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.rule-item:last-child {
    border-bottom: none;
}

.rule-actions {
    display: flex;
    gap: 10px;
}

.action-btn {
    border: none;
    background: none;
    cursor: pointer;
    color: #888;
    padding: 5px;
}

.action-btn:hover {
    color: #444;
}

.rule-display {
    display: flex;
    gap: 15px;
    align-items: center;
}

.rule-box {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 0;
    width: 60px;
    text-align: center;
    font-size: 0.95rem;
    color: #555;
}

.add-rule-btn {
    background: white;
    border: 1px solid #eee;
    padding: 12px;
    width: 100%;
    text-align: center;
    cursor: pointer;
    color: #555;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 5px;
    border-radius: 4px;
}

.add-rule-btn:hover {
    background: #f9f9f9;
}

.note-section {
    margin-top: 15px;
    font-size: 0.85rem;
    color: #666;
    background: #fdfdfd;
    padding: 10px;
    border-radius: 4px;
}

/* Rule Edit Modal Specifics */
.rule-card .modal-header {
    background-color: #4DB6CD;
}

.rule-inputs-row {
    display: flex;
    justify-content: space-around;
    padding: 20px 0;
}

.input-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.input-box {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 50px;
}

.clean-input {
    border: none;
    width: 100%;
    text-align: center;
    font-size: 1.2rem;
    outline: none;
}

.unit-label {
    margin-right: 2px;
    color: #888;
}

.label-below {
    font-size: 0.9rem;
    color: #d32f2f; /* Reddish per image */
    font-weight: 500;
}

.rate-preview {
    font-size: 0.8rem;
    color: #777;
    margin-top: 2px;
}


/* Footer Actions */
.modal-footer {
    display: flex;
    border-top: 1px solid #eee;
    background-color: #0093AB; 
    direction: rtl; 
}

.footer-btn {
    flex: 1;
    border: none;
    background: none; /* Transparent on teal bg */
    padding: 15px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: white; /* White text on Teal */
}

/* Divider needs to be lighter/transparent */
.footer-divider {
    width: 1px;
    background-color: rgba(255,255,255,0.3);
}


/* Top Menu Sidebar - Copied for consistency */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 2000;
}
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 80%;
  max-width: 320px;
  height: 100%;
  background: #F5F5F5;
  z-index: 2001;
  transform: translateX(-100%);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
}

.sidebar.open {
  transform: translateX(0);
}
/* Time Picker & Custom Modal Styles */
.time-picker-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    direction: ltr; /* Ensure HH:MM order */
    padding: 20px 0;
}
.time-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.time-cell {
    font-size: 1.2rem;
    color: #ccc;
    cursor: pointer;
    user-select: none;
}
.time-cell.current {
    font-size: 2rem;
    color: #333;
    font-weight: bold;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    width: 60px;
    display: flex;
    justify-content: center;
}
.time-colon {
    font-size: 2rem;
    font-weight: bold;
    padding-bottom: 5px;
}
.time-input.clean-input {
    font-size: 2rem;
    width: 100%;
    text-align: center;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    margin: 0;
}

.clickable {
    cursor: pointer;
}
.clickable:hover {
    background-color: #f9f9f9;
}
.sidebar-header {
  height: 160px;
  background: linear-gradient(135deg, #4DD0E1, #0093AB);
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
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
}
.sidebar-top-row {
  display: flex;
  justify-content: flex-end;
  z-index: 1;
}
.account-name { font-size: 0.9rem; font-weight: 500; opacity: 0.9; }
.sidebar-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 1;
}
.menu-label-group { display: flex; align-items: center; gap: 8px; }
.menu-text { font-size: 1.2rem; font-weight: 700; }
.user-avatar { width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
/* New Modal Styles */
.times-row {
    display: flex;
    justify-content: space-between;
    gap: 15px;
}

.time-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.time-input-box {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    font-size: 1.5rem;
    text-align: center;
    color: #333;
    outline: none;
    background: white;
    position: relative;
    z-index: 10;
}

.label-below {
    font-size: 0.9rem;
    margin-top: 5px;
    font-weight: 500;
}

.red-label {
    color: #F44336; /* Red for Entry/Exit labels */
}

.section-title {
    text-align: right;
    font-weight: 700;
    color: #555;
    margin-top: 5px;
}

.plus-icon {
    font-size: 1.2rem;
    font-weight: bold;
}

.bottom-inputs {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 5px;
}

.input-row {
    display: flex;
    flex-direction: row-reverse; /* Label Right, Input Left */
    align-items: center;
    justify-content: space-between;
}

.input-row label {
    color: #666;
    font-size: 1rem;
}

.bottom-input {
    width: 100px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    text-align: center;
    font-size: 1rem;
}

/* Override name input styles */
.name-row {
    justify-content: flex-end; /* Label first in RTL */
    flex-direction: row-reverse;
}

.name-input {
    text-align: right; 
    flex: 1;
    margin-left: 10px;
}

.menu-items { flex: 1; overflow-y: auto; padding: 10px 0; display: flex; flex-direction: column; }
.menu-item { display: flex; align-items: center; padding: 16px 24px; text-decoration: none; color: #444; font-size: 1rem; font-weight: 500; transition: background 0.2s; }
.menu-item:hover, .menu-item.active-menu-item { background: rgba(0,0,0,0.05); }
.item-icon { margin-left: 16px; color: #555; display: flex; align-items: center; }
.spacer-small { height: 16px; }
.sidebar-footer { padding: 16px; margin-left: 20px; }

/* Bottom Tabs */
/* Bottom Tabs */
/* Bottom Tabs */
.bottom-tabs-container {
    height: 70px;
    background-color: #0093AB;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    direction: rtl; /* Ensure RTL context */
    
    /* Mobile Scrolling Fixes */
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
}
.bottom-tabs-container::-webkit-scrollbar {
    display: none;
}

/* .bottom-tabs-scroll removed */

.bottom-tabs-scroll {
    display: flex;
    flex-direction: row; /* Standard row, RTL will handle visual order */
    height: 100%;
    min-width: 100%;
    width: max-content;
}

.bottom-tab {
    flex: 0 0 auto; /* Do not grow, do not shrink */
    width: 100px; /* Fixed width */
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
    scroll-snap-align: start;
}

.bottom-tab.active {
    color: white;
    background-color: rgba(0,0,0,0.1);
}


/* Time Picker & Custom Modal Styles */
.time-picker-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    direction: ltr; /* Ensure HH:MM order */
    padding: 20px 0;
}
.time-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.time-cell {
    font-size: 1.2rem;
    color: #ccc;
    cursor: pointer;
    user-select: none;
}
.time-cell.current {
    font-size: 2rem;
    color: #333;
    font-weight: bold;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    width: 60px;
    display: flex;
    justify-content: center;
}
.time-colon {
    font-size: 2rem;
    font-weight: bold;
    padding-bottom: 5px;
}
.time-input.clean-input {
    font-size: 2rem;
    width: 100%;
    text-align: center;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    margin: 0;
}

.clickable {
    cursor: pointer;
}
.clickable:hover {
    background-color: #f9f9f9;
}
</style>
