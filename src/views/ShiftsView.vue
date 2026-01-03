<template>
  <div 
    class="shifts-page"
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
      
      <!-- Center: Title or Timer -->
      <div class="header-title-area">
          <span v-if="activeShift && (isViewingActiveShiftMonth || currentTab === 'entry')">{{ activeShiftTimer }} | {{ activeShiftSalary }} ש"ח</span>
          <span v-else></span> 
      </div>

      <button class="icon-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      </button>
    </header>



    <!-- Content Transition Wrapper -->
    <div class="tabs-container">
      <transition name="horizontal-slide" mode="out-in">
        
        <!-- =======================
             SHIFTS VIEW
             ======================= -->
        <div v-if="currentTab === 'shifts'" class="tab-view shifts-view" key="shifts">
          <!-- Month Selector -->
          <div class="month-selector">
            <span class="month-side">{{ prevMonthLabel }}</span>
            <span class="current-month">{{ currentMonthLabel }}</span>
            <span class="month-side">{{ nextMonthLabel }}</span>
          </div>

          <!-- Table Header -->
          <div class="table-header">
            <div>תאריך</div>
            <div>כניסה</div>
            <div>יציאה</div>
            <div>שעות</div>
            <div>שכר</div>
          </div>

    <!-- Main Content -->
    <main class="content-area">
      <transition :name="transitionName" mode="out-in">
        
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state" key="loading">
           <div class="loader"></div>
        </div>

        <!-- Shifts List -->
        <div v-else-if="shifts.length > 0" class="shifts-list" key="list">
          <div v-for="(shift, index) in shifts" :key="index" class="shift-row" :class="{ 'row-selected': selectedIndices.has(index), 'row-active-red': shift.exit === '--:--' }" @click="handleRowClick(shift, index)">
            <div class="col-date">
              <div class="date-circle" :class="[getShiftTypeClass(shift.type), { selected: selectedIndices.has(index) }]" @click.stop="toggleSelection(index)">
                <template v-if="selectedIndices.has(index)">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </template>
                <template v-else>
                  <span class="day-name">{{ shift.dayName }}</span>
                  <span class="day-number">{{ shift.dayNumber }}</span>
                </template>
              </div>
            </div>
            <div class="col-entry">
               <span v-if="!shift.isVacation">{{ shift.entry }}</span>
            </div>
            <div class="col-exit">
              <span v-if="shift.isVacation" class="vacation-text">{{ shift.type }}</span>
              <span v-else>{{ shift.exit }}</span>
            </div>
            <div class="col-hours">{{ shift.hours }}</div>
            <div class="col-salary">{{ shift.salary }}</div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state" key="empty">
          <div class="hand-icon-wrapper">
             <svg class="hand-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M30 40 L20 50 L30 60" stroke="#00C853" stroke-width="3" stroke-linecap="round"/>
               <path d="M70 40 L80 50 L70 60" stroke="#00C853" stroke-width="3" stroke-linecap="round"/>
               <path d="M50 80 C50 80 45 70 45 60 L45 35 C45 32 47 30 50 30 C53 30 55 32 55 35 L55 55 L58 55 C60 55 62 57 62 60 L60 80" stroke="#9E9E9E" stroke-width="3" fill="none" stroke-linecap="round"/>
               <path d="M40 55 Q 40 45 45 35" stroke="#9E9E9E" stroke-width="2" fill="none"/> 
             </svg>
          </div>
          <p class="empty-text title">אין משמרות</p>
          <p class="empty-text subtitle">לתקופה שנבחרה</p>
        </div>

      </transition>
    </main>


      </div>

      <!-- =======================
           ENTRY VIEW
           ======================= -->
      <div v-else class="tab-view entry-view" key="entry">
        
        <div class="clock-display">
           <span class="clock-digits">{{ currentTime }}</span>
        </div>
        
        <div class="date-display">
          {{ currentDateString }}
        </div>

        <div class="shift-card-container">
           <div class="shift-card">
              <span class="card-label">בחר סוג משמרת:</span>
              <button class="shift-type-selector" @click="openShiftTypeModal(true)">{{ activeShiftType }}</button>

               <div class="shift-times-row">
                  <div class="time-col">
                    <span class="time-label">זמן כניסה</span>
                    <span class="time-value">
                       {{ activeShift ? activeShift.entry : '-- : --' }}
                    </span>
                  </div>
                  <div class="time-col">
                    <span class="time-label">זמן יציאה</span>
                    <span class="time-value">-- : --</span>
                  </div>
               </div>
            </div>
         </div>

         <div class="slider-container" ref="sliderContainer">
            <div class="slider-track">
                <span class="slider-text">{{ sliderText }}</span>
                <div 
                  class="slider-thumb" 
                  ref="sliderThumb"
                  @mousedown="startDrag"
                  @touchstart="startDrag"
                  :style="{ transform: `translateX(${dragX}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease' }"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0093AB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
            </div>
         </div>

      </div>

      </transition>
    </div>

    <!-- Detail Modal -->
    <transition name="fade">
      <div v-if="isDetailModalOpen" class="detail-modal-overlay">
        <div class="detail-modal">
          <div class="detail-header">
            פרטי משמרת
          </div>
          
          <div class="detail-body">
            
            <div class="detail-form-row">
               <label>תאריך:</label>
               <input type="text" :value="editingShift.fullDate" readonly class="input-box" @click="openDateModal" />
            </div>

            <div class="detail-form-row">
               <label>משמרת:</label>
               <input type="text" :value="editingShift.type" readonly class="input-box" @click="openShiftTypeModal(false)" />
            </div>

            <div class="detail-form-row">
               <label>כניסה:</label>
               <input type="text" :value="editingShift.entry" readonly class="input-box" @click="openTimeModal('entry')" />
            </div>

            <div class="detail-form-row">
               <label>
                 יציאה:
                 <input type="checkbox" class="inline-checkbox" />
               </label>
               <div class="input-with-icon">
                 <input type="text" :value="editingShift.exit" readonly class="input-box" @click="openTimeModal('exit')" />
                 <div class="icon-cancel-red">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="red" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                 </div>
               </div>
            </div>

            <div class="detail-form-row">
               <label>הפסקה:</label>
               <div class="input-with-unit">
                 <span class="unit-text">דק'</span>
                 <input type="number" :value="editingShift.break" readonly class="input-box" @click="openBreakModal" />
               </div>
            </div>

            <div class="detail-form-row">
               <label>תוספת יומית:</label>
               <div class="input-with-unit">
                 <span class="unit-text">ש"ח</span>
                 <input type="number" :value="editingShift.extra" readonly class="input-box" @click="openExtraModal" />
               </div>
            </div>

            <div class="detail-form-row">
               <label>הורדה יומית:</label>
               <div class="input-with-unit">
                 <span class="unit-text">ש"ח</span>
                 <input type="number" :value="editingShift.deduction" readonly class="input-box" @click="openDeductionModal" />
               </div>
            </div>

            <div class="detail-form-row notes-row">
               <label class="notes-label">הערות:</label>
                <textarea class="notes-area"></textarea>
            </div>

          </div>

          <div class="detail-footer">
            <button class="footer-btn btn-delete" @click="deleteShift" v-if="editingShiftIndex !== -1">
               <span>מחיקה</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div class="footer-divider"></div>
            <button class="footer-btn btn-cancel" @click="closeDetailModal">
               <span>ביטול</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div class="footer-divider"></div>
            <button class="footer-btn btn-update" @click="updateShift">
               <span>{{ editingShiftIndex === -1 ? 'שמור' : 'עדכן' }}</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Break (הפסקה) Modal -->
    <transition name="fade">
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
    </transition>

    <!-- Extra (הוספה) Modal -->
    <transition name="fade">
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
    </transition>

    <!-- Deduction (הורדה) Modal -->
    <transition name="fade">
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
    </transition>

    <!-- Time Modal (Shared for Entry/Exit) -->
    <transition name="fade">
      <div v-if="isTimeModalOpen" class="input-modal-overlay" @click.self="cancelTimeModal">
        <div class="input-modal">
          <div class="input-modal-title">
             {{ timeModalType === 'entry' ? 'זמן כניסה' : 'זמן יציאה' }}
          </div>
          <div class="input-title-divider"></div>
          
          <div class="time-modal-body">
            <div class="time-picker-container">
               <!-- Hours -->
               <div class="time-column">
                  <div class="time-cell prev" @click="adjustTime('hour', -1)">{{ prevHour }}</div>
                  <div class="time-cell current">
                    <input 
                      type="number" 
                      v-model="tempHour" 
                      @blur="formatTimeInputs"
                      class="time-input"
                    />
                  </div>
                  <div class="time-cell next" @click="adjustTime('hour', 1)">{{ nextHour }}</div>
               </div>
               
               <div class="time-colon">:</div>

               <!-- Minutes -->
               <div class="time-column">
                  <div class="time-cell prev" @click="adjustTime('minute', -1)">{{ prevMinute }}</div>
                  <div class="time-cell current">
                    <input 
                      type="number" 
                      v-model="tempMinute" 
                      @blur="formatTimeInputs"
                      class="time-input"
                    />
                  </div>
                  <div class="time-cell next" @click="adjustTime('minute', 1)">{{ nextMinute }}</div>
               </div>
            </div>
            
            <!-- Blue Dividers for current selection -->
            <div class="time-selection-lines">
               <div class="line top"></div>
               <div class="line bottom"></div>
            </div>
          </div>
          
          <div class="input-modal-footer">
            <button class="modal-btn confirm" @click="confirmTimeModal">אישור</button>
            <button class="modal-btn cancel" @click="cancelTimeModal">ביטול</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Shift Type (סוג משמרת) Modal -->
    <transition name="fade">
      <div v-if="isShiftTypeModalOpen" class="input-modal-overlay shift-selection-overlay" @click.self="cancelShiftTypeModal">
        <div class="input-modal">
          <div class="input-modal-title shift-type-title">
             נא לבחור סוג משמרת
          </div>
          <div class="input-title-divider"></div>
          
          <div class="shift-type-body">
             <label class="shift-type-option" @click.prevent="selectShiftType('בוקר')">
               <span class="option-label">בוקר</span>
               <input type="radio" :checked="tempShiftType === 'בוקר'" class="option-radio" readonly>
             </label>
             
             <label class="shift-type-option" @click.prevent="selectShiftType('שישי')">
               <span class="option-label">שישי</span>
               <input type="radio" :checked="tempShiftType === 'שישי'" class="option-radio" readonly>
             </label>

             <label class="shift-type-option" @click.prevent="selectShiftType('לילה')">
               <span class="option-label">לילה</span>
               <input type="radio" :checked="tempShiftType === 'לילה'" class="option-radio" readonly>
             </label>
          </div>
          
           <!-- Footer hidden as usually radios close on select, but we keep buttons if multiple choices, but user image shows just list. Let's keep existing structure but maybe hide footer if auto-close? 
                Actually user image shows a clean list. The existing code has footer buttons. Let's check user request. "I want it to display as in image".
                Image shows modal with Title "נא לבחור סוג משמרת" (Blue), Line, and List. No footer in crop?
                Wait, looking at full context, simple modals often have confirmation.
                But the image screenshot shows the list. Let's make the list look exactly like it. Clean white.
                We will keep the footer for now unless requested to remove.
           -->
           <div class="input-modal-footer">
            <!-- Optional buttons if needed, but per image it looks like a selection list. Let's keep standard interaction -->
           </div>
        </div>
      </div>
    </transition>

    <!-- Payment Type (סוג תשלום) Modal -->
    <transition name="fade">
      <div v-if="isPaymentTypeModalOpen" class="input-modal-overlay shift-selection-overlay" @click.self="isPaymentTypeModalOpen = false">
        <div class="input-modal">
          <div class="input-modal-title shift-type-title" style="color: #4facfe;">
             נא לבחור סוג תשלום
          </div>
          <div class="input-title-divider" style="background-color: #4facfe;"></div>
          
          <div class="shift-type-body">
             <label class="shift-type-option" @click.prevent="selectPaymentType('חופש')">
               <span class="option-label">חופש</span>
               <input type="radio" :checked="tempPaymentType === 'חופש'" class="option-radio" readonly>
             </label>
             
             <label class="shift-type-option" @click.prevent="selectPaymentType('חג')">
               <span class="option-label">חג</span>
               <input type="radio" :checked="tempPaymentType === 'חג'" class="option-radio" readonly>
             </label>

             <label class="shift-type-option" @click.prevent="selectPaymentType('מחלה')">
               <span class="option-label">מחלה</span>
               <input type="radio" :checked="tempPaymentType === 'מחלה'" class="option-radio" readonly>
             </label>

             <label class="shift-type-option" @click.prevent="selectPaymentType('תשלום חודשי')">
               <span class="option-label">תשלום חודשי</span>
               <input type="radio" :checked="tempPaymentType === 'תשלום חודשי'" class="option-radio" readonly>
             </label>

             <label class="shift-type-option" @click.prevent="selectPaymentType('הבראה')">
               <span class="option-label">הבראה</span>
               <input type="radio" :checked="tempPaymentType === 'הבראה'" class="option-radio" readonly>
             </label>

             <label class="shift-type-option" @click.prevent="selectPaymentType('מילואים')">
               <span class="option-label">מילואים</span>
               <input type="radio" :checked="tempPaymentType === 'מילואים'" class="option-radio" readonly>
             </label>
          </div>
        </div>
      </div>
    </transition>

    <!-- Sick Day Modal (Specific) -->
    <transition name="fade">
      <div v-if="isSickDayModalOpen" class="input-modal-overlay shift-selection-overlay" @click.self="isSickDayModalOpen = false">
        <div class="input-modal">
          <div class="input-modal-title shift-type-title" style="color: #4facfe;">
             נא לבחור יום מחלה
          </div>
          <div class="input-title-divider" style="background-color: #4facfe;"></div>
          
          <div class="shift-type-body">
             <label class="shift-type-option" @click.prevent="selectSickDay('יום מחלה א')">
               <span class="option-label">יום מחלה א</span>
               <input type="radio" :checked="tempSickDayType === 'יום מחלה א'" class="option-radio" readonly>
             </label>
             
             <label class="shift-type-option" @click.prevent="selectSickDay('יום מחלה ב')">
               <span class="option-label">יום מחלה ב</span>
               <input type="radio" :checked="tempSickDayType === 'יום מחלה ב'" class="option-radio" readonly>
             </label>

             <label class="shift-type-option" @click.prevent="selectSickDay('יום מחלה ג')">
               <span class="option-label">יום מחלה ג</span>
               <input type="radio" :checked="tempSickDayType === 'יום מחלה ג'" class="option-radio" readonly>
             </label>

             <label class="shift-type-option" @click.prevent="selectSickDay('יום מחלה ד ומעלה')">
               <span class="option-label">יום מחלה ד ומעלה</span>
               <input type="radio" :checked="tempSickDayType === 'יום מחלה ד ומעלה'" class="option-radio" readonly>
             </label>
          </div>
        </div>
      </div>
    </transition>



    <!-- Monthly Payment Modal -->
    <transition name="fade">
      <div v-if="isMonthlyPaymentModalOpen" class="input-modal-overlay shift-selection-overlay" @click.self="isMonthlyPaymentModalOpen = false">
        <div class="input-modal">
          <div class="input-modal-title shift-type-title" style="color: #4facfe;">
             תשלום חודשי
          </div>
          <div class="input-title-divider" style="background-color: #4facfe;"></div>
          
          <div class="input-modal-body" style="padding: 20px;">
             <label style="display:block; text-align:right; margin-bottom:12px; color:#666; font-size:1rem;">נא להכניס סכום</label>
             <div class="input-with-underscore">
                <input type="number" v-model="monthlyPaymentAmount" placeholder="הקלד סכום" class="transparent-input" />
             </div>
          </div>

          <div class="detail-footer">
               <button class="footer-btn" @click="isMonthlyPaymentModalOpen = false">ביטול</button>
               <div class="footer-divider"></div>
               <button class="footer-btn" @click="confirmMonthlyPayment">אישור</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Recuperation Modal -->
    <transition name="fade">
      <div v-if="isRecuperationModalOpen" class="input-modal-overlay shift-selection-overlay" @click.self="isRecuperationModalOpen = false">
        <div class="input-modal">
          <div class="input-modal-title shift-type-title" style="color: #4facfe;">
             הבראה
          </div>
          <div class="input-title-divider" style="background-color: #4facfe;"></div>
          
          <div class="input-modal-body" style="padding: 20px;">
             <label style="display:block; text-align:right; margin-bottom:12px; color:#666; font-size:1rem;">נא להכניס כמות ימי הבראה</label>
             <div class="input-with-underscore">
                <input type="number" v-model="recuperationDays" placeholder="הקלד ימים" class="transparent-input" />
             </div>
          </div>

          <div class="detail-footer">
               <button class="footer-btn" @click="isRecuperationModalOpen = false">ביטול</button>
               <div class="footer-divider"></div>
               <button class="footer-btn" @click="confirmRecuperation">אישור</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Date Range Modal (New) -->
    <transition name="fade">
      <div v-if="isDateRangeModalOpen" class="input-modal-overlay" @click.self="isDateRangeModalOpen = false">
        <div class="input-modal">
          <div class="input-modal-title">
             בחירת תאריכים עבור {{ tempPaymentType }}
          </div>
          <div class="input-title-divider"></div>
          
          <div class="input-modal-body">
             <div class="detail-form-row">
                <label>התחלה:</label>
                <input type="text" readonly :value="rangeStartDateStr" class="input-box" style="direction: ltr; cursor: pointer;" @click="pickRangeStart" />
             </div>
             <div class="detail-form-row">
                <label>סיום:</label>
                <input type="text" readonly :value="rangeEndDateStr" class="input-box" style="direction: ltr; cursor: pointer;" @click="pickRangeEnd" />
             </div>
          </div>
          
          <div class="input-modal-footer">
            <button class="modal-btn confirm" @click="confirmDateRange">אישור</button>
            <button class="modal-btn cancel" @click="isDateRangeModalOpen = false">ביטול</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Date (תאריך) Modal -->
    <transition name="fade">
      <div v-if="isDateModalOpen" class="input-modal-overlay" @click.self="cancelDateModal">
        <div class="input-modal">
          <div class="input-modal-title">
             תאריך
          </div>
          <div class="input-title-divider"></div>
          
          <div class="time-modal-body" style="direction: ltr;">
            <div class="time-picker-container">
               <!-- Month -->
               <div class="time-column" style="width: 60px;">
                  <div class="time-cell prev" @click="adjustDate('month', -1)">{{ prevMonthName }}</div>
                  <div class="time-cell current">{{ currentMonthName }}</div>
                  <div class="time-cell next" @click="adjustDate('month', 1)">{{ nextMonthName }}</div>
               </div>
               
               <!-- Day -->
               <div class="time-column">
                  <div class="time-cell prev" @click="adjustDate('day', -1)">{{ prevDay }}</div>
                  <div class="time-cell current">
                    <input 
                      type="number" 
                      v-model="tempDay" 
                      @blur="validateDateInputs"
                      class="time-input"
                    />
                  </div>
                  <div class="time-cell next" @click="adjustDate('day', 1)">{{ nextDay }}</div>
               </div>

               <!-- Year -->
               <div class="time-column">
                  <div class="time-cell prev" @click="adjustDate('year', -1)">{{ prevYear }}</div>
                  <div class="time-cell current">
                     <input 
                      type="number" 
                      v-model="tempYear" 
                      class="time-input"
                      style="width: 80px;" 
                    />
                  </div>
                  <div class="time-cell next" @click="adjustDate('year', 1)">{{ nextYear }}</div>
               </div>
            </div>
            
            <!-- Blue Dividers -->
            <div class="time-selection-lines">
               <div class="line top"></div>
               <div class="line bottom"></div>
            </div>
          </div>
          
          <div class="input-modal-footer">
            <button class="modal-btn confirm" @click="confirmDateModal">אישור</button>
            <button class="modal-btn cancel" @click="cancelDateModal">ביטול</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Footer Summary -->
    <div class="footer-summary">
      <div class="summary-item">
        <span class="label">שעות:</span>
        <span class="value">{{ totalHours }}</span>
      </div>
      <div class="summary-item">
        <span class="label">סה"כ:</span>
        <span class="value">{{ totalSalary }}</span>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
       <button class="nav-item" :class="{ active: currentTab === 'shifts' }" @click="currentTab = 'shifts'">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
         <span>משמרות</span>
       </button>
        <button class="nav-item" :class="{ active: currentTab === 'entry' }" @click="currentTab = 'entry'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M12 14v4M10 16h4"/></svg>
          <span>{{ (activeShift && (isViewingActiveShiftMonth || currentTab === 'entry')) ? 'יציאה' : 'כניסה' }}</span>
        </button>
    </nav>

    <!-- FAB Menu -->
    <div v-if="isFabMenuOpen" class="fab-overlay" @click="isFabMenuOpen = false"></div>
    <transition-group name="fab-item" tag="div" class="fab-menu">
      <div 
        v-for="(item, index) in fabOptions" 
        :key="item.id" 
        class="fab-menu-item" 
        @click="handleFabItemClick(item)"
        :style="{ transitionDelay: `${index * 150}ms` }"
      >
        <span class="menu-label">{{ item.label }}</span>
        <span :class="['menu-icon-circle', item.iconClass]">
           <svg v-if="item.isSvg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="item.svgPath"></svg>
           <span v-else class="currency-symbol">{{ item.textIcon }}</span>
        </span>
      </div>
    </transition-group>

    <!-- FAB Button -->
    <button class="fab" v-if="currentTab === 'shifts'" @click.stop="handleFabClick" :class="{ 'delete-mode': isSelectionMode, 'fab-rotate': isFabMenuOpen }">
       <svg v-if="isSelectionMode" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
       <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </button>
    
    <!-- Quick Shift Modal -->
    <transition name="fade">
      <div v-if="isQuickShiftModalOpen" class="input-modal-overlay" @click.self="closeQuickShiftModal">
        <div class="input-modal quick-shift-modal" style="padding: 0; overflow: hidden;">
          <div class="input-modal-header" style="background-color: #4DD0E1; color: white; padding: 15px; text-align: center;">
             <span style="font-size: 1.1rem; font-weight: 500;">משמרת מהירה</span>
          </div>
          <div class="input-modal-body" style="padding: 20px;">
             <div style="text-align: center; color: #777; margin-bottom: 10px;">נא לבחור משמרת מהירה:</div>
             
             <!-- Shift Type Selector (Teal Block) -->
             <button class="shift-type-selector-quick" @click.stop="openShiftTypeModal(true)" style="width: 100%; background-color: #0093AB; color: white; padding: 12px; border: none; border-radius: 4px; margin-bottom: 20px; font-size: 1.1rem; cursor: pointer;">
                {{ activeShiftType }}
             </button>
             
             <!-- Calendar -->
             <div class="calendar-container" style="border: 1px solid #eee; border-radius: 8px; padding: 10px;">
                 <div class="calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 10px; direction: ltr;">
                    <button @click="prevQuickMonth" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color:#333;">&lt;</button>
                    <span style="font-weight: bold; font-size: 1.1rem; color: #555;">{{ quickShiftMonthLabel }}</span>
                    <button @click="nextQuickMonth" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color:#333;">&gt;</button>
                 </div>
                 
                 <!-- Days Header -->
                 <div class="calendar-grid-header" style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 10px; font-weight: bold; color: white; background-color: #0093AB; padding: 8px 0; direction: rtl;">
                    <div>א</div><div>ב</div><div>ג</div><div>ד</div><div>ה</div><div>ו</div><div>ש</div>
                 </div>
                 
                 <!-- Days Grid -->
                 <div class="calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; direction: rtl;">
                     <div v-for="(day, idx) in quickShiftGrid" :key="idx" 
                          class="calendar-day" 
                          :class="{ 'empty': !day, 'pressing': pressingDay === day }"
                          @mousedown="startPress(day)"
                          @touchstart="startPress(day)"
                          @mouseup="endPress(day)"
                          @touchend="endPress(day)"
                          @mouseleave="cancelPress"
                          @touchcancel="cancelPress"
                          style="height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; font-weight: 500; user-select: none;"
                     >
                        {{ day }}
                     </div>
                 </div>
             </div>
             
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast Notification -->
    <transition name="fade-fast">
        <div v-if="toastVisible" class="toast-notification">
            <div class="toast-content">
                <div class="toast-icon-wrapper">
                   <!-- Icon: Info or Check -->
                   <svg v-if="toastType === 'success'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <div class="toast-text">{{ toastMessage }}</div>
            </div>
        </div>
    </transition>

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
        <router-link to="/shifts" class="menu-item" @click="isMenuOpen = false; currentTab = 'shifts'">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </span>
          <span>משמרות</span>
        </router-link>
        <a href="#" class="menu-item">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </span>
          <span>פירוט שכר</span>
        </a>
        <a href="#" class="menu-item">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          </span>
          <span>סידור עבודה</span>
        </a>
        <a href="#" class="menu-item">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </span>
          <span>דוח אקסל</span>
        </a>
        <div class="spacer-small"></div>
        <a href="#" class="menu-item">
          <span class="item-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
          </span>
          <span>הגדרות</span>
        </a>
        <a href="#" class="menu-item">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </span>
          <span>משוב</span>
        </a>
        <a href="#" class="menu-item">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </span>
          <span>עזרה</span>
        </a>
        <div class="spacer-small"></div>
        <a href="#" class="menu-item">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
          </span>
          <span>גיבוי למחשב</span>
        </a>
         <a href="#" class="menu-item">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"></path><polyline points="12 12 17 17 12 22"></polyline><line x1="17" y1="17" x2="6.8" y2="17"></line></svg>
          </span>
          <span>סנכרון לענן</span>
        </a>
      </div>

      <div class="sidebar-footer">
        <span class="version-text">v 2.6</span>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick, onMounted, onUnmounted } from 'vue';

const isMenuOpen = ref(false);
const isFabMenuOpen = ref(false);
const currentTab = ref('shifts'); // 'shifts' or 'entry'

// Selection Logic
const selectedIndices = ref(new Set());
const isSelectionMode = computed(() => selectedIndices.value.size > 0);

const toggleSelection = (index) => {
  if (selectedIndices.value.has(index)) {
    selectedIndices.value.delete(index);
  } else {
    selectedIndices.value.add(index);
  }
  // Trigger update for reactivity if needed (Vue ref of Set might not auto-trigger deeply without help, but replacing Set or resizing usually works. 
  // Let's use a new Set to be sure or just reassign.)
  selectedIndices.value = new Set(selectedIndices.value);
};

const handleFabClick = () => {
  if (isSelectionMode.value) {
    // Delete action
    if (confirm('מחק משמרות נבחרות?')) {
       // Filter out selected
       shifts.value = shifts.value.filter((_, idx) => !selectedIndices.value.has(idx));
       selectedIndices.value = new Set();
    }
  } else {
    // Menu Toggle
    isFabMenuOpen.value = !isFabMenuOpen.value;
  }
};

// Detail Modal Logic
const isDetailModalOpen = ref(false);
const editingShift = reactive({
  fullDate: '',
  type: '',
  entry: '',
  exit: '',
  break: 0,
  extra: 0.0,
  deduction: 0.0,
  notes: ''
});



const editingShiftIndex = ref(-1);

const handleRowClick = (shift, index) => {
  // DEBUG: Check what we are clicking
  const type = shift.type || '';
  console.log('Clicked Row:', index, 'Type:', type);

  const nonEditableKeywords = ['חג', 'חופש', 'מילואים', 'מחלה', 'תשלום חודשי', 'הבראה'];
  
  const isNonEditable = nonEditableKeywords.some(keyword => type.includes(keyword));
  console.log('Is Non Editable?', isNonEditable);

  if (isNonEditable) {
      // Show info/toast instead of opening edit modal
      showToast('info', `מדובר ב${type}`);
      return;
  }

  editingShiftIndex.value = index;
  
  // Populate
  const m = (currentDate.value.getMonth() + 1).toString().padStart(2, '0');
  const y = currentDate.value.getFullYear();
  editingShift.fullDate = shift.fullDate || `${shift.dayNumber}/${m}/${y}`;
  editingShift.type = shift.type || 'בוקר'; 
  editingShift.entry = shift.entry;
  editingShift.exit = shift.exit;
  editingShift.break = shift.break || 0;
  editingShift.extra = shift.extra || 0.0;
  editingShift.deduction = shift.deduction || 0.0;
  editingShift.notes = shift.notes || ''; 
  
  isDetailModalOpen.value = true;
};

const calculateShiftData = (shiftData) => {
    // Basic calculation for Hours and Salary
    let hoursStr = '0:00';
    let salaryStr = '0.00';
    
    // Only calculate if we have full times
    if (shiftData.entry && shiftData.exit && shiftData.entry !== '--:--' && shiftData.exit !== '--:--') {
        const [h1, m1] = shiftData.entry.split(':').map(Number);
        const [h2, m2] = shiftData.exit.split(':').map(Number);
        const d1 = new Date(0,0,0, h1, m1);
        const d2 = new Date(0,0,0, h2, m2);
        
        let diffMs = d2 - d1;
        if (diffMs < 0) diffMs += 24 * 3600 * 1000; // overnight
        
        // Subtract break
        diffMs -= (shiftData.break || 0) * 60 * 1000;
        if (diffMs < 0) diffMs = 0;
        
        const h = Math.floor(diffMs / 3600000);
        const m = Math.floor((diffMs % 3600000) / 60000);
        
        hoursStr = `${h}:${m.toString().padStart(2,'0')}`;
        
        // Salary
        const hoursFloat = diffMs / 3600000;
        const rate = 50; // hardcoded
        let val = hoursFloat * rate;
        
        val += parseFloat(shiftData.extra || 0);
        val -= parseFloat(shiftData.deduction || 0);
        
        if (val < 0) val = 0;
        salaryStr = val.toFixed(2);
    }
    
    return { hoursStr, salaryStr };
};

const checkOverlap = (candidate, ignoreIdx, shiftsList = shifts.value, referenceDate = currentDate.value) => {
    const getShiftTimes = (s) => {
        let dStr = s.fullDate;
        if (!dStr) {
             const d = s.dayNumber.toString().padStart(2, '0');
             const m = (referenceDate.getMonth() + 1).toString().padStart(2, '0');
             const y = referenceDate.getFullYear();
             dStr = `${d}/${m}/${y}`;
        }
        const [day, mon, yr] = dStr.split('/').map(Number);
        
        // If it's a "Vacation", "Holiday" or other Fixed Payment type (isVacation=true), it consumes the WHOLE DAY ideally.
        // Or if we check against a candidate that is Vacation, it conflicts with ANYTHING on that day.
        
        let start = null;
        let end = null;
        let isAllDay = s.isVacation || false;

        // Construct base date timestamp
        const baseDate = new Date(yr, mon - 1, day);
        const baseTime = baseDate.getTime();

        if (isAllDay) {
             // Treat as 00:00 to 23:59:59 (effectively)
             start = baseTime;
             end = baseTime + (24 * 3600 * 1000) - 1; 
        } else {
            if (s.entry && s.entry !== '--:--') {
                 const [h1, m1] = s.entry.split(':').map(Number);
                 start = new Date(yr, mon - 1, day, h1, m1).getTime();
            }

            if (s.exit && s.exit !== '--:--') {
                 const [h2, m2] = s.exit.split(':').map(Number);
                 let endDate = new Date(yr, mon - 1, day, h2, m2);
                 if (start && endDate.getTime() <= start) {
                     endDate.setDate(endDate.getDate() + 1);
                 }
                 end = endDate.getTime();
            }
        }
        
        return { start, end, isAllDay, fullDate: dStr }; // Return fullDate for simple day matching
    };

    const candTimes = getShiftTimes(candidate);
    
    // If candidate is All Day (Vacation/Holiday), it conflicts if ANY shift exists on that day?
    // Or strictly time overlap? 
    // Usually Vacation/Holiday replaces the work day. So yes, if there is a shift, it's a conflict.
    
    if (!candTimes.start && !candTimes.isAllDay) return null; 

    // Find conflicting shift
    const conflict = shiftsList.find((s, i) => {
        if (i === ignoreIdx) return false;
        
        const sTimes = getShiftTimes(s);
        
        // If checking cross-list, simple date check isn't enough if lists are different months, 
        // but getShiftTimes parses fullDate so timestamps are correct absolute time.
        
        if (!sTimes.start) return false; // Existing shift Invalid 

        // If either is All Day and they are on same day -> Overlap
        if (candTimes.isAllDay || sTimes.isAllDay) {
             // Check if they geographically overlap in time?
             // Since we set AllDay to 00:00-23:59, standard time overlap works.
             // But let's be robust: Date String Match might be safer for "Same Day" logic
             if (candTimes.fullDate === sTimes.fullDate) return true;
             
             // What if it's an overnight shift from previous day?
             // Overlap logic: StartA < EndB && EndA > StartB
             // If AllDay is 00:00-24:00, it will catch overnight shifts overlapping into this day.
        }

        if (candTimes.end && sTimes.end) {
            return (candTimes.start < sTimes.end && candTimes.end > sTimes.start);
        } else if (candTimes.end) {
             // Candidate closed, Existing Open (Entry only)
             // Existing Entry inside Candidate?
             return (sTimes.start >= candTimes.start && sTimes.start < candTimes.end);
        } else if (sTimes.end) {
             // Candidate Open, Existing Closed
             return (candTimes.start >= sTimes.start && candTimes.start < sTimes.end);
        } else {
             // Both entries only? 
             // If different times, maybe ok? But dangerous. Let's assume conflict if same day same time?
             // Unlikely case.
             return false;
        }
    });

    return conflict || null;
};

const updateShift = () => {
    if (checkOverlap(editingShift, editingShiftIndex.value)) {
        alert('שגיאה: חפיפה בשעות המשמרת עם משמרת קיימת');
        return;
    }

    // If index is -1, it's a NEW shift
    const { hoursStr, salaryStr } = calculateShiftData(editingShift);

    if (editingShiftIndex.value === -1) {
        // Create New object
        // We need dayNumber and dayName from fullDate
        // fullDate is DD/MM/YYYY
        const [d, mStr, y] = editingShift.fullDate.split('/');
        const dateObj = new Date(y, parseInt(mStr)-1, d);
        const dayName = new Intl.DateTimeFormat('he-IL', { weekday: 'long' }).format(dateObj).replace('יום ', '');
        
        const newShift = {
            dayNumber: d,
            dayName: dayName,
            type: editingShift.type,
            entry: editingShift.entry,
            exit: editingShift.exit,
            break: editingShift.break,
            extra: editingShift.extra,
            deduction: editingShift.deduction,
            fullDate: editingShift.fullDate,
            hours: hoursStr,
            salary: salaryStr,
            isVacation: false
        };
        
        shifts.value.push(newShift);
        
    } else {
        // Update existing
        const updatedShift = {
            ...shifts.value[editingShiftIndex.value], // keep dayNumber etc
            type: editingShift.type,
            entry: editingShift.entry,
            exit: editingShift.exit,
            break: editingShift.break,
            extra: editingShift.extra,
            deduction: editingShift.deduction,
            fullDate: editingShift.fullDate,
            hours: hoursStr,
            salary: salaryStr
        };
        
        shifts.value[editingShiftIndex.value] = updatedShift;
        
        // If we just updated the active shift, we might need to sync it?
        if (activeShift.value && shifts.value.indexOf(activeShift.value) === -1) {
             // Logic to re-sync if needed
        }
    }
    
    closeDetailModal();
};

const deleteShift = () => {
    if (editingShiftIndex.value === -1) return;
    
    if (confirm("להסיר משמרת זו?")) {
        // Check if removing active shift
        if (shifts.value[editingShiftIndex.value] === activeShift.value) {
            activeShift.value = null; // stop timer logic
        }
        shifts.value.splice(editingShiftIndex.value, 1);
        closeDetailModal();
    }
};

const closeDetailModal = () => {
    isDetailModalOpen.value = false;
};

// Break Modal Logic
const isBreakModalOpen = ref(false);
const breakModalValue = ref('');
const breakInputRef = ref(null);

const openBreakModal = () => {
  breakModalValue.value = editingShift.break;
  isBreakModalOpen.value = true;
  nextTick(() => {
    breakInputRef.value?.focus();
  });
};

const confirmBreakModal = () => {
    editingShift.break = breakModalValue.value; 
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
  extraModalValue.value = editingShift.extra;
  isExtraModalOpen.value = true;
  nextTick(() => {
    extraInputRef.value?.focus();
  });
};

const confirmExtraModal = () => {
    editingShift.extra = extraModalValue.value; 
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
  deductionModalValue.value = editingShift.deduction;
  isDeductionModalOpen.value = true;
  nextTick(() => {
    deductionInputRef.value?.focus();
  });
};

const confirmDeductionModal = () => {
    editingShift.deduction = deductionModalValue.value; 
    isDeductionModalOpen.value = false;
};

const cancelDeductionModal = () => {
    isDeductionModalOpen.value = false;
};

// Time Modal Logic (Entry/Exit)
const isTimeModalOpen = ref(false);
const timeModalType = ref('entry'); // 'entry' or 'exit'
const tempHour = ref('00');
const tempMinute = ref('00');

// Computed neighbors for visual spinner effect
const prevHour = computed(() => {
  const h = parseInt(tempHour.value);
  const val = (h + 1) % 24; // Image shows ascending order upwards? Actually normally standard is: Top=Prev, Bottom=Next.
  // User image: Center 07. Top 06. Bottom 08.
  // So Top is (Current - 1), Bottom is (Current + 1).
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

const openTimeModal = (type) => {
  timeModalType.value = type;
  const timeStr = type === 'entry' ? editingShift.entry : editingShift.exit;
  if (timeStr && timeStr.includes(':')) {
    const [h, m] = timeStr.split(':');
    tempHour.value = h;
    tempMinute.value = m;
  } else {
    const now = new Date();
    tempHour.value = now.getHours().toString().padStart(2, '0');
    tempMinute.value = now.getMinutes().toString().padStart(2, '0');
  }
  isTimeModalOpen.value = true;
};

const adjustTime = (unit, delta) => {
    // Note: If Top is PREV (Current-1) and I click Top, do I want to GO to that number?
    // Usually clicking "06" above "07" means "Select 06".
    // "06" is (Current - 1). So delta should be -1.
    // However, the Image shows Top=06, Center=07, Bottom=08.
    // If I click 06 (Top), I want to Decrement.
    // My template calls adjustTime('hour', 1) for prev. 
    // Let's fix template logic -> Top is Prev -> Decrement.
    // Wait, let's just make adjustTime handle the visually intuitive action.
    
    if (unit === 'hour') {
        let val = parseInt(tempHour.value) + delta; // delta should be -1 for top, +1 for bottom
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

const confirmTimeModal = () => {
    formatTimeInputs();
    const finalTime = `${tempHour.value}:${tempMinute.value}`;
    
    if (timeModalType.value === 'exit') {
        // Validation: Exit > Entry
        // Compare "HH:MM" strings works for 24h format if padded correctly
        if (finalTime <= editingShift.entry) {
             alert('שגיאה: זמן יציאה חייב להיות גדול מזמן כניסה');
             return;
        }
        editingShift.exit = finalTime;
    } else {
        editingShift.entry = finalTime;
    }
    
    isTimeModalOpen.value = false;
};

const cancelTimeModal = () => {
    isTimeModalOpen.value = false;
};

// Shift Type Modal Logic
const isShiftTypeModalOpen = ref(false);
const tempShiftType = ref('');
const isEntryMode = ref(false);
const activeShiftType = ref('בוקר');

const openShiftTypeModal = (forEntry = false) => {
  isEntryMode.value = forEntry;
  if (forEntry) {
      tempShiftType.value = activeShiftType.value;
  } else {
      tempShiftType.value = editingShift.type || 'בוקר';
  }
  isShiftTypeModalOpen.value = true;
};

const confirmShiftTypeModal = () => {
  if (isEntryMode.value) {
      activeShiftType.value = tempShiftType.value;
  } else {
      editingShift.type = tempShiftType.value;
  }
  if (isEntryMode.value && activeShiftType.value !== tempShiftType.value) {
      activeShiftType.value = tempShiftType.value;
  } else if (!isEntryMode.value && editingShift.type !== tempShiftType.value) {
      editingShift.type = tempShiftType.value;
  }
  isShiftTypeModalOpen.value = false;
};

// Watch for temp change to auto-close if mimicking native like behavior or just waiting for selection?
// Image shows radios. User said "when I click morning". It implies immediate action? 
// The image shows radio buttons UNSELECTED or SELECTED.
// But lets make it select-and-close if desired, or just standard.
// "Rectificatif, lorsque l on clique sur בוקר, je veux que s affiche tel que dans l image"
// This means: "Correction, when I click on 'Morning', I want it to display AS IN THE IMAGE".
// The image SHOWS a modal with 'Morning', 'Friday', 'Night' with radio buttons.
// This modal appears presumably after clicking the "Shift Type" (Morning) button.
// So the request is about the STYLE of this modal.
// I have removed the footer buttons to clean it up, but we need a way to close/confirm.
// Let's attach the click action on the Label to confirm immediately?
// Or keep it simple: Select -> Auto Confirm?
// Let's modify the template to call confirm on change.

const selectShiftType = (type) => {
    tempShiftType.value = type;
    confirmShiftTypeModal();
};

const cancelShiftTypeModal = () => {
  isShiftTypeModalOpen.value = false;
};

// Date Modal Logic
const isDateModalOpen = ref(false);
const tempDay = ref(1);
const tempMonth = ref(0); // 0-11
const tempYear = ref(2025);

const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

const mapMonthName = (idx) => monthNames[(idx + 12) % 12];

const prevMonthName = computed(() => mapMonthName(tempMonth.value - 1));
const currentMonthName = computed(() => mapMonthName(tempMonth.value));
const nextMonthName = computed(() => mapMonthName(tempMonth.value + 1));

const prevDay = computed(() => {
    const d = tempDay.value - 1;
    return d < 1 ? 31 : d; // Simplified cyclic
});
const nextDay = computed(() => {
    const d = tempDay.value + 1;
    return d > 31 ? 1 : d;
});
const prevYear = computed(() => tempYear.value - 1);
const nextYear = computed(() => tempYear.value + 1);

const openDateModal = () => {
    // Parse current date "DD/MM/YYYY" -- Note: In handleRowClick we set it as `${shift.dayNumber}/12/2025` or similar.
    // Let's protect against empty string
    const dateStr = editingShift.fullDate;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        tempDay.value = parseInt(parts[0]);
        tempMonth.value = parseInt(parts[1]) - 1; // 0-based
        tempYear.value = parseInt(parts[2]);
    } else {
        const now = new Date();
        tempDay.value = now.getDate();
        tempMonth.value = now.getMonth();
        tempYear.value = now.getFullYear();
    }
    isDateModalOpen.value = true;
};

const adjustDate = (unit, delta) => {
    if (unit === 'month') {
        let m = tempMonth.value + delta;
        tempMonth.value = (m + 12) % 12;
    } else if (unit === 'day') {
        let d = tempDay.value + delta;
        // Simple 1-31 cycle for now, could be smarter based on month
        if (d < 1) d = 31;
        if (d > 31) d = 1;
        tempDay.value = d;
    } else if (unit === 'year') {
        tempYear.value += delta;
    }
};

const validateDateInputs = () => {
    // Basic clamping
    if (tempDay.value < 1) tempDay.value = 1;
    if (tempDay.value > 31) tempDay.value = 31;
};

let datePickerResolve = null;

const pickDate = (initialDateStr) => {
    return new Promise((resolve) => {
        datePickerResolve = resolve;
        
        let dVal, mVal, yVal;
        const parts = (initialDateStr || '').split('/');
        if (parts.length === 3) {
            dVal = parseInt(parts[0]);
            mVal = parseInt(parts[1]) - 1;
            yVal = parseInt(parts[2]);
        } else {
            const now = new Date();
            dVal = now.getDate();
            mVal = now.getMonth();
            yVal = now.getFullYear();
        }
        
        tempDay.value = dVal;
        tempMonth.value = mVal;
        tempYear.value = yVal;
        isDateModalOpen.value = true;
    });
};

const confirmDateModal = () => {
    // Save back as DD/MM/YYYY
    const d = tempDay.value.toString().padStart(2, '0');
    const m = (tempMonth.value + 1).toString().padStart(2, '0');
    const y = tempYear.value;
    const dateStr = `${d}/${m}/${y}`;
    
    if (datePickerResolve) {
        datePickerResolve(dateStr);
        datePickerResolve = null;
    } else {
        editingShift.fullDate = dateStr;
    }
    isDateModalOpen.value = false;
};

const cancelDateModal = () => {
    isDateModalOpen.value = false;
    if (datePickerResolve) {
        datePickerResolve(null);
        datePickerResolve = null;
    }
};

// Entry View Data
const currentTime = ref('');
const currentDateString = ref('');

const updateClock = () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    currentTime.value = `${h} ${m}`;
    
    // Date: Hebrew Date + DD/MM/YYYY
    // Simple robust formatting
    try {
        const jewishParts = new Intl.DateTimeFormat('he-IL', { calendar: 'hebrew', day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }).formatToParts(now);
        // reconstruct
        // e.g. "יום חמישי", " ", "י״א", " ", "בטבת", " ", "תשפ״ו"
        const dayName = jewishParts.find(p => p.type === 'weekday')?.value || '';
        const day = jewishParts.find(p => p.type === 'day')?.value || '';
        const month = jewishParts.find(p => p.type === 'month')?.value || '';
        const year = jewishParts.find(p => p.type === 'year')?.value || '';
        
        const jewishDateStr = `${dayName}, ${day} ${month} ${year}`;
        
        const d = now.getDate().toString().padStart(2, '0');
        const mo = (now.getMonth() + 1).toString().padStart(2, '0');
        const y = now.getFullYear();
        const gregorianDate = `${d}/${mo}/${y}`;
        
        currentDateString.value = `${jewishDateStr} | ${gregorianDate}`;
    } catch (e) {
        currentDateString.value = now.toLocaleDateString('he-IL') + ' | ' + now.toLocaleDateString('en-GB');
    }
};

let clockInterval = null;

onMounted(() => {
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
});

// Active Shift Logic
const activeShift = ref(null);
const activeShiftTimer = ref('00:00:00');
const activeShiftSalary = ref('0.00');
let timerInterval = null;

const startTimer = (startTime) => {
    if (timerInterval) clearInterval(timerInterval);
    
    // Parse startTime HH:MM
    const [startH, startM] = startTime.split(':').map(Number);
    const startObj = new Date();
    startObj.setHours(startH, startM, 0, 0);

    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = now - startObj;
        
        // Format HH:MM:SS
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        
        activeShiftTimer.value = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        
        const secondsTotal = diff / 1000;
        const hourlyRate = 50; 
        const salary = (secondsTotal / 3600) * hourlyRate;
        activeShiftSalary.value = salary.toFixed(2);
        
    activeShiftSalary.value = salary.toFixed(2);
        
    }, 1000);
};

const getShiftTypeClass = (type) => {
    if (!type) return '';
    if (type.includes('מחלה')) return 'bg-sick';
    if (type.includes('חופש')) return 'bg-vacation';
    if (type.includes('חג')) return 'bg-holiday';
    if (type.includes('תשלום חודשי')) return 'bg-monthly';
    if (type.includes('הבראה')) return 'bg-recuperation';
    if (type.includes('מילואים')) return 'bg-vacation'; // Same as vacation
    return '';
};

const handleEntry = () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const entryTime = `${h}:${m}`;
    const dayName = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'][now.getDay()];
    const dayNumber = now.getDate().toString();
    
    // Constraint: We only allow adding if the viewed month matches current month. 
    // This check is now done in handleSliderAction before calling this.
    // We removed the auto-switch logic.
    
    const newShift = reactive({ 
        dayNumber: dayNumber, 
        dayName: dayName, 
        entry: entryTime, 
        exit: '--:--', 
        hours: '0:00', 
        salary: '0.00', 
        isVacation: false, 
        type: activeShiftType.value,
        fullDate: new Intl.DateTimeFormat('en-GB').format(now),
        break: 0,
        extra: 0,
        deduction: 0
    });
    
    // VALIDATE OVERLAP -- Pass newShift, ignore index (-1), shifts.value (current list), and now
    if (checkOverlap(newShift, -1, shifts.value, now)) {
        showToast('error', 'שגיאה: חפיפה בשעות המשמרת עם משמרת קיימת');
        dragX.value = 0; // Reset slider
        return;
    }

    shifts.value.push(newShift);
    
    // Set Active
    activeShift.value = newShift;
    startTimer(entryTime);

    // 2. Wait 2 seconds then Switch to shifts tab
    setTimeout(() => {
        currentTab.value = 'shifts';
    }, 2000);
};

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
    if (clockInterval) clearInterval(clockInterval);
});

// Slider Logic
const sliderContainer = ref(null);
const dragX = ref(0);
const isDragging = ref(false);

const sliderText = computed(() => activeShift.value ? 'גלול ימינה ליציאה' : 'גלול ימינה לכניסה');

const startDrag = (e) => {
    isDragging.value = true;
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', onDrag);
    window.addEventListener('touchend', endDrag);
};

const onDrag = (e) => {
    if (!isDragging.value) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const container = sliderContainer.value.getBoundingClientRect();
    const startX = container.left; // Thumb starts at left
    
    // In RTL, "Right" is actually negative direction usually, but let's check visual layout.
    // The image shows Arrow on LEFT, Text on RIGHT.
    // "Slide to Right" -> arrow moves -> right.
    // LTR coordinates: x increases to right.
    
    let x = clientX - startX - 25; // center offset approx
    const max = container.width - 56; // width of thumb
    
    if (x < 0) x = 0;
    if (x > max) x = max;
    
    dragX.value = x;
};

const endDrag = () => {
    if (!isDragging.value) return;
    isDragging.value = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('touchend', endDrag);
    
    // Check threshold
    const container = sliderContainer.value.getBoundingClientRect();
    const max = container.width - 56;
    
    if (dragX.value > max * 0.8) {
        // Trigger
        dragX.value = max; // snap to end
        handleSliderAction();
        // Reset after delay handled by action
    } else {
        // Reset
        dragX.value = 0;
    }
};

const handleSliderAction = () => {
    if (activeShift.value) {
        // Exit Logic
        const now = new Date();
        const h = now.getHours().toString().padStart(2, '0');
        const m = now.getMinutes().toString().padStart(2, '0');
        const exitTime = `${h}:${m}`;
        
        // VALIDATE OVERLAP FOR EXIT
        // We create a temporary copy with the proposed exit time to test
        const candidate = { ...activeShift.value, exit: exitTime };
        const idx = shifts.value.indexOf(activeShift.value);
        
        if (checkOverlap(candidate, idx, shifts.value, now)) {
             showToast('error', 'שגיאה: חפיפה בשעות המשמרת עם משמרת קיימת');
             dragX.value = 0; // Reset slider
             return;
        }

        activeShift.value.exit = exitTime;
        const { hoursStr, salaryStr } = calculateShiftData(activeShift.value);
        activeShift.value.hours = hoursStr;
        activeShift.value.salary = salaryStr;
        
        if (timerInterval) clearInterval(timerInterval);
        
        setTimeout(() => {
            activeShift.value = null; 
            activeShiftTimer.value = '00:00:00';
            activeShiftSalary.value = '0.00';
            dragX.value = 0; // Reset slider position
            currentTab.value = 'shifts';
        }, 1500);

    } else {
        // Entry Validation
        const now = new Date();
        const viewingMonth = currentDate.value.getMonth();
        const viewingYear = currentDate.value.getFullYear();
        
        const isSameMonth = now.getMonth() === viewingMonth && now.getFullYear() === viewingYear;
        
        if (!isSameMonth) {
             // Auto-switch to current month instead of blocking
             currentDate.value = now;
             
             // Wait for fetch to complete before adding the new shift to avoid overwrite
             fetchShifts(now).then(() => {
                 handleEntry(); // Now contains validation
                 setTimeout(() => { dragX.value = 0; }, 2000); 
             });
             return;
        }

        // Already on same month
        handleEntry(); // Now contains validation
        setTimeout(() => { dragX.value = 0; }, 2000); 
    }
};



const isViewingActiveShiftMonth = computed(() => {
    if (!activeShift.value) return false;
    
    // activeShift.fullDate is "DD/MM/YYYY" (from en-GB formatting)
    const [d, m, y] = activeShift.value.fullDate.split('/');
    const activeMonth = parseInt(m) - 1; // 0-based
    const activeYear = parseInt(y);
    
    const viewingMonth = currentDate.value.getMonth();
    const viewingYear = currentDate.value.getFullYear();
    
    return activeMonth === viewingMonth && activeYear === viewingYear;
});

// Entry Tab specific shift type selector state
// activeShiftType defined earlier

// Payment Type Modal Logic
const isPaymentTypeModalOpen = ref(false);
const tempPaymentType = ref('');

// Sick Modal State
const isSickDayModalOpen = ref(false);
const tempSickDayType = ref('יום מחלה א');

// Monthly Payment State
const isMonthlyPaymentModalOpen = ref(false);
const monthlyPaymentAmount = ref('');

// Recuperation State
const isRecuperationModalOpen = ref(false);
const recuperationDays = ref('');

// Date Range Modal Logic
const isDateRangeModalOpen = ref(false);
const rangeStartDateStr = ref('');
const rangeEndDateStr = ref('');

const selectPaymentType = (type) => {
    tempPaymentType.value = type;
    isPaymentTypeModalOpen.value = false;
    
    if (type === 'מחלה') {
        isSickDayModalOpen.value = true;
        tempSickDayType.value = 'יום מחלה א';
        return;
    }
    
    if (type === 'תשלום חודשי') {
        isMonthlyPaymentModalOpen.value = true;
        monthlyPaymentAmount.value = '';
        return;
    }

    if (type === 'הבראה') {
        isRecuperationModalOpen.value = true;
        recuperationDays.value = '';
        return;
    }
    
    // Default range to current view or today
    const now = new Date();
    // format DD/MM/YYYY for input type text (custom picker)
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const d = now.getDate().toString().padStart(2, '0');
    
    rangeStartDateStr.value = `${d}/${m}/${y}`;
    rangeEndDateStr.value = `${d}/${m}/${y}`;
    
    isDateRangeModalOpen.value = true;
};

// Sick Day Logic
const selectSickDay = async (subType) => {
    tempSickDayType.value = subType;
    isSickDayModalOpen.value = false;
    
    // Open Date Picker (Single Date)
    const now = new Date();
    const d = now.getDate().toString().padStart(2, '0');
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const y = now.getFullYear();
    const defaultDate = `${d}/${m}/${y}`;
    
    const chosenDateStr = await pickDate(defaultDate);
    
    if (chosenDateStr) {
        confirmSickDay(chosenDateStr);
    }
};

const confirmSickDay = (dateStr) => {
    // Parse dateStr DD/MM/YYYY
    const [d, mStr, yVal] = dateStr.split('/');
    const dStr = d.toString().padStart(2, '0');
    const mStrOp = mStr.toString().padStart(2, '0'); // mStr might be '1' or '01'
    const year = parseInt(yVal);
    
    // Date Object for check
    const dateObj = new Date(year, parseInt(mStrOp) - 1, parseInt(dStr));
    const dayName = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'][dateObj.getDay()];
    const fullDate = `${dStr}/${mStrOp}/${year}`;

    const newShift = {
        dayNumber: dStr,
        dayName: dayName,
        fullDate: fullDate,
        type: tempSickDayType.value,
        entry: '--:--',
        exit: '--:--',
        hours: '8:00',
        salary: '360.00',
        break: 0,
        extra: 0,
        deduction: 0,
        isVacation: true,
        notes: tempSickDayType.value
    };

    // Determine target view key
    // We check against the MONTH of the NEW SHIFT, not necessarily current view?
    // Actually current logic uses mockData[key]. Key is from newShift.
    const key = `${year}-${mStrOp}`;
    
    // Current View Key
    const viewY = currentDate.value.getFullYear();
    const viewM = (currentDate.value.getMonth() + 1).toString().padStart(2, '0');
    const viewKey = `${viewY}-${viewM}`;

    let targetList = (key === viewKey) ? shifts.value : (mockData[key] || []);

    const conflict = checkOverlap(newShift, -1, targetList, dateObj);
    if (conflict) {
            const conflictDesc = conflict.isVacation ? conflict.type : `${conflict.entry}-${conflict.exit}`;
            alert(`שגיאה: חפיפה בתאריך ${fullDate} עם משמרת קיימת (${conflictDesc}).\nלא ניתן להוסיף ${tempSickDayType.value}.`);
            return; 
    }

    if (key === viewKey) {
            shifts.value.push(newShift);
    } else {
            if (targetList.length === 0 && !mockData[key]) {
                mockData[key] = [];
                targetList = mockData[key];
            }
            targetList.push(newShift);
    }
    
    showToast('success', `נוסף: ${tempSickDayType.value}`);
};


const confirmMonthlyPayment = () => {
    if (!monthlyPaymentAmount.value) {
        alert('יש להזין סכום');
        return;
    }
    
    const now = new Date();
    // Use first day of month? Or Today? User didn't specify. Today is safest.
    // Actually Monthly Payment usually implies "For this month".
    // I'll put it on the 1st of the VIEWED month if possible? 
    // Logic: If I am viewing Feb, I want to add for Feb.
    // But currently I am using `currentDate.value` for view.
    // Let's use `currentDate.value` (Viewed Month).
    // Ensure it's valid date (e.g. 1st).
    
    const dObj = new Date(currentDate.value);
    dObj.setDate(1); // 1st of view month
    
    const d = dObj.getDate().toString().padStart(2, '0');
    const m = (dObj.getMonth() + 1).toString().padStart(2, '0');
    const y = dObj.getFullYear();
    const fullDate = `${d}/${m}/${y}`;
    const dayName = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'][dObj.getDay()];

    const newShift = {
        dayNumber: d,
        dayName: dayName,
        fullDate: fullDate,
        type: 'תשלום חודשי',
        entry: '--:--',
        exit: '--:--',
        hours: '0:00',
        salary: parseFloat(monthlyPaymentAmount.value).toFixed(2),
        break: 0,
        extra: 0,
        deduction: 0,
        isVacation: true,
        notes: 'תשלום חודשי'
    };

    // Assuming we are viewing the target month
    // If overlap?
    // "Monthly Payment" on 1st might overlap with existing shift on 1st.
    // If conflict, maybe allow? or Block?
    // If it's pure payment, maybe allow.
    // But checkOverlap will block.
    // Let's try to add overlap check but maybe warn only?
    // Or just let it block and user has to delete shift on 1st?
    // "Bonus" usually shouldn't block.
    // I'll disable overlap check for 'תשלום חודשי'?
    // Wait, ref to `checkOverlap`: it checks timestamps.
    // 'תשלום חודשי': entry --:--.
    // `checkOverlap` returns null if !candTimes.start && !candTimes.isAllDay.
    // `isVacation`=true implies `isAllDay`=true in `checkOverlap`?
    // Yes.
    // So it WILL block.
    // I should make `isVacation`=false for 'תשלום חודשי'?
    // But then UI hides entry/exit col?
    // Let's keep isVacation=true.
    // I won't check overlap for this specific type to allow co-existence.
    
    // Add directly
     const viewM = (currentDate.value.getMonth() + 1).toString().padStart(2, '0');
     const viewY = currentDate.value.getFullYear();
     const viewKey = `${viewY}-${viewM}`;
     const key = `${y}-${m}`;
     
     if (key === viewKey) {
            shifts.value.push(newShift);
    } else {
            if (!mockData[key]) mockData[key] = [];
            mockData[key].push(newShift);
    }
    
    isMonthlyPaymentModalOpen.value = false;
    showToast('success', `נוסף תשלום חודשי: ${newShift.salary}`);
};

const confirmRecuperation = () => {
    if (!recuperationDays.value) {
        alert('יש להזין כמות ימים');
        return;
    }
    
    const days = parseFloat(recuperationDays.value);
    if (isNaN(days) || days <= 0) return;
    
    // Formula: Days * 8 * 45
    const totalSalary = days * 8 * 45;
    
    // Create Entry (Today/1st of Month)
    const dObj = new Date(currentDate.value);
    dObj.setDate(1); 
    
    const d = dObj.getDate().toString().padStart(2, '0');
    const m = (dObj.getMonth() + 1).toString().padStart(2, '0');
    const y = dObj.getFullYear();
    const fullDate = `${d}/${m}/${y}`;
    const dayName = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'][dObj.getDay()];

    const newShift = {
        dayNumber: d,
        dayName: dayName,
        fullDate: fullDate,
        type: 'הבראה',
        entry: '--:--',
        exit: '--:--',
        hours: '0:00',
        salary: totalSalary.toFixed(2),
        break: 0,
        extra: 0,
        deduction: 0,
        isVacation: true,
        notes: `הבראה (${days} ימים)`
    };

     const viewM = (currentDate.value.getMonth() + 1).toString().padStart(2, '0');
     const viewY = currentDate.value.getFullYear();
     const viewKey = `${viewY}-${viewM}`;
     const key = `${y}-${m}`;
     
     if (key === viewKey) {
            shifts.value.push(newShift);
    } else {
            if (!mockData[key]) mockData[key] = [];
            mockData[key].push(newShift);
    }
    
    isRecuperationModalOpen.value = false;
    showToast('success', `ניצול הבראה: ${days} ימים`);
};

const pickRangeStart = async () => {
    const d = await pickDate(rangeStartDateStr.value);
    if (d) rangeStartDateStr.value = d;
};

const pickRangeEnd = async () => {
    const d = await pickDate(rangeEndDateStr.value);
    if (d) rangeEndDateStr.value = d;
};

const confirmDateRange = () => {
    if (!rangeStartDateStr.value || !rangeEndDateStr.value) return;
    
    const [d1, m1, y1] = rangeStartDateStr.value.split('/').map(Number);
    const start = new Date(y1, m1 - 1, d1);
    
    const [d2, m2, y2] = rangeEndDateStr.value.split('/').map(Number);
    const end = new Date(y2, m2 - 1, d2);
    
    if (end < start) {
        alert("תאריך סיום חייב להיות גדול או שווה לתאריך התחלה");
        return;
    }
    
    // Iterate
    const current = new Date(start);
    let count = 0;
    
    while (current <= end) {
        const d = current.getDate().toString().padStart(2, '0');
        const m = (current.getMonth() + 1).toString().padStart(2, '0');
        const y = current.getFullYear();

        const fullDate = `${d}/${m}/${y}`;
        const dayName = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'][current.getDay()];
        
        const newShift = {
            dayNumber: d,
            dayName: dayName,
            fullDate: fullDate,
            type: tempPaymentType.value,
            entry: '--:--',
            exit: '--:--',
            hours: '8:00',
            salary: '360.00',
            break: 0,
            extra: 0,
            deduction: 0,
            isVacation: true,
            notes: tempPaymentType.value
        };
        
        // Add to correct data list (handle cross-month)
        const key = `${y}-${m}`;
        
        // Determine current view key
        const viewY = currentDate.value.getFullYear();
        const viewM = (currentDate.value.getMonth() + 1).toString().padStart(2, '0');
        const viewKey = `${viewY}-${viewM}`;

        // Get target list for overlap check
        // If we are in the same month, use shifts.value (reactive) to ensure we check against latest added in this loop
        let targetList = (key === viewKey) ? shifts.value : (mockData[key] || []);

        // Check for overlaps with this specific day
        const conflict = checkOverlap(newShift, -1, targetList, current);
        if (conflict) {
             const conflictDesc = conflict.isVacation ? conflict.type : `${conflict.entry}-${conflict.exit}`;
             alert(`שגיאה: חפיפה בתאריך ${fullDate} עם משמרת קיימת (${conflictDesc}).\nלא ניתן להוסיף ${tempPaymentType.value}.`);
             return; 
        }
        
        // Add to list
        if (key === viewKey) {
             shifts.value.push(newShift);
             // Since shifts.value proxies the array in mockData, mockData is updated implicitly.
        } else {
             if (targetList.length === 0 && !mockData[key]) {
                  mockData[key] = [];
                  targetList = mockData[key];
             }
             targetList.push(newShift);
        }
        
        // Next day
        current.setDate(current.getDate() + 1);
        count++;
    }
    
    showToast('success', `נוספו ${count} רשומות של ${tempPaymentType.value}`);
    isDateRangeModalOpen.value = false;
};

const menuItems = [
  {
    id: 1,
    label: 'משמרת מהירה',
    iconClass: 'red',
    isSvg: true,
    // History / Restore icon
    svgPath: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"></path><path d="M3 3v9h9"></path>',
  },
  {
    id: 2,
    label: 'משמרת חדשה',
    iconClass: 'teal',
    isSvg: true,
    // Calendar Plus
    svgPath: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M10 16h4"/><path d="M12 14v4"/>',
  },
  {
    id: 3,
    label: 'תשלום קבוע',
    iconClass: 'teal',
    isSvg: false,
    textIcon: '₪',
  }
];

const fabOptions = computed(() => isFabMenuOpen.value ? menuItems : []);

// Date State
const currentDate = ref(new Date());

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
};

const currentMonthLabel = computed(() => formatDate(currentDate.value));

const prevMonthLabel = computed(() => {
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() - 1);
  return formatDate(d);
});

const nextMonthLabel = computed(() => {
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() + 1);
  return formatDate(d);
});

// Mock Data
const mockData = {
  '2025-12': [
    { dayNumber: '23', dayName: 'שלישי', entry: '11:29', exit: '16:29', hours: '8:00', salary: '360.00', isVacation: false, type: 'regular' },
    { dayNumber: '24', dayName: 'רביעי', entry: '11:29', exit: '16:29', hours: '5:00', salary: '225.00', isVacation: false, type: 'regular' },
    { dayNumber: '28', dayName: 'ראשון', entry: '12:00', exit: '22:00', hours: '9:15', salary: '430.31', isVacation: false, type: 'regular' },
    { dayNumber: '29', dayName: 'שני',   entry: '07:00', exit: '16:15', hours: '9:15', salary: '430.31', isVacation: false, type: 'regular' },
  ],
  // Add more months if needed
  '2026-01': [
    { dayNumber: '02', dayName: 'שישי', entry: '08:00', exit: '14:00', hours: '6:00', salary: '300.00', isVacation: false, type: 'שישי' },
    { dayNumber: '04', dayName: 'ראשון', entry: '07:00', exit: '16:00', hours: '9:00', salary: '450.00', isVacation: false, type: 'בוקר' },
    { dayNumber: '05', dayName: 'שני',   entry: '22:00', exit: '06:00', hours: '8:00', salary: '400.00', isVacation: false, type: 'לילה' },
    { dayNumber: '08', dayName: 'חמישי', entry: '08:00', exit: '17:00', hours: '9:00', salary: '450.00', isVacation: false, type: 'בוקר' },
  ],
};

const shifts = ref([]);
const isLoading = ref(false);
const transitionName = ref('fade');

// Computed Totals
const totalHours = computed(() => {
  if (shifts.value.length === 0) return '0:00';
  let totalMinutes = 0;
  shifts.value.forEach(s => {
    const [h, m] = s.hours.split(':').map(Number);
    totalMinutes += h * 60 + m;
  });
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
});

const totalSalary = computed(() => {
  if (shifts.value.length === 0) return '0.00';
  const total = shifts.value.reduce((sum, s) => sum + parseFloat(s.salary), 0);
  return total.toFixed(2);
});

// Fetch Data
const fetchShifts = (date) => {
  return new Promise((resolve) => {
      isLoading.value = true;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const key = `${year}-${month}`;

      // Simulate API delay
      setTimeout(() => {
        shifts.value = mockData[key] || [];
        isLoading.value = false;
        resolve();
      }, 500); // 500ms delay
  });
};

// Initial Fetch
fetchShifts(currentDate.value);

// Swipe Handlers
const touchStartX = ref(0);
const touchEndX = ref(0);

const onTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX;
};

const onTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX;
  handleSwipe();
};

const onMouseDown = (e) => {
  touchStartX.value = e.screenX;
};

const onMouseUp = (e) => {
  touchEndX.value = e.screenX;
  handleSwipe();
};

const handleSwipe = () => {
  const threshold = 50; 
  if (touchEndX.value < touchStartX.value - threshold) {
    nextMonth();
  }
  if (touchEndX.value > touchStartX.value + threshold) {
    prevMonth();
  }
};

const nextMonth = () => {
  transitionName.value = 'slide-next';
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() + 1);
  currentDate.value = d;
  activeShiftType.value = 'בוקר';
  fetchShifts(d);
};

const prevMonth = () => {
  transitionName.value = 'slide-prev';
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() - 1);
  currentDate.value = d;
  activeShiftType.value = 'בוקר';
  fetchShifts(d);
};

// Quick Shift Modal Logic
const isQuickShiftModalOpen = ref(false);
const quickShiftDate = ref(new Date());

const quickShiftMonthLabel = computed(() => {
    const d = quickShiftDate.value;
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const y = d.getFullYear();
    return `${m}/${y}`;
});

const prevQuickMonth = () => {
    const d = new Date(quickShiftDate.value);
    d.setMonth(d.getMonth() - 1);
    quickShiftDate.value = d;
};

const nextQuickMonth = () => {
    const d = new Date(quickShiftDate.value);
    d.setMonth(d.getMonth() + 1);
    quickShiftDate.value = d;
};

const quickShiftGrid = computed(() => {
    const y = quickShiftDate.value.getFullYear();
    const m = quickShiftDate.value.getMonth();
    const firstDay = new Date(y, m, 1).getDay(); // 0=Sunday
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    
    let days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
});

const handleQuickDayClick = (day) => {
    if (!day) return;
    
    // Create Quick Shift for this date
    const d = new Date(quickShiftDate.value);
    d.setDate(day);
    
    const h = "08"; // Default Start? Or current time? "Quick Shift" usually implies template.
    // Let's assume default 8 hours? Or just empty?
    // User wants "Quick Shift". Let's use the parameters from Image 2? 
    // Image 2 is just the modal. 
    // Let's create a basic shift entry.
    
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const y = d.getFullYear();
    const dayStr = day.toString();

    const dayName = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'][d.getDay()];
    
    const newShift = {
        dayNumber: dayStr,
        dayName: dayName,
        entry: '08:00', // Mock defaults
        exit: '16:00',
        hours: '8:00',
        salary: '0.00',
        type: activeShiftType.value, // "בוקר" from modal selector
        fullDate: `${day.toString().padStart(2,'0')}/${m}/${y}`,
        break: 0,
        extra: 0,
        deduction: 0
    };

    // Check Overlap
    const key = `${y}-${m}`;
    const targetList = mockData[key] || [];
    if (checkOverlap(newShift, -1, targetList, quickShiftDate.value)) {
         showToast('error', 'שגיאה: המשמרת חופפת למשמרת קיימת');
         return;
    }
    
    // Add to mockData if it's not the currently viewed list (shifts.value references mockData[viewed], so if we are viewing other month, we need to push to mockData directly)
    // Actually shifts.value IS mockData[currentKey]. 
    // If targetList is shifts.value (same month), we push to shifts.value (reactive).
    // If targetList is different, we push to it.
    
    if (targetList === shifts.value) {
        shifts.value.push(newShift);
    } else {
        targetList.push(newShift);
        // If target list didn't exist in mockData, we should set it but mockData is const reference to object.
        if (!mockData[key]) mockData[key] = targetList;
    }
    
    // Show Success Toast
    showToast('success', 'המשמרת נוספה בהצלחה!');
    
    // Close modal after short delay? user said "once done indicate date added". 
    // Maybe keep modal open? Or close? Let's close after confirmation.
    setTimeout(() => {
       isQuickShiftModalOpen.value = false;
    }, 1500);
};

// Long Press Logic
const pressingDay = ref(null);
let pressTimer = null;
const isLongPressHandled = ref(false);

const startPress = (day) => {
    if (!day) return;
    pressingDay.value = day;
    isLongPressHandled.value = false;
    
    pressTimer = setTimeout(() => {
        handleQuickDayClick(day);
        isLongPressHandled.value = true;
        pressingDay.value = null; // visual feedback end
    }, 1000); // 1 second
};

const endPress = (day) => {
    if (!day) return;
    if (pressTimer) clearTimeout(pressTimer);
    pressingDay.value = null;
    
    if (!isLongPressHandled.value) {
        // Short press detected -> Show Hint
        showToast('info', 'יש ללחוץ לפחות שניה אחת על יום רצוי כדי להוסיף משמרת מהירה');
    }
    isLongPressHandled.value = false;
};

const cancelPress = () => {
    if (pressTimer) clearTimeout(pressTimer);
    pressingDay.value = null;
    isLongPressHandled.value = false;
};

// Toast Logic
const toastVisible = ref(false);
const toastMessage = ref('');
const toastType = ref('info'); // info, success
let toastTimeout = null;

const showToast = (type, message) => {
    toastType.value = type;
    toastMessage.value = message;
    toastVisible.value = true;
    
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastVisible.value = false;
    }, 3000);
};

// FAB Logic


const handleFabItemClick = (item) => {
    if (item.id === 1) { // Quick Shift
        openQuickShiftModal(true);
    } else if (item.id === 2) { // New Shift
        // Create a new empty shift for Today
        const now = new Date();
        const d = now.getDate().toString().padStart(2, '0');
        const m = (now.getMonth() + 1).toString().padStart(2, '0');
        const y = now.getFullYear();
        const fullDate = `${d}/${m}/${y}`;
        
        const h = now.getHours().toString().padStart(2, '0');
        const min = now.getMinutes().toString().padStart(2, '0');
        
        editingShiftIndex.value = -1; // New Shift Flag
        
        // Populate editingShift
        editingShift.fullDate = fullDate;
        editingShift.type = 'בוקר';
        editingShift.entry = '--:--';
        editingShift.exit = '--:--';
        editingShift.break = 0;
        editingShift.extra = 0;
        editingShift.deduction = 0;
        editingShift.notes = '';
        
        isDetailModalOpen.value = true;
    } else if (item.id === 3) { // Fixed Payment
        isPaymentTypeModalOpen.value = true;
    }
    // Other items logic...
    isFabMenuOpen.value = false;
};

const openQuickShiftModal = () => {
    activeShiftType.value = 'בוקר'; // Reset
    quickShiftDate.value = new Date(); // Reset to today
    isQuickShiftModalOpen.value = true;
};

const closeQuickShiftModal = () => {
    isQuickShiftModalOpen.value = false;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

.shifts-page {
  font-family: 'Heebo', sans-serif;
  background-color: #f5f5f5;
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: #333;
  direction: rtl; /* Set default direction to RTL for Hebrew */
  overflow: hidden;
  position: relative;
  touch-action: pan-y;
  user-select: none;
}

/* Header */
.header {
  background-color: #0093AB; /* Teal color matching the image */
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: white;
  justify-content: space-between;
  flex-direction: row-reverse; /* Keep visual order matching image (Menu Left) */
}

.icon-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Header Title */
.header-title-area {
    font-size: 1.1rem;
    font-weight: 500;
    color: white;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
}

/* Month Selector */
.month-selector {
  background-color: #0093AB;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px 20px 16px;
  font-size: 0.9rem;
  overflow: hidden;
  flex-direction: row-reverse; /* Keep visual order matching image (Prev Left) */
  cursor: grab;
}

.month-selector:active {
  cursor: grabbing;
}

.current-month {
  font-weight: 700;
  font-size: 1.1rem;
}

.month-side {
  opacity: 0.5;
  white-space: nowrap;
}

/* Table Header */
.table-header {
  background-color: #00879D; /* Slightly darker teal */
  color: white;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  text-align: center;
  padding: 10px 0;
  font-size: 0.9rem;
}

/* Content Area */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto; /* Allow scrolling if list is long */
  background: white;
}

.shifts-list {
  width: 100%;
}

.shift-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  align-items: center;
  text-align: center;
  background: white;
}

.col-date {
  display: flex;
  justify-content: center;
}

.date-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #0093AB;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.1;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-circle.selected {
  background-color: #4DD0E1; /* Slightly lighter or different teal for selection state if desired, or keep same */
  transform: scale(1.05); /* Slight pop */
}

.date-circle.bg-sick {
    background-color: #D32F2F; /* Red */
}
.date-circle.bg-vacation {
    background-color: #388E3C; /* Green */
}
.date-circle.bg-holiday {
    background-color: #7B1FA2; /* Purple */
}
.date-circle.bg-monthly {
    background-color: #FBC02D; /* Gold */
}
.date-circle.bg-recuperation {
    background-color: #00ACC1; /* Cyan */
}
.date-circle.bg-reserves {
    background-color: #558B2F; /* Olive */
}

.row-selected {
  background-color: rgba(0, 147, 171, 0.05); /* Very light highlight for the row */
}

.day-name {
  font-size: 0.75rem;
  font-weight: 300;
}

.day-number {
  font-size: 1.1rem;
  font-weight: 700;
}

.col-entry, .col-exit, .col-hours, .col-salary {
  font-size: 0.95rem;
  color: #333;
}

.vacation-text {
  color: #888;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.loader {
    width: 48px;
    height: 48px;
    border: 5px solid #0093AB;
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
/* Faster Transitions for "diminuer le fade" */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.05s linear; /* Ultra fast */
}

.fade-fast-enter-active,
.fade-fast-leave-active {
   transition: opacity 0.05s linear; /* Ultra fast */
}

.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-next-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.empty-state {
  text-align: center;
  color: #757575;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.hand-icon-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.hand-icon {
  width: 100%;
  height: 100%;
}

.empty-text {
  margin: 0;
  line-height: 1.5;
}

.empty-text.title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #888;
}

.empty-text.subtitle {
  font-size: 1.1rem;
  font-weight: 400;
  color: #999;
}

/* FAB */
.fab {
  position: absolute;
  bottom: 140px; /* Above summary */
  left: 20px; /* RTL means left is start? No, left is physically left. Image shows FAB on Left. */
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba(233, 30, 99, 0.8); /* Semi-transparent Pink */
  backdrop-filter: blur(4px); /* Glass effect */
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1002; /* Higher than menu items if we want it on top, or lower... Image shows items above. */
  transition: all 0.3s ease;
}

.fab.delete-mode {
  background-color: #9E9E9E; /* Grey for delete */
  transform: rotate(0) !important; /* Ensure it doesn't rotate implies toggle */
}

.fab-rotate svg {
  transform: rotate(45deg);
  transition: transform 0.3s ease;
}

/* FAB Menu */
.fab-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.05); /* Almost transparent to keep data visible */
  z-index: 1000;
}

.fab-menu {
  position: absolute;
  bottom: 210px; /* fab bottom (140) + height (56) + spacing */
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1001;
  align-items: flex-start; /* items grow to right */
  pointer-events: none; /* Allow clicks through empty area */
}

.fab-menu-item {
  pointer-events: auto; /* Enable clicks on items */
  background: white;
  border-radius: 30px;
  padding: 6px 6px 6px 20px; /* Large padding left for text */
  display: flex;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  border: none;
  cursor: pointer;
  direction: rtl; /* Icons on Right in RTL usually, but image has Icon Left, Text Center. Let's force layout */
  flex-direction: row-reverse; /* Icon (Left in DOM) -> became Right in CSS row-reverse?? No. */
  /* Let's use strict flex order */
  flex-direction: row; 
  width: 240px;
  justify-content: flex-end;
  gap: 12px;
}

.menu-icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-icon-circle.red {
  background-color: #FF0000; /* Bright Red */
}

.menu-icon-circle.teal {
  background-color: #0093AB;
}

.menu-label {
  text-align: right; /* Hebrew text alignment */
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  padding: 0;
}

.menu-handle {
  color: #999;
  font-weight: 900;
  padding-left: 10px;
  font-size: 1.2rem;
  letter-spacing: -2px; /* make = look tighter */
}

.currency-symbol {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

/* Menu Transitions */
.fab-item-enter-active,
.fab-item-leave-active {
  transition-property: opacity, transform;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fab-item-enter-from,
.fab-item-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95); /* Subtler movement */
}

/* Footer Summary */
.footer-summary {
  background-color: #4DD0E1; /* Lighter teal for summary */
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  font-weight: 500;
}

.summary-item {
  display: flex;
  gap: 8px;
}

/* Bottom Nav */
.bottom-nav {
  background-color: #0093AB;
  display: flex;
  height: 60px;
}

.nav-item {
  flex: 1;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
}

.nav-item.active {
  color: white;
}



/* Sidebar Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0; /* Menu opens from Left */
  width: 80%; /* Takes up most of the screen width */
  max-width: 320px;
  height: 100%;
  background-color: #F5F5F5;
  z-index: 101;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
}

.sidebar.open {
  transform: translateX(0);
}

/* Sidebar Header */
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
    background: rgba(255, 235, 59, 0.2); /* Yellow tint */
    transform: rotate(45deg);
    z-index: 0;
}

.sidebar-top-row {
  display: flex;
  justify-content: flex-end; /* Account name Right aligned */
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

/* Menu Items */
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

.menu-item:hover {
    background-color: rgba(0,0,0,0.05);
}

.item-icon {
    margin-left: 16px; /* Icon on right, creates space between icon and text */
    color: #555;
    display: flex;
    align-items: center;
}

.spacer-small {
    height: 16px;
}

/* Sidebar Footer */
.sidebar-footer {
    padding: 16px;
    font-size: 0.8rem;
    color: #888;
    text-align: left; /* v2.6 usually ltr */
    direction: ltr; /* Force LTR for version number */
    margin-left: 20px;
}
/* Horizontal Slide Transition (Right to Left) */
.horizontal-slide-enter-active,
.horizontal-slide-leave-active {
  transition: transform 0.6s ease, opacity 0.6s ease; /* Slower */
}

.horizontal-slide-enter-from {
  transform: translateX(100%); /* Start from Right */
  opacity: 0;
}

.horizontal-slide-leave-to {
  transform: translateX(-100%); /* Move to Left */
  opacity: 0;
}

/* Tabs Container */
.tabs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.tab-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

/* Entry View Styles */
.entry-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 40px;
  background: white; /* Entry view has white background per image? or mostly white */
}

.clock-display {
  margin-bottom: 10px;
}

.clock-digits {
  font-size: 4rem;
  font-weight: 300;
  color: #0093AB;
  direction: ltr !important; 
  unicode-bidi: bidi-override;
}

.date-display {
  color: #0093AB;
  font-size: 1rem;
  margin-bottom: 40px;
}

.shift-card-container {
  width: 90%;
  max-width: 400px;
  margin-bottom: auto; /* push slider to bottom */
}

.shift-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  background: white;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  width: 100%;
}

.card-label {
  display: block;
  font-size: 0.9rem;
  color: #999;
  margin-bottom: 8px;
  text-align: right;
}


.shift-type-selector {
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 40px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.shift-type-selector:active {
    background-color: #f9f9f9;
}

.row-active-red {
    color: #FF0000 !important;
}

.row-active-red .col-entry,
.row-active-red .col-exit,
.row-active-red .col-hours,
.row-active-red .col-salary {
  color: #FF0000 !important;
}

/* Shift Type Modal Styles */
.shift-type-title {
  color: #2196F3 !important; /* Material Blue from image */
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
  padding-bottom: 10px;
}

/* Ensure shift type modal and its overlay are strictly on top */
.input-modal-overlay {
    z-index: 3000; 
}

/* Force Shift Selection to be higher than Quick Shift Modal */
.shift-selection-overlay {
    z-index: 4000 !important;
    background-color: rgba(0,0,0,0.5); /* Re-assert background */
    opacity: 1 !important; /* Ensure it is not transparent */
    display: flex; /* Ensure flex for centering */
    align-items: center;
    justify-content: center;
}

.shift-type-body {
    padding: 0 16px;
}

.shift-type-option {
  display: flex;
  justify-content: flex-end; /* Text on Right */
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  direction: ltr; /* Force LTR container so we can place input Left and Text Right manually */
  gap: 15px;
  border-bottom: 1px solid #eee;
}

.shift-type-option:last-child {
  border-bottom: none;
}

.option-label {
  font-size: 1.2rem; /* Larger font */
  color: #000;
  flex: 1;
  text-align: right;
  font-weight: 400;
}

.option-radio {
  width: 24px;
  height: 24px;
  margin: 0;
  accent-color: #555; /* Default browser radio style is blue usually, user image shows black stroke circle. We can just use standard for now or custom css if needed. Standard large is fine. */
  cursor: pointer;
}

.shift-times-row {
  display: flex;
  justify-content: center; /* Center them but with gap */
  gap: 60px; /* Space them out significantly */
  text-align: center;
  margin-top: 10px;
}

.time-col {
  display: flex;
  flex-direction: column;
}

.time-label {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 4px;
}

.time-value {
  font-size: 1.5rem;
  color: #555;
  font-weight: 300;
}

/* Slider */
.slider-container {
  width: 90%;
  max-width: 400px;
  margin-bottom: 40px;
}

.slider-track {
  width: 100%;
  height: 42px; /* Reduced height from 56 */
  border-radius: 21px; /* Half of height */
  border: 1px solid #0093AB;
  background: white;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-text {
  color: #0093AB;
  font-size: 1rem; /* Slightly smaller text */
  font-weight: 500;
  pointer-events: none;
  z-index: 10;
}

/* Calendar Day Pressing State */
.calendar-day.pressing {
    background-color: rgba(0, 147, 171, 0.2);
    transform: scale(0.95);
    transition: all 0.2s ease;
}

/* Toast Notification */
.toast-notification {
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: fit-content;
    background: white;
    padding: 12px 20px;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 5000; /* Ensure on top of everything, including modal overlays */
    max-width: 90%;
    
    direction: rtl;
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.toast-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.toast-text {
    color: #333;
    font-size: 0.95rem;
    font-weight: 500;
    text-align: center;
    line-height: 1.4;
}

.slider-thumb {
  width: 34px; /* Reduced size */
  height: 34px;
  background: #0093AB; 
  border-radius: 50%;
  position: absolute;
  left: 4px;
  top: 3px; /* vertically centered: (42-34)/2 = 4 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 20;
}


.slider-thumb svg {
    stroke: white; /* White arrow */
}

/* Override previous button styles if necessary */
.slider-btn { display: none; }


/* Detail Modal */
.detail-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  /* backdrop-filter: blur(2px); REMOVED per user request 'on voit trouble' */
}

.detail-modal {
  background: white;
  width: 90%;
  max-width: 400px;
  border-radius: 4px; /* somewhat clearer corners per image */
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

.detail-header {
  background-color: #4DD0E1; /* Teal header */
  color: white;
  padding: 16px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
}

.detail-body {
  padding: 24px;
  background: white;
}

.detail-form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.detail-form-row label {
  font-size: 1rem;
  color: #333;
  width: 30%; /* label width */
  text-align: right;
  display: flex;
  align-items: center;
  gap: 8px; /* for checkbox */
}

.input-box {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  width: 120px; /* fixed width mostly */
  text-align: center;
  font-size: 1rem;
  color: #333;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.icon-cancel-red {
  position: absolute;
  left: -24px;
  cursor: pointer;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unit-text {
  font-size: 0.9rem;
  color: #666;
  width: 30px;
  text-align: left;
}

.notes-row {
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
}

.notes-label {
  color: #E91E63; /* Pinkish red per image */
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.notes-area {
  width: 100%;
  height: 60px;
  background-color: #F9F9F9;
  border: none;
  resize: none;
}

.detail-footer {
  display: flex;
  background-color: #0093AB;
  height: 50px;
}

.footer-btn {
  flex: 1;
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.footer-btn:active {
  background-color: rgba(255,255,255,0.1);
}

.footer-divider {
  width: 1px;
  background-color: rgba(255,255,255,0.3);
  height: 100%;
}

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

/* Time Modal Specifics */
.time-modal-body {
    padding: 30px 20px;
    position: relative;
    display: flex;
    justify-content: center;
    direction: ltr; /* Ensure HH:MM order */
}

.time-picker-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    z-index: 2; /* Above lines */
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

/* Firefox */
.time-input {
  -moz-appearance: textfield;
}

.time-colon {
    font-size: 2rem;
    font-weight: 500;
    color: #333;
    margin-top: -8px; /* Alignment adjustment */
}

.time-selection-lines {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 60px; /* Approximate height of current row */
    pointer-events: none;
    z-index: 1;
}

.time-selection-lines .line {
    width: 100%;
    height: 2px;
    background-color: #4DD0E1; /* Cyan/Teal line */
}

.time-selection-lines .line.top {
    margin-top: 0;
}

.time-selection-lines .line.bottom {
    margin-top: 56px; /* spacing */
}

/* Shift Type Modal Specifics */
.shift-type-title {
    font-size: 1.3rem; /* Slightly smaller to fit "Please select..." */
    text-align: center; /* Image shows centered title */
    padding: 20px;
}

.shift-type-body {
    padding: 0; /* Full width items */
    display: flex;
    flex-direction: column;
}

.shift-type-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    cursor: pointer;
    transition: background 0.1s;
    user-select: none;
}

.shift-type-option:active {
    background-color: #f5f5f5;
}

.option-label {
    font-size: 1.1rem;
    color: #333;
}

.option-radio {
    width: 20px;
    height: 20px;
    accent-color: #0093AB; /* Match theme */
    cursor: pointer;
}

.option-divider {
    height: 1px;
    background-color: #eee;
    width: 100%;
}

.input-with-underscore {
    border-bottom: 2px solid #4facfe;
    padding: 4px 0;
    width: 100%;
}
.transparent-input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 1.2rem;
    text-align: right;
    color: #333;
    background: transparent;
}
.transparent-input::placeholder {
    color: #ccc;
}
</style>
