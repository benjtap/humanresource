<template>
  <div class="shift-types-page">
    <!-- Header -->
    <!-- Header -->
    <header class="header">
      <button class="icon-btn" @click.stop="isMenuOpen = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      
      <div class="header-title-area">
          <span>סוג משמרות</span>
      </div>

      <!-- Right spacer for balance (or notification icon if needed, using empty for now or same icon as others) -->
      <button class="icon-btn" style="visibility: visible;"> <!-- Visibile per request if icon needed, otherwise hidden -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      </button>
    </header>

    <!-- Main Content -->
    <!-- Main Content -->
    <div class="content-container">
        
        <!-- Info Section -->
        <div class="info-section">
            <h2 class="info-title">סוגי משמרת</h2>
            <p class="info-text">
                כאן ניתן להגדיר מספר בלתי מוגבל של כל סוגי המשמרות שתרצו,
                כגון משמרת בוקר, לילה, צהריים, מוצש, ועוד.
                כדי לשנות את ההגדרות של המשמרת יש לבחור אותה מהרשימה.
            </p>
        </div>

        <!-- Shift List -->
        <div class="shift-list">
            <div v-for="(type, index) in shiftTypes" :key="type.id" class="shift-item" @click="editShiftType(type)">
                <span class="shift-name-text">{{ type.name }}</span>
            </div>
             <!-- Add empty rows for visual if few items? No, list is dynamic. -->
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
                    <div class="name-input-wrapper" @click="openNameModal">
                         <input type="text" v-model="shiftName" class="name-input" readonly>
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

                <!-- Rates Section (Normal Hours) -->
                <div class="rates-section" style="margin-top: 20px; text-align: right;">
                     <label class="section-label" style="font-weight: 500; color: #444; display: block; margin-bottom: 10px;">תעריפים ושעות:</label>
                     
                     <div v-for="(rate, index) in rates" :key="index" class="rate-item-row" style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                        <!-- Limit (Time) -->
                        <div class="time-box-small" @click="openTimePicker('rate', index)">
                             <input type="text" :value="rate.limit" class="time-input-native" readonly>
                        </div>
                        
                        <!-- Percentage -->
                        <div class="percentage-box-wrapper" @click="openRateModal(index)">
                             <input type="number" :value="rate.value" class="percentage-input" readonly>
                             <span class="percent-sign">%</span>
                        </div>

                         <!-- Actions (Edit/Delete) -->
                         <div class="rate-actions">
                             <!-- Edit (Visual cue, inputs are clickable) -->
                             <button class="action-icon-btn edit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                             </button>
                             <!-- Delete -->
                             <button class="action-icon-btn delete" @click="removeRate(index)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                             </button>
                         </div>
                     </div>

                     <!-- Add Rate Button -->
                     <button class="add-rate-btn" @click="addRate" style="width: 100%; padding: 10px; background: white; border: 1px solid #eee; color: #666; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 500; transition: all 0.2s; margin-top: 10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        הוסף תעריף נוסף
                     </button>
                </div>

                <!-- Rate Inputs -->
                <div class="rate-rows">
                    <!-- Break -->
                    <div class="rate-row">
                        <label style="color: #ff5252; font-weight: 500;">הפסקה (דק'):</label> <!-- Red label as per image -->
                        <div class="input-box-wrapper" @click="openBreakModal">
                            <input type="number" :value="breakTime" class="rate-input read-only-field clickable" readonly>
                        </div>
                    </div>
                    
                    <!-- Extra -->
                    <div class="rate-row">
                        <label>תוספת יומית (ש"ח):</label>
                        <div class="input-box-wrapper" @click="openExtraModal">
                            <input type="number" :value="extraAmount" class="rate-input read-only-field clickable" readonly>
                        </div>
                    </div>

                    <!-- Deduction -->
                    <div class="rate-row">
                        <label>הורדה יומית (ש"ח):</label>
                        <div class="input-box-wrapper" @click="openDeductionModal">
                            <input type="number" :value="deductionAmount" class="rate-input read-only-field clickable" readonly>
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

    <!-- Name Modal -->
    <div v-if="isNameModalOpen" class="input-modal-overlay" @click.self="cancelNameModal">
        <div class="input-modal">
          <div class="input-modal-title">שם המשמרת</div>
          <div class="input-title-divider"></div>
          
          <div class="input-modal-body">
            <p class="input-instruction">נא להכניס שם משמרת</p>
            <input 
                type="text" 
                v-model="nameModalValue" 
                class="modal-input" 
                placeholder="שם המשמרת"
                ref="nameInputRef"
            />
          </div>
          
          <div class="input-modal-footer">
            <button class="modal-btn confirm" @click="confirmNameModal">אישור</button>
            <button class="modal-btn cancel" @click="cancelNameModal">ביטול</button>
          </div>
        </div>
    </div>

    <!-- Rate (Percentage) Modal -->
    <div v-if="isRateModalOpen" class="input-modal-overlay" @click.self="cancelRateModal">
        <div class="input-modal">
          <div class="input-modal-title">תעריף</div>
          <div class="input-title-divider"></div>
          
          <div class="input-modal-body">
            <p class="input-instruction">נא להכניס אחוז תעריף</p>
            <input 
                type="number" 
                v-model="rateModalValue" 
                class="modal-input" 
                placeholder="%"
                ref="rateInputRef"
            />
          </div>
          
          <div class="input-modal-footer">
            <button class="modal-btn confirm" @click="confirmRateModal">אישור</button>
            <button class="modal-btn cancel" @click="cancelRateModal">ביטול</button>
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
        <router-link to="/shift-types" class="menu-item active-menu-item" @click="isMenuOpen = false"> <!-- Active here -->
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </span>
          <span>הגדרת סוג משמרת</span>
        </router-link>
        <router-link to="/settings" class="menu-item" @click="isMenuOpen = false">
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

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
        <button class="nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          <span>סוג משמרות</span>
        </button>
    </nav>
    
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';

import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter(); // For logout redirect
const shiftTypes = computed(() => store.getters.allShiftTypes); // Reactive from store

const isMenuOpen = ref(false);

const checkAndRepairData = async () => {
    await store.dispatch('fetchAdditionsDeductions');
    
    // Check if fixed break exists in store, if not force repair immediately
    const rules = store.getters.allAdditionsDeductions || [];
    const hasFixedBreak = rules.some(r => r.isFixedBreakAuto || r.description?.includes('הפסקה'));
    
    if (!hasFixedBreak) {
        console.log("Quick Repair: no fixed break found in view, triggering repair.");
        await store.dispatch('forceRepairFixedBreak');
    }
};

onMounted(() => {
    checkAndRepairData();
});

const logout = () => {
    store.dispatch('saveToken', null);
    store.commit('SET_USER', null);
    router.push({ name: 'login' });
};

const isModalOpen = ref(false);
const shiftName = ref('');
const shiftColor = ref('#FFFFFF'); // Default circle color
const defaultEntry = ref('07:00');
const defaultExit = ref('16:15');
const breakTime = ref(0);
const extraAmount = ref(0);
const deductionAmount = ref(0);

// Name Modal Logic
const isNameModalOpen = ref(false);
const nameModalValue = ref('');
const nameInputRef = ref(null);

const allRules = computed(() => store.getters.allAdditionsDeductions || []);

const currentShiftId = computed(() => editingTypeId.value);

const calculatedBreak = computed(() => {
    // Robust calculation
    const rules = allRules.value.filter(r => {
        // Check for time-based: 'deduction' + 'time' mode OR legacy 'break' type OR has minutes
        const isTimeBased = (r.type === 'deduction' && r.mode === 'time') || 
                            r.type === 'break' || 
                            (r.minutes && r.minutes > 0);
        
        if (!isTimeBased) return false;

        // Shift Scope Check
        const ruleShiftIds = r.shiftIds || []; // Ensure array
        
        // Global rule (applies to all)
        if (ruleShiftIds.length === 0) return true;

        // Specific rule (applies if current shift ID matches)
        if (currentShiftId.value) {
            // Loose comparison (string/number)
            return ruleShiftIds.some(id => String(id) === String(currentShiftId.value));
        }

        return false;
    });

    const sum = rules.reduce((sum, r) => {
        const val = Number(r.minutes || r.amount || 0);
        return sum + (isNaN(val) ? 0 : val);
    }, 0);
    
    return sum;
});

const calculatedAddition = computed(() => {
    const rules = allRules.value.filter(r => 
        (r.type === 'addition') && 
        (r.mode === 'amount') &&
        (r.period === 'daily') &&
        (r.shiftIds.length === 0 || (currentShiftId.value && r.shiftIds.includes(currentShiftId.value)))
    );
    return rules.reduce((sum, r) => sum + Number(r.amount || 0), 0);
});

const calculatedDeduction = computed(() => {
    const rules = allRules.value.filter(r => 
        (r.type === 'deduction') && 
        (r.mode === 'amount') &&
        (r.period === 'daily') &&
        (r.shiftIds.length === 0 || (currentShiftId.value && r.shiftIds.includes(currentShiftId.value)))
    );
    return rules.reduce((sum, r) => sum + Number(r.amount || 0), 0);
});

const openNameModal = () => {
    nameModalValue.value = shiftName.value;
    isNameModalOpen.value = true;
    nextTick(() => nameInputRef.value?.focus());
};
const confirmNameModal = () => {
    shiftName.value = nameModalValue.value;
    isNameModalOpen.value = false;
};
const cancelNameModal = () => { isNameModalOpen.value = false; };



// Rate Modal Logic
const isRateModalOpen = ref(false);
const rateModalValue = ref('');
const rateInputRef = ref(null);
const currentRateIndex = ref(null);

const openRateModal = (index) => {
    currentRateIndex.value = index;
    rateModalValue.value = rates.value[index].value;
    isRateModalOpen.value = true;
    nextTick(() => rateInputRef.value?.focus());
};
const confirmRateModal = () => {
    if (currentRateIndex.value !== null) {
        rates.value[currentRateIndex.value].value = rateModalValue.value;
    }
    isRateModalOpen.value = false;
};
const cancelRateModal = () => { isRateModalOpen.value = false; };

// Break Modal Logic... (Keep existing)
// ... (Lines 185-285 are largely modal logic, keeping them as is by targeting around line 408)

// Jump to logic section
// ...
const editingTypeId = ref(null);
const rates = ref([]);

const deleteShiftType = (type) => {
    if (type.name === 'בוקר') {
        alert('לא ניתן למחוק משמרת בוקר');
        return;
    }
    if (confirm('האם למחוק סוג משמרת זה?')) {
        store.dispatch('deleteShiftType', type.id);
    }
};

const editingNumericId = ref(null);

const editShiftType = (type) => {
    editingTypeId.value = type.id;
    editingNumericId.value = type.numericId;
    shiftName.value = type.name;
    shiftColor.value = type.color || '#FFFFFF';
    defaultEntry.value = type.entry || '07:00';
    defaultExit.value = type.exit || '16:15';
    
    // Calculate Break from Rules (consistent with OvertimeSettings)
    const allDetailRules = store.getters.allAdditionsDeductions || [];
    const matchingBreakRules = allDetailRules.filter(r => {
        const isTimeBased = (r.type === 'deduction' && r.mode === 'time') || r.type === 'break' || (r.minutes && r.minutes > 0);
        if (!isTimeBased) return false;
        
        const ruleShiftIds = r.shiftIds || [];
        if (ruleShiftIds.length === 0) return true;
        return ruleShiftIds.some(id => String(id) === String(type.id));
    });

    const calculatedBreakVal = matchingBreakRules.reduce((sum, r) => {
        return sum + (Number(r.minutes) || Number(r.amount) || 0);
    }, 0);

    // Calculate Addition/Deduction Defaults from Rules
    const rulesExtra = allDetailRules.filter(r => 
        (r.type === 'addition') && (r.mode === 'amount') && (r.period === 'daily') &&
        ((r.shiftIds || []).length === 0 || (r.shiftIds || []).includes(type.id))
    ).reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const rulesDeduction = allDetailRules.filter(r => 
        (r.type === 'deduction') && (r.mode === 'amount') && (r.period === 'daily') &&
        ((r.shiftIds || []).length === 0 || (r.shiftIds || []).includes(type.id))
    ).reduce((sum, r) => sum + Number(r.amount || 0), 0);

    breakTime.value = calculatedBreakVal || type.break || 0;
    
    // Use Specific value if set (>0), otherwise Global Rule
    const tExtra = type.extra || 0;
    const tDeduction = type.deduction || 0;

    extraAmount.value = tExtra > 0 ? tExtra : rulesExtra;
    deductionAmount.value = tDeduction > 0 ? tDeduction : rulesDeduction;

    rates.value = (type.rates && type.rates.length) 
        ? JSON.parse(JSON.stringify(type.rates)) 
        : [{ limit: '08:00', value: 100 }];
    
    isModalOpen.value = true;
};

const createNewShiftType = () => {
    editingTypeId.value = null;
    editingNumericId.value = null;
    shiftName.value = '';
    shiftColor.value = '#FFFFFF';
    defaultEntry.value = '07:00';
    defaultExit.value = '16:15';
    breakTime.value = 0;
    
    // Calculate Defaults for NEW type (Only "All Shifts" rules apply)
    const allDetailRules = store.getters.allAdditionsDeductions || [];
    
    const rulesExtra = allDetailRules.filter(r => 
        (r.type === 'addition') && (r.mode === 'amount') && (r.period === 'daily') &&
        ((r.shiftIds || []).length === 0)
    ).reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const rulesDeduction = allDetailRules.filter(r => 
        (r.type === 'deduction') && (r.mode === 'amount') && (r.period === 'daily') &&
        ((r.shiftIds || []).length === 0)
    ).reduce((sum, r) => sum + Number(r.amount || 0), 0);

    extraAmount.value = rulesExtra;
    deductionAmount.value = rulesDeduction;
    rates.value = [{ limit: '08:00', value: 100 }];
    isModalOpen.value = true;
};

const saveNewShiftType = () => {
    if (!shiftName.value) {
        alert('נא להזין שם משמרת');
        return;
    }

    // Determine Numeric ID
    let numId = editingNumericId.value;
    if (!numId) {
        const ids = shiftTypes.value.map(t => t.numericId || 0);
        numId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }

    const data = {
        name: shiftName.value,
        numericId: numId,
        color: shiftColor.value,
        entry: defaultEntry.value,
        exit: defaultExit.value,
        break: Number(breakTime.value) || 0,
        extra: Number(extraAmount.value) || 0,
        deduction: Number(deductionAmount.value) || 0,
        rates: rates.value
    };

    if (editingTypeId.value) {
        store.dispatch('updateShiftType', { id: editingTypeId.value, ...data });
    } else {
        store.dispatch('addShiftType', data); // ID auto-generated by backend for new
    }

    isModalOpen.value = false;
};

const addRate = () => {
    let nextValue = 125;
    if (rates.value.length > 0) {
        const lastVal = parseInt(rates.value[rates.value.length - 1].value);
        if (lastVal === 100) nextValue = 125;
        else if (lastVal === 125) nextValue = 150;
        else if (lastVal === 150) nextValue = 175; // or 200 depending on generic law, usually jumps by 25 or to 200
        else nextValue = lastVal + 25;
    }
    rates.value.push({ limit: '02:00', value: nextValue });
};

const removeRate = (index) => {
    rates.value.splice(index, 1);
};

const closeModal = () => {
    isModalOpen.value = false;
};

// ... Break/Extra/Deduction logic remains same ...

// Time Picker State
const isTimePickerOpen = ref(false);
const pickerTarget = ref(null); 
const pickerTitle = ref('');
const tempHour = ref('00');
const tempMinute = ref('00');
const pickerRateIndex = ref(null); // For rate row being edited

// ... Computed neighbors ...

const openTimePicker = (target, index = null) => {
    pickerTarget.value = target;
    pickerRateIndex.value = index;
    
    let timeStr = '00:00';
    if (target === 'entry') {
        pickerTitle.value = 'זמן כניסה';
        timeStr = defaultEntry.value;
    } else if (target === 'exit') {
        pickerTitle.value = 'זמן יציאה';
        timeStr = defaultExit.value;
    } else if (target === 'rate') {
        pickerTitle.value = 'משך שעות';
        timeStr = rates.value[index].limit;
    }

    const [h, m] = timeStr.split(':');
    tempHour.value = h;
    tempMinute.value = m;
    isTimePickerOpen.value = true;
};

const confirmTimePicker = () => {
    formatTimeInputs();
    const newVal = `${tempHour.value}:${tempMinute.value}`;
    
    if (pickerTarget.value === 'entry') defaultEntry.value = newVal;
    else if (pickerTarget.value === 'exit') defaultExit.value = newVal;
    else if (pickerTarget.value === 'rate' && pickerRateIndex.value !== null) {
        rates.value[pickerRateIndex.value].limit = newVal;
    }
    
    isTimePickerOpen.value = false;
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

const closeTimePicker = () => {
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

/* Header (Teal part handled by generic header class, just ensuring content flow) */

/* Content */
.content-container {
    flex: 1;
    overflow-y: auto;
    background: white;
}

.info-section {
    padding: 30px 20px;
    text-align: center; /* Or right? Image shows right aligned text basically */
    text-align: right;
    border-bottom: 2px solid #eee;
}

.info-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #444;
    text-align: right; /* Match image: Title Right */
}

.info-text {
    font-size: 1rem;
    color: #666;
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
    border-bottom: 2px solid #eee; /* Light gray separators */
    display: flex;
    justify-content: center; /* Centered Text */
    align-items: center;
    cursor: pointer;
    background: white;
    transition: background 0.2s;
}

.shift-item:hover {
    background-color: #f9f9f9;
}

.shift-name-text {
    font-size: 1.2rem;
    color: #333;
    font-weight: 500;
}

/* ... Existing Styles for Modals ... */
/* Header */
.header {
  background-color: #0093AB;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  color: white;
  flex-direction: row-reverse; /* Menu Left */
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

/* Sidebar Styles (Common) */
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

/* Bottom Nav */
.bottom-nav {
  height: 60px;
  background-color: #0093AB;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: center; /* Center single item */
  align-items: center;
  flex-shrink: 0;
}

.nav-item {
  flex: 1; /* Stretch but content centered? Or max width */
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  max-width: 200px; /* Limit width of single tab highlight */
}

.nav-item.active {
  color: white;
  font-weight: 700;
}

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
.modal-overlay { 
    position: fixed; 
    top: 0; 
    left: 0; 
    right: 0; 
    bottom: 0; 
    background-color: rgba(0,0,0,0.6); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    z-index: 1000; 
    padding: 20px; 
}

.modal-card { 
    background: white; 
    width: 90%; 
    max-width: 400px; /* Matched AdditionsDeductionsView */
    box-shadow: 0 10px 25px rgba(0,0,0,0.5); 
    display: flex; 
    flex-direction: column; 
    border-radius: 8px; /* Ensure radius */
    overflow: hidden; /* For header/footer radius */
    max-height: 90vh; /* Safety */
}

.modal-header { 
    background-color: #4DB6CD; 
    color: white; 
    text-align: center; 
    padding: 15px; 
    font-size: 1.2rem; 
    font-weight: 500; 
}

.modal-body { 
    padding: 20px; 
    text-align: center; 
    background: #fff; 
    overflow-y: auto;
}

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

.time-box-small {
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0 10px;
    height: 38px;
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.time-box-small .time-input-native {
    border: none;
    background: transparent;
    width: 100%;
    text-align: center;
    font-size: 1rem;
    color: #333;
    font-family: inherit;
    cursor: pointer;
}


/* Percentage Input Styles */
.percentage-box-wrapper {
    position: relative;
    width: 80px;
    height: 38px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.percentage-input {
    width: 100%;
    height: 100%;
    padding: 0 10px;
    border: none;
    background: transparent;
    text-align: center;
    font-size: 1rem;
    color: #333;
    outline: none;
    font-family: inherit;
}

.percent-sign {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
    font-size: 0.8rem;
}

.rate-actions {
    display: flex;
    gap: 5px;
}

.action-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #999;
    padding: 5px;
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
    direction: rtl;
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

.footer-btn.approve { 
    background-color: #00ACC1; 
    border-left: 1px solid rgba(255,255,255,0.3); /* Divider left of approve in RTL */
}
.footer-btn.cancel { 
    background-color: #00ACC1; 
}
.footer-divider {
    width: 1px;
    background-color: rgba(255,255,255,0.3);
    display: none; /* Handled by border on button or flex gap if needed */
}

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
  max-width: 300px; /* Matched image proportions */
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
  border-bottom: 2px solid #29B6F6; /* Blue Underline from image */
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
  display: none; /* Hidden, using border-bottom on input */
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
    border-left: 1px solid #eee; /* Divider */
}

.modal-btn:active {
    background-color: #f5f5f5;
}
.action-icon-btn.delete {
    color: #ff5252;
}

.action-icon-btn:hover {
    background-color: #f0f0f0;
}

.read-only-field {
    background-color: #e9ecef !important; /* Darker grey to be obvious */
    color: #495057;
    border-color: #ced4da;
    pointer-events: none;
    font-weight: bold; /* Make the value pop */
}
</style>
