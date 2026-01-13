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

      <div class="header-date-nav">
          <button class="nav-arrow" @click="prevMonth">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span class="header-date-text">{{ currentMonthLabel }}</span>
          <button class="nav-arrow" @click="nextMonth">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
      </div>
      
      <!-- Placeholder/Timer - if Timer is active, maybe show it small or hide. 
           User wants "Like Image" which implies Title Bar. 
           Let's hide Timer from main header to keep design clean, or move it to sub-header? 
           Original code had activeShiftTimer centered. 
           I'll keep a small indicator or just spacer if not active.
      -->
      <div class="header-right-spacer">
          <span v-if="activeShift && (isViewingActiveShiftMonth || currentTab === 'entry')" class="mini-timer">{{ activeShiftTimer }}</span>
      </div>
    </header>

    <!-- Page Title Bar -->
    <div class="page-title-bar">
        <span>משמרות</span>
        <div class="title-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
    </div>



    <!-- Content Transition Wrapper -->
    <div class="tabs-container">
      <transition name="horizontal-slide" mode="out-in">
        
        <!-- =======================
             SHIFTS VIEW
             ======================= -->
        <div v-if="currentTab === 'shifts'" class="tab-view shifts-view" key="shifts">
          <!-- Month Selector -->
          <!-- Month Selector REMOVED -->

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
          <div v-for="(shift, index) in shifts" :key="shift.id || index" class="shift-row" :class="{ 'row-selected': selectedIds.has(shift.id), 'row-active-red': shift.exit === '--:--' }" @click="handleRowClick(shift, index)">
            <div class="col-date">
              <div class="date-circle" :class="[getShiftTypeClass(shift.type), { selected: selectedIds.has(shift.id) }]" @click.stop="toggleSelection(shift.id)">
                <template v-if="selectedIds.has(shift.id)">
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
               <input type="text" :value="editingShift.type || 'בחר סוג משמרת'" readonly class="input-box" @click="openShiftTypeModal(false)" />
            </div>

            <div class="detail-form-row">
               <label>כניסה:</label>
               <input type="text" :value="editingShift.entry" readonly class="input-box" @click="openTimeModal('entry')" />
            </div>

            <div class="detail-form-row">
               <label>יציאה:</label>
               <input type="text" :value="editingShift.exit" readonly class="input-box" @click="openTimeModal('exit')" />
            </div>

            <!-- Break Input (Trigger Modal) -->
            <div class="detail-form-row">
               <label :style="{ color: calculatedRulesBreak > 0 ? '#ff5252' : '' }">הפסקה:</label>
               <div class="input-with-unit" @click="openBreakModal">
                 <span class="unit-text">דק'</span>
                 <input 
                    type="number" 
                    :value="editingShift.break" 
                    readonly 
                    class="input-box clickable" 
                    :class="{ 'read-only-field': calculatedRulesBreak > 0 }" 
                 />
               </div>
            </div>

            <!-- Extra Input (Trigger Modal) -->
            <div class="detail-form-row">
               <label>תוספת יומית:</label>
               <div class="input-with-unit" @click="openExtraModal">
                 <span class="unit-text">ש"ח</span>
                 <input 
                    type="number" 
                    :value="editingShift.extra" 
                    readonly 
                    class="input-box clickable"
                 />
               </div>
            </div>

            <!-- Deduction Input (Trigger Modal) -->
            <div class="detail-form-row">
               <label>הורדה יומית:</label>
               <div class="input-with-unit" @click="openDeductionModal">
                 <span class="unit-text">ש"ח</span>
                 <input 
                    type="number" 
                    :value="editingShift.deduction" 
                    readonly 
                    class="input-box clickable"
                 />
               </div>
            </div>

             <div class="detail-form-row notes-row">
                <label class="notes-label">הערות:</label>
                 <textarea class="notes-area"></textarea>
             </div>
            
            <!-- DEBUG DATA DUMP -->


          </div>

          <div class="detail-footer">
            <button class="footer-btn btn-update" @click="updateShift">
               <span>{{ editingShiftIndex === -1 ? 'שמור' : 'עדכן' }}</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
            <div class="footer-divider"></div>
            <button class="footer-btn btn-cancel" @click="closeDetailModal">
               <span>ביטול</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div class="footer-divider" v-if="editingShiftIndex !== -1"></div>
            <button class="footer-btn btn-delete" @click="deleteShift" v-if="editingShiftIndex !== -1">
               <span>מחיקה</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
             <label v-for="type in shiftTypes" :key="type.id" class="shift-type-option" @click="selectShiftType(type.name)">
               <span class="option-label">{{ type.name }}</span>
               <input type="radio" :checked="tempShiftType === type.name" class="option-radio" readonly>
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
            <button class="modal-btn confirm" @click="confirmShiftTypeModal">אישור</button>
            <button class="modal-btn cancel" @click="cancelShiftTypeModal">ביטול</button>
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
             <label v-for="type in paymentTypes" :key="type.id" class="shift-type-option" @click.prevent="selectPaymentType(type.name)">
               <span class="option-label">{{ type.name }}</span>
               <input type="radio" :checked="tempPaymentType === type.name" class="option-radio" readonly>
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
             <label v-for="type in sickTypes" :key="type.id" class="shift-type-option" @click.prevent="selectSickDay(type.name)">
               <span class="option-label">{{ type.name }}</span>
               <input type="radio" :checked="tempSickDayType === type.name" class="option-radio" readonly>
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
               <button class="footer-btn" @click="confirmMonthlyPayment">אישור</button>
               <div class="footer-divider"></div>
               <button class="footer-btn" @click="isMonthlyPaymentModalOpen = false">ביטול</button>
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
               <button class="footer-btn" @click="confirmRecuperation">אישור</button>
               <div class="footer-divider"></div>
               <button class="footer-btn" @click="isRecuperationModalOpen = false">ביטול</button>
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

    <!-- Weekly Plan Selector Modal Removed (Integrated into Quick Shift Modal as dropdown) -->

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
    <!-- FAB Wrapper with Label -->
    <div class="fab-wrapper" v-if="currentTab === 'shifts'" @click.stop="handleFabClick">
      <button class="fab" @click.stop="handleFabClick" :class="{ 'delete-mode': isSelectionMode, 'fab-rotate': isFabMenuOpen }">
         <svg v-if="isSelectionMode" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
         <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
      <span class="fab-label" v-if="!isSelectionMode" :class="{ 'fade-out-label': isFabMenuOpen }">משמרת</span>
    </div>
    
    <!-- Weekly Plan Shift Modal (formerly Quick Shift) -->
    <transition name="fade">
      <div v-if="isQuickShiftModalOpen" class="input-modal-overlay" @click.self="closeQuickShiftModal">
        <div class="input-modal quick-shift-modal" style="padding: 0; overflow: visible;">
          <div class="input-modal-header" style="background-color: #4DD0E1; color: white; padding: 15px; text-align: center;">
             <span style="font-size: 1.1rem; font-weight: 500;">משמרת סידור עבודה</span>
          </div>
          <div class="input-modal-body" style="padding: 20px;">
             <div style="text-align: center; color: #777; margin-bottom: 10px;">נא לבחור סידור עבודה:</div>
             
             <!-- Weekly Plan Selector Dropdown Trigger -->
             <div class="dropdown-wrapper" style="position: relative; margin-bottom: 20px;">
                 <button class="shift-type-selector-quick" @click.stop="togglePlanDropdown" style="width: 100%; background-color: #0093AB; color: white; padding: 12px; border: none; border-radius: 4px; font-size: 1.1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                    <span style="flex-grow: 1; text-align: center;">{{ selectedPlanLabel || 'נא לבחור סידור עבודה' }}</span>
                    <svg :style="{ transform: isPlanDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                 </button>

                 <!-- Inline Dropdown Content -->
                 <transition name="fade">
                    <div v-if="isPlanDropdownOpen" class="dropdown-content" style="background: white; border: 1px solid #ddd; border-top: none; border-radius: 0 0 4px 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 10px; position: absolute; top: 100%; left: 0; right: 0; z-index: 1005;">
                        
                        <!-- Month Navigator -->
                        <div class="calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 5px; direction: ltr; background-color: #f9f9f9; border-radius: 4px;">
                            <button @click.stop="prevPlanSelectorMonth" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color:#333; padding: 0 10px;">&lt;</button>
                            <span style="font-weight: bold; font-size: 1rem; color: #555;">{{ planSelectorMonthLabel }}</span>
                            <button @click.stop="nextPlanSelectorMonth" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color:#333; padding: 0 10px;">&gt;</button>
                        </div>
                        
                        <div class="plans-list" style="max-height: 200px; overflow-y: auto;">
                            <div v-if="availableWeeklyPlans.length === 0" style="text-align:center; color:#999; padding: 15px;">
                                אין סידורי עבודה לחודש זה
                            </div>

                            <div v-for="plan in availableWeeklyPlans" :key="plan.id" class="dropdown-item" @click.stop="selectWeeklyPlan(plan.id)" style="padding: 10px; border-bottom: 1px solid #eee; cursor: pointer; display: flex; align-items: center;">
                                <div class="radio-circle" :class="{ selected: activeWeeklyPlanId === plan.id }" style="margin-left: 10px;"> <!-- Margin left for RTL -->
                                    <div v-if="activeWeeklyPlanId === plan.id" class="radio-inner"></div>
                                </div>
                                <span class="radio-label" style="font-size: 0.95rem;">{{ plan.label }}</span>
                            </div>
                        </div>
                    </div>
                 </transition>
             </div>
             
             <!-- Calendar -->
             <div class="calendar-container" style="border: 1px solid #eee; border-radius: 8px; padding: 10px;">
                     <span style="font-weight: bold; font-size: 1.1rem; color: #555; width: 100%; text-align: right; display:block;">{{ quickShiftMonthLabel }}</span>
                 
                 <!-- Days Header -->
                 <div class="calendar-grid-header" style="display: grid; grid-template-columns: repeat(6, 1fr); text-align: center; margin-bottom: 10px; font-weight: bold; color: white; background-color: #0093AB; padding: 8px 0; direction: rtl;">
                    <div>א</div><div>ב</div><div>ג</div><div>ד</div><div>ה</div><div>ו</div>
                 </div>
                 
                 <!-- Days Grid -->
                 <div class="calendar-grid" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 5px; direction: rtl;">
                     <div v-for="(day, idx) in quickShiftGrid" :key="idx" 
                          class="calendar-day" 
                          :class="{ 'empty': !day, 'pressing': pressingDay === day, 'disabled': day && !isDaySelectable(day), 'in-plan-range': day && day.inPlan }"
                          @mousedown="day && isDaySelectable(day) ? startPress(day) : null"
                          @touchstart="day && isDaySelectable(day) ? startPress(day) : null"
                          @mouseup="day && isDaySelectable(day) ? endPress(day) : null"
                          @touchend="day && isDaySelectable(day) ? endPress(day) : null"
                          @mouseleave="cancelPress"
                          @touchcancel="cancelPress"
                          :style="{ 
                              height: '40px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              cursor: (day && isDaySelectable(day)) ? 'pointer' : 'not-allowed', 
                              borderRadius: '4px', 
                              fontWeight: '500', 
                              userSelect: 'none', 
                              opacity: (day && !isDaySelectable(day)) ? '0.3' : '1',
                              backgroundColor: (day && day.inPlan) ? 'rgba(0, 147, 171, 0.2)' : (pressingDay === day ? '#B2DFDB' : 'transparent'),
                              border: (day && day.inPlan) ? '1px solid #0093AB' : 'none',
                              color: (day && day.inPlan) ? '#0093AB' : 'inherit'
                          }"
                     >
                        {{ day ? day.label : '' }}
                     </div>
                 </div>
             </div>
             
          </div>
        </div>
      </div>
    </transition>

    <!-- Excel Report Modal -->
    <transition name="fade">
      <div v-if="isExcelModalOpen" class="input-modal-overlay" @click.self="isExcelModalOpen = false">
        <div class="input-modal">
          <div class="input-modal-title" style="color: #4facfe;">
             קובץ אקסל
          </div>
          <div class="input-title-divider" style="background-color: #4facfe;"></div>
          
          <div class="input-modal-body" style="padding: 20px; text-align: center;">
             <p style="margin-bottom: 20px; font-size: 1.1rem; color: #555;">האם לשלוח קובץ אקסל למייל או לצפות בו עכשיו?</p>
          </div>

          <div class="input-modal-footer">
               <button class="modal-btn" style="color: #2196F3;" @click="handleExcelAction('email')">שלח למייל</button>
               <button class="modal-btn" style="color: grey;" @click="isExcelModalOpen = false">ביטול</button>
               <button class="modal-btn" style="color: #2196F3;" @click="handleExcelAction('view')">צפה בקובץ</button>
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
        <a href="#" class="menu-item" @click.prevent="goToSummary">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </span>
          <span>פירוט שכר</span>
        </a>
        <a href="#" class="menu-item" @click.prevent="goToWeeklyPlan">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          </span>
          <span>סידור עבודה</span>
        </a>
        <router-link to="/shift-types" class="menu-item" @click="isMenuOpen = false">
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
        <a href="#" class="menu-item" @click.prevent="openExcelModal">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </span>
          <span>דוח אקסל</span>
        </a>
        <a href="#" class="menu-item" @click.prevent="recalculateAllShifts">
          <span class="item-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          </span>
          <span>חישוב מחדש</span>
        </a>
        <div class="spacer-small"></div>
        
        <a href="#" class="menu-item" @click.prevent="logout">
           <span class="item-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
           </span>
           <span>יציאה</span>
        </a>
      </div>

      <div class="sidebar-footer">
        <!-- Version Removed -->
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import api from '../services/api'; 
// Wait, this project uses options store in src/store/index.js.
// Best way in setup script is:
import store from '../store'; 

const router = useRouter();

const isMenuOpen = ref(false);
const isFabMenuOpen = ref(false);

const logout = () => {
    store.dispatch('saveToken', null); // Clear token
    store.commit('SET_USER', null); // Clear user
    router.push({ name: 'login' });
};

const goToSummary = () => {
    isMenuOpen.value = false;
    // Pass current date viewer to summary
    // currentDate is a Date object. Convert to YYYY-MM-DD or just pass it as string.
    // We want the summary to know which month we are looking at.
    const y = currentDate.value.getFullYear();
    const m = (currentDate.value.getMonth() + 1).toString().padStart(2, '0');
    const d = currentDate.value.getDate().toString().padStart(2, '0');
    
    // We can pass ISO string date=2026-01-03
    const dateParam = `${y}-${m}-${d}`;
    router.push({ name: 'summary', query: { date: dateParam }}); // Use name 'summary' defined in router
};

const goToWeeklyPlan = () => {
    isMenuOpen.value = false;
    router.push({ name: 'weekly-schedules' });
};

const currentTab = ref('shifts'); // 'shifts' or 'entry'

// Selection Logic
const selectedIds = ref(new Set());
const isSelectionMode = computed(() => selectedIds.value.size > 0);

const toggleSelection = (id) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
  selectedIds.value = new Set(selectedIds.value);
};

const handleFabClick = async () => {
  if (isSelectionMode.value) {
    if (confirm(`למחוק ${selectedIds.value.size} משמרות?`)) {
       const idsToDelete = Array.from(selectedIds.value);
       
       for (const id of idsToDelete) {
           await store.dispatch('deleteShift', id);
       }

       selectedIds.value = new Set();
       // Exit selection mode handled by computed
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
const editingShiftId = ref(null);

const handleRowClick = (shift, index) => {
  // DEBUG: Check what we are clicking
  const type = shift.type || '';
  console.log('Clicked Row:', index, 'Type:', type);

  const nonEditableKeywords = ['חג', 'חופש', 'מילואים', 'מחלה', 'תשלום חודשי', 'הבראה'];
  
  const isNonEditable = nonEditableKeywords.some(keyword => type.includes(keyword));
  console.log('Is Non Editable?', isNonEditable);

  if (isSelectionMode.value) {
      toggleSelection(shift.id);
      return;
  }

  if (isNonEditable) {
      // Show info/toast instead of opening edit modal
      showToast('info', `מדובר ב${type}`);
      return;
  }

  // Check if Active Shift (Entry but no Exit)
  if (shift.entry && shift.entry !== '--:--' && (!shift.exit || shift.exit === '--:--')) {
      showToast('info', 'משמרת פעילה - לא ניתן לערוך');
      return;
  }

  editingShiftIndex.value = index;
  editingShiftId.value = shift.id;
  // console.log("DEBUG: RowClick ID:", shift.id); // Logs removed
  
  // Populate
  const m = (currentDate.value.getMonth() + 1).toString().padStart(2, '0');
  const y = currentDate.value.getFullYear();
  editingShift.fullDate = shift.fullDate || `${shift.dayNumber}/${m}/${y}`;
  editingShift.type = shift.type || 'בוקר'; 
  editingShift.entry = shift.entry;
  editingShift.exit = shift.exit;
  
  // Apply defaults if values are missing, based on the shift type
  const defaults = getShiftDefaults(editingShift.type);

  // Defensive: Unwrap & Fallback Logic
  const unwrap = (val, def) => {
      let v = val;
      if (v && typeof v === 'object' && 'value' in v) v = v.value;
      // If valid number (including 0 if explicitly set? Hard to distinguish 0 from missing if default is 0. 
      // Assumption: 0 implies "No Break", but if "Rules" say 40, user usually wants 40.
      // We'll prioritize: Explicit Value > Default > Rules > 0.
      if (v !== undefined && v !== null && v !== '') return Number(v);
      return Number(def) || 0;
  };

  let bVal = unwrap(shift.break, defaults.break);

  // FIX: Force override "40" (Legacy Default) with current Rule (e.g. 20 or 45) check.
  if ((bVal === 0 || bVal === 40) && calculatedRulesBreak.value > 0) {
      console.log("Auto-correcting break from", bVal, "to rule value:", calculatedRulesBreak.value);
      bVal = calculatedRulesBreak.value;
  }

  editingShift.break = bVal;
  editingShift.extra = unwrap(shift.extra, defaults.extra);
  editingShift.deduction = unwrap(shift.deduction, defaults.deduction);
  
  editingShift.notes = shift.notes || ''; 
  
  isDetailModalOpen.value = true;
};

const calculateShiftData = (shiftData) => {
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
        
        // Strict Break Deduction: (Exit - Entry) - ShiftBreak
        // The shiftData.break comes from defaults (Shift Type) or user edit.
        const breakDurationMs = (shiftData.break || 0) * 60 * 1000;
        diffMs -= breakDurationMs;
        
        if (diffMs < 0) diffMs = 0;
        
        const h = Math.floor(diffMs / 3600000);
        const m = Math.floor((diffMs % 3600000) / 60000);
        
        hoursStr = `${h}:${m.toString().padStart(2,'0')}`;
        
        // --- Dynamic Salary Calculation (Tiered Overtime) ---
        
        const hourlyWage = store.getters.hourlyWage || 0;
        const shiftType = store.getters.allShiftTypes.find(t => t.name === shiftData.type);
        const rules = shiftType ? shiftType.rates : [];
        
        let calculatedSalary = 0;
        let totalMinutesWorked = diffMs / 60000;
        
        if (!rules || rules.length === 0) {
            // Fallback: Flat 100%
            calculatedSalary = (totalMinutesWorked / 60) * hourlyWage;
        } else {
            let remainingMinutes = totalMinutesWorked;
            
            for (const rule of rules) {
                if (remainingMinutes <= 0) break;
                
                // Parse rule limit (HH:MM) to minutes
                const [rH, rM] = rule.limit ? rule.limit.split(':').map(Number) : [0,0];
                const ruleLimitMins = (rH * 60) + rM;
                
                // If limit is 0 (unlimited?) or just very high, usually user puts real limit.
                // If user puts 00:00, ignore or treat as 0 duration? Treat as 0 to be safe.
                if (ruleLimitMins <= 0) continue; 
                
                const minutesInTier = Math.min(remainingMinutes, ruleLimitMins);
                const tierWage = hourlyWage * (rule.value / 100);
                
                calculatedSalary += (minutesInTier / 60) * tierWage;
                remainingMinutes -= minutesInTier;
            }
            
            // Handle leftovers if shift exceeds all defined tiers (Open-ended overtime)
            if (remainingMinutes > 0) {
                // Use the last tier's rate? Or a default high rate?
                // Logic: "Everything else". If user defined 8h @ 100, 2h @ 125, and worked 12h...
                // The last 2h are undefined. 
                // Best practice: Continue with the LAST defined rate.
                const lastRule = rules[rules.length - 1];
                const lastRateVal = lastRule ? lastRule.value : 100;
                const finalWage = hourlyWage * (lastRateVal / 100);
                
                calculatedSalary += (remainingMinutes / 60) * finalWage;
            }
        }

        // Add Extras / Deduct reductions
        calculatedSalary += parseFloat(shiftData.extra || 0);
        calculatedSalary -= parseFloat(shiftData.deduction || 0);
        
        if (calculatedSalary < 0) calculatedSalary = 0;
        salaryStr = calculatedSalary.toFixed(2);
    }
    
    return { hoursStr, salaryStr };
};

const checkOverlap = (candidate, ignoreId = null, shiftsList = shifts.value, referenceDate = currentDate.value) => {
    console.log("DEBUG: Checking Overlap for", candidate.fullDate, candidate.entry, candidate.exit, "Ignore:", ignoreId);
    const getShiftTimes = (s) => {
        // CORRECTION CRITIQUE: Utiliser la date absolue (ISO) si disponible pour éviter les confusions de mois
        let day, mon, yr;
        
        if (s.date) {
            const dateObj = new Date(s.date);
            day = dateObj.getDate();
            mon = dateObj.getMonth() + 1;
            yr = dateObj.getFullYear();
        } else if (s.fullDate) {
             [day, mon, yr] = s.fullDate.split('/').map(Number);
        } else {
             // Fallback (uniquement si aucune date précise n'existe)
             day = Number(s.dayNumber);
             mon = referenceDate.getMonth() + 1;
             yr = referenceDate.getFullYear();
        }
        
        const dStr = `${day.toString().padStart(2, '0')}/${mon.toString().padStart(2, '0')}/${yr}`;

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
    const conflict = shiftsList.find((s) => {
        if (ignoreId && s.id === ignoreId) return false;
        
        const sTimes = getShiftTimes(s);
        console.log("DEBUG: Comparing against", sTimes.fullDate, "Start:", sTimes.start, "End:", sTimes.end);
        
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

const updateShift = async () => {
    // Check overlap against ALL shifts (not just current view) to prevent cross-month conflicts
    if (checkOverlap(editingShift, editingShiftId.value, store.getters.allShifts)) {
        alert('שגיאה: חפיפה בשעות המשמרת עם משמרת קיימת');
        return;
    }

    // Call API logic via Store
    const { hoursStr, salaryStr } = calculateShiftData(editingShift);
    
    // Parse Date
    const [dStr, mStr, yStr] = editingShift.fullDate.split('/');
    // Use noon to avoid timezone rolling date backward
    const dateObj = new Date(parseInt(yStr), parseInt(mStr) - 1, parseInt(dStr), 12, 0, 0);
    const dayName = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'][dateObj.getDay()];

    // Construct payload
    const shiftPayload = {
        type: editingShift.type,
        entry: editingShift.entry,
        exit: editingShift.exit,
        break: Number(editingShift.break) || 0,
        extra: Number(editingShift.extra) || 0,
        deduction: Number(editingShift.deduction) || 0,
        fullDate: editingShift.fullDate,
        dayNumber: dStr,
        dayName: dayName,
        hours: hoursStr,
        salary: salaryStr,
        notes: editingShift.notes,
        date: dateObj.toISOString()
    };

    try {
        if (editingShiftIndex.value === -1) {
            // New Shift
            await store.dispatch('addShift', { ...shiftPayload, isVacation: false });
            store.dispatch('showToast', { message: 'משמרת נוספה בהצלחה', type: 'success' });
        } else {
            // Update Existing
            const originalShift = store.getters.allShifts.find(s => s.id === editingShiftId.value);
            if (!originalShift.id) {
                 console.error("Cannot update shift without ID");
                 return;
            }
            // Merge with original to keep IDs and unedited fields
            const completeShift = {
                ...originalShift,
                ...shiftPayload
            };
            
            await store.dispatch('updateShift', {
                id: originalShift.id,
                shift: completeShift
            });
            store.dispatch('showToast', { message: 'משמרת עודכנה בהצלחה', type: 'success' });
        }
        closeDetailModal();
    } catch (err) {
        console.error("Failed to save shift:", err);
        store.dispatch('showToast', { message: 'שגיאה בשמירת המשמרת', type: 'error' });
    }
};

const deleteShift = async () => {
    if (!editingShiftId.value && editingShiftIndex.value === -1) return;
    
    if (confirm("להסיר משמרת זו?")) {
        const shiftToDelete = store.getters.allShifts.find(s => s.id === editingShiftId.value);
        if (shiftToDelete && shiftToDelete.id) {
            try {
                await store.dispatch('deleteShift', shiftToDelete.id);
                closeDetailModal();
            } catch (err) {
                console.error("Failed to delete shift:", err);
            }
        }
    }
};

const closeDetailModal = () => {
    isDetailModalOpen.value = false;
};

// Break Modal Logic
const isBreakModalOpen = ref(false);
const breakModalValue = ref('');
const breakInputRef = ref(null);



// Utility to calculate break minutes from global/specific rules
// Utility to calculate break minutes - SIMPLE VERSION (Priority: Settings -> Rules)
const calculateBreakMinutes = (shiftTypeId) => {
    // 1. Priority: General Settings (Simple)
    const settings = store.getters.generalSettings || {};
    if (settings.fixedBreak === true) {
         // Respect setting value, default to 0 if missing (User requirement: no 40 default)
         return Number(settings.fixedBreakDuration || settings.fixedBreakMinutes || 0);
    }
    
    // 2. Secondary: Check Rules List (Additions/Deductions)
    const rules = store.state.additionsDeductions || [];
    const breakRule = rules.find(r => 
        (r.mode === 'time' && r.minutes > 0) || 
        r.description?.includes('הפסקה') || 
        r.name?.includes('הפסקה')
    );

    if (breakRule) {
         return Number(breakRule.minutes || breakRule.amount || 0);
    }

    return 0;
};

const calculatedRulesBreak = computed(() => {
    if (!editingShift.type) return 0;
    const typeObj = store.getters.allShiftTypes.find(t => t.name === editingShift.type);
    const typeId = typeObj ? typeObj.id : null;
    return calculateBreakMinutes(typeId);
});

// Sync Shift Break with Rules
watch(calculatedRulesBreak, (newVal) => {
    if (newVal > 0) {
        editingShift.break = newVal;
    }
}, { immediate: true });

const calculatedShiftAddition = computed(() => {
    if (!editingShift.type) return 0;
    const typeObj = store.getters.allShiftTypes.find(t => t.name === editingShift.type);
    const typeId = typeObj ? typeObj.id : null;
    
    const rules = store.state.additionsDeductions || [];
    const applicable = rules.filter(r => {
        const isAddition = r.type === 'addition' && r.mode === 'amount' && r.period === 'daily';
        if (!isAddition) return false;

        const ruleShiftIds = r.shiftIds || [];
        if (ruleShiftIds.length === 0) return true;
        if (typeId) {
             return ruleShiftIds.some(id => String(id) === String(typeId));
        }
        return false;
    });

    return applicable.reduce((sum, r) => {
        const val = Number(r.amount || 0);
        return sum + (isNaN(val) ? 0 : val);
    }, 0);
});

const calculatedShiftDeduction = computed(() => {
    if (!editingShift.type) return 0;
    const typeObj = store.getters.allShiftTypes.find(t => t.name === editingShift.type);
    const typeId = typeObj ? typeObj.id : null;
    
    const rules = store.state.additionsDeductions || [];
    
    // Filter rules that are monetary daily deductions and are NOT break-related
    const applicable = rules.filter(r => {
        const isMonetaryDailyDeduction = r.type === 'deduction' && r.mode === 'amount' && r.period === 'daily';
        if (!isMonetaryDailyDeduction) return false;

        // Prevent Double Counting:
        // Exclude rules that are already handled by calculateBreakMinutes (time-based breaks)
        // or are explicitly named "הפסקה" (Break)
        const isBreakRule = r.isFixedBreakAuto || r.type === 'break' || (r.type === 'deduction' && (r.mode === 'time' || Number(r.minutes) > 0));
        const name = r.name || r.description || '';
        if (isBreakRule || name.includes('הפסקה')) return false;

        // Check for specific shift type applicability or global applicability
        const ruleShiftIds = r.shiftIds || [];
        if (ruleShiftIds.length === 0) return true; // This is the broad fallback for global rules
        if (typeId) {
             return ruleShiftIds.some(id => String(id) === String(typeId)); // Specific rule for this shift type
        }
        return false;
    });

    return applicable.reduce((sum, r) => {
        const val = Number(r.amount || 0);
        return sum + (isNaN(val) ? 0 : val);
    }, 0);
});

const openBreakModal = () => {
    breakModalValue.value = editingShift.break;
    isBreakModalOpen.value = true;
    nextTick(() => breakInputRef.value?.focus());
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

// Weekly Plan for Quick-Add
// const isPlanSelectorModalOpen = ref(false); // Removed
const isPlanDropdownOpen = ref(false); 
const weeklyPlansRef = computed(() => store.getters.allWeeklyPlans); // Expose to template
const activeWeeklyPlanId = ref(''); // Start with no selection
const selectedPlanLabel = ref(''); // Track selected plan label
const planSelectorDate = ref(new Date()); // State for the month selector

const planSelectorMonthLabel = computed(() => {
    const d = planSelectorDate.value;
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const y = d.getFullYear();
    return `${m}/${y}`;
});

const prevPlanSelectorMonth = () => {
    const d = new Date(planSelectorDate.value);
    d.setMonth(d.getMonth() - 1);
    planSelectorDate.value = d;
};

const nextPlanSelectorMonth = () => {
    const d = new Date(planSelectorDate.value);
    d.setMonth(d.getMonth() + 1);
    planSelectorDate.value = d;
};

// Filter plans to show only those relevant to the selected month
const availableWeeklyPlans = computed(() => {
    const selectedMonth = planSelectorDate.value.getMonth();
    const selectedYear = planSelectorDate.value.getFullYear();
    
    // Helper to get month/year from ISO string "YYYY-MM-DD"
    const getMonthYear = (dateStr) => {
        const d = new Date(dateStr);
        return { m: d.getMonth(), y: d.getFullYear() };
    };

    return store.getters.allWeeklyPlans.filter(plan => {
        // Include if start or end date falls in selected month
        const start = getMonthYear(plan.weekStart);
        const end = getMonthYear(plan.weekEnd);
        
        const startsInMonth = start.m === selectedMonth && start.y === selectedYear;
        const endsInMonth = end.m === selectedMonth && end.y === selectedYear;
        const spansMonth = (new Date(plan.weekStart) < new Date(selectedYear, selectedMonth, 1)) && (new Date(selectedYear, selectedMonth + 1, 0) < new Date(plan.weekEnd));

        return startsInMonth || endsInMonth || spansMonth;
    }).sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));
});

const activeWeeklyPlan = computed(() => {
    return store.getters.allWeeklyPlans.find(p => p.id === activeWeeklyPlanId.value) || null;
});

// Excel Report Logic
const isExcelModalOpen = ref(false);

const openExcelModal = () => {
    isExcelModalOpen.value = true;
    isMenuOpen.value = false;
};

const handleExcelAction = async (action) => {
    try {
        const d = currentDate.value;
        const payload = {
            month: d.getMonth() + 1,
            year: d.getFullYear(),
            shifts: shifts.value.map(s => ({
                date: new Date(d.getFullYear(), d.getMonth(), s.dayNumber).toISOString(),
                shiftType: s.type,
                entryTime: s.entry,
                exitTime: s.exit,
                breakDuration: parseFloat(s.break) || 0,
                additions: parseFloat(s.extra) || 0,
                deductions: parseFloat(s.deduction) || 0,
                comments: '', 
                hours: parseFloat(s.hours) || 0,
                wage: parseFloat(s.salary) || 0
            })),
            totals: {
                 totalHours: parseFloat(totalHours.value) || 0,
                 totalAdditions: 0, 
                 totalDeductions: 0, 
                 grossWage: 0, 
                 netWage: parseFloat(totalSalary.value) || 0,
                 healthTax: 0,
                 nationalInsurance: 0,
                 incomeTax: 0,
                 pension: 0,
                 studyFund: 0
            },
            emailAddress: store.getters.currentUser?.email || 'user@example.com' 
        };
        
        // Approximations for totals
        payload.shifts.forEach(s => {
            payload.totals.totalAdditions += s.additions;
            payload.totals.totalDeductions += s.deductions;
        });
        payload.totals.grossWage = payload.totals.netWage; // Simplification

        if (action === 'view') {
           const response = await api.post('reports/excel-view', payload, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report_${payload.month}_${payload.year}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else if (action === 'email') {
             await api.post('reports/excel-email', payload);
             showToast('נשלח למייל בהצלחה', 'success');
        }
        isExcelModalOpen.value = false;
    } catch (e) {
        console.error(e);
        showToast('שגיאה ביצירת דוח', 'error');
    }
};

const recalculateAllShifts = async () => {
    if (!confirm('האם לחשב מחדש את כל המשמרות בחודש זה?')) return;
    
    isLoading.value = true;
    let count = 0;
    
    // Fetch fresh rules/types to ensure we have latest data
    const allTypes = store.getters.allShiftTypes;
    
    for (const shift of shifts.value) {
        // Skip un-editable types
        if (['חופש','מחלה','חג'].some(t => shift.type.includes(t))) continue;

        // Valid Type?
        const typeObj = allTypes.find(t => t.name === shift.type);
        if (!typeObj) continue; // Cannot calc without type rules

        // Get logic-based defaults
        const defaults = getShiftDefaults(shift.type);
        
        // 1. Break Fix: If current break is 0, try to apply default
        let newBreak = Number(shift.break);
        if (newBreak === 0 && defaults.break > 0) {
            newBreak = defaults.break;
        }

        // 2. Extra/Deduction Fix: If 0, apply default
        let newExtra = Number(shift.extra);
        if (newExtra === 0 && defaults.extra > 0) newExtra = defaults.extra;
        
        let newDeduction = Number(shift.deduction);
        if (newDeduction === 0 && defaults.deduction > 0) newDeduction = defaults.deduction;

        // Construct Candidate
        const candidate = {
            ...shift,
            break: newBreak,
            extra: newExtra,
            deduction: newDeduction
        };
        
        // 3. FORCE Recalculation of Salary/Hours
        // Even if break didn't change, maybe the Salary was calculated wrong (flat) initially.
        const calculated = calculateShiftData(candidate);
        
        // Check if ANY field needs update (Break, Extra, Deduction, Hours, Salary)
        const needsUpdate = 
            newBreak !== Number(shift.break) ||
            newExtra !== Number(shift.extra) ||
            newDeduction !== Number(shift.deduction) ||
            candidate.hours !== shift.hours ||
            candidate.salary !== shift.salary;

        if (needsUpdate) {
            candidate.hours = calculated.hoursStr;
            candidate.salary = calculated.salaryStr;
            
            // Add DayName if missing
            if (!candidate.dayName) {
                 const [d, m, y] = candidate.fullDate.split('/');
                 const dateObj = new Date(y, m-1, d);
                 candidate.dayName = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'][dateObj.getDay()];
            }

            await store.dispatch('updateShift', { id: shift.id, shift: candidate });
            count++;
        }
    }
    
    isLoading.value = false;
    showToast('success', `עודכנו ${count} משמרות`);
    isMenuOpen.value = false;
};

const selectWeeklyPlan = (planId) => {
    activeWeeklyPlanId.value = planId;
    const plan = store.getters.allWeeklyPlans.find(p => p.id === planId);
    selectedPlanLabel.value = plan ? plan.label : '';
    
    // Jump to the plan's start date, OR prioritize current view month if relevant
    if (plan && plan.weekStart) {
        const pStart = new Date(plan.weekStart);
        const pEnd = new Date(plan.weekEnd);
        
        const cDate = new Date(currentDate.value);
        const cMonth = cDate.getMonth();
        const cYear = cDate.getFullYear();
        
        const sMonth = pStart.getMonth();
        const sYear = pStart.getFullYear();
        
        const eMonth = pEnd.getMonth();
        const eYear = pEnd.getFullYear();
        
        // Check if navigation month matches either start or end month of the plan
        const matchesStart = (cMonth === sMonth && cYear === sYear);
        const matchesEnd = (cMonth === eMonth && cYear === eYear);
        
        if (matchesStart || matchesEnd) {
             // If user is currently viewing one of the relevant months, stay on it.
             quickShiftDate.value = new Date(currentDate.value);
        } else {
             // otherwise default to start
             quickShiftDate.value = new Date(plan.weekStart);
        }
    }
    
    isPlanDropdownOpen.value = false;
};

const togglePlanDropdown = () => {
    isPlanDropdownOpen.value = !isPlanDropdownOpen.value;
};

// Check if a day in the calendar is selectable (today or future + within plan range)
const isDaySelectable = (val) => {
    if (!val) return false;
    
    // Support both day number (legacy) and day object logic
    let selectedDate;
    if (val.date) {
        selectedDate = new Date(val.date);
    } else {
        selectedDate = new Date(quickShiftDate.value);
        if (typeof val === 'number') {
             selectedDate.setDate(val);
        }
    }
    selectedDate.setHours(0, 0, 0, 0);
    
    // Check Plan Range if active
    if (activeWeeklyPlan.value) {
        const start = new Date(activeWeeklyPlan.value.weekStart);
        start.setHours(0,0,0,0);
        const end = new Date(activeWeeklyPlan.value.weekEnd);
        end.setHours(0,0,0,0);
        
        // If date is outside the plan's range, disable it
        if (selectedDate < start || selectedDate > end) {
            return false;
        }
        // If in plan range, allow it even if past
        return true;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
};

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
  const selectedType = tempShiftType.value;
  
  if (isEntryMode.value) {
      if (activeShiftType.value !== selectedType) {
          activeShiftType.value = selectedType;
      }
  } else {
      if (editingShift.type !== selectedType) {
          editingShift.type = selectedType;
          
          // Auto-fill defaults from Shift Type (Entry, Exit, etc.)
          const typeObj = store.getters.allShiftTypes.find(t => t.name === selectedType);
          if (typeObj) {
              if (typeObj.entry && typeObj.entry !== '--:--') {
                  editingShift.entry = typeObj.entry;
              }
              if (typeObj.exit && typeObj.exit !== '--:--') {
                  editingShift.exit = typeObj.exit;
              }
              
              // Also update extras/deductions defaults if available
              const defaults = getShiftDefaults(selectedType);
              if (defaults.extra !== undefined) editingShift.extra = defaults.extra;
              if (defaults.deduction !== undefined) editingShift.deduction = defaults.deduction;
              // Note: Break is handled by the watcher on calculatedRulesBreak
          }
      }
  }
  isShiftTypeModalOpen.value = false;
};

// Watch for temp change to auto-close if mimicking native like behavior or just waiting for selection?
// Image shows radios. User said "when I click morning". It implies immediate action? 
// The image shows radio buttons UNSELECTED or SELECTED.
// This modal appears presumably after clicking the "Shift Type" (Morning) button.
// So the request is about the STYLE of this modal.
// I have removed the footer buttons to clean it up, but we need a way to close/confirm.
// Let's attach the click action on the Label to confirm immediately?
// Or keep it simple: Select -> Auto Confirm?
// Let's modify the template to call confirm on change.

const selectShiftType = (type) => {
    tempShiftType.value = type;
    // confirmShiftTypeModal(); // Changed: User initiates confirmation via footer button
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
    restoreActiveShift();
});

const restoreActiveShift = () => {
    const all = store.getters.allShifts;
    // Find open shift: entry exists, exit is empty/placeholder, not vacation
    const found = all.find(s => s.entry && s.entry !== '--:--' && (!s.exit || s.exit === '--:--') && !s.isVacation);
    
    if (found) {
        console.log("Restoring active shift:", found);
        activeShift.value = found;
        startTimer(found.entry);
    }
};

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

const handleEntry = async () => {
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
        deduction: 0,
        date: now.toISOString()
    });
    
    // VALIDATE OVERLAP -- Pass newShift, ignore index (-1), shifts.value (current list), and now
    const allShifts = store.getters.allShifts;
    if (checkOverlap(newShift, -1, allShifts, now)) {
        showToast('error', 'שגיאה: חפיפה בשעות המשמרת עם משמרת קיימת');
        dragX.value = 0; // Reset slider
        return;
    }

    try {
        await store.dispatch('addShift', newShift);
        activeShift.value = newShift; // Temporary until reload or if using optimistic
        startTimer(entryTime);

        // 2. Wait 2 seconds then Switch to shifts tab
        setTimeout(() => {
            currentTab.value = 'shifts';
        }, 2000);
    } catch (e) {
        showToast('error', 'שגיאה בהוספת משמרת');
        dragX.value = 0;
    }
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

const handleSliderAction = async () => {
    if (activeShift.value) {
        // Exit Logic
        const now = new Date();
        const h = now.getHours().toString().padStart(2, '0');
        const m = now.getMinutes().toString().padStart(2, '0');
        const exitTime = `${h}:${m}`;
        
        // VALIDATE OVERLAP FOR EXIT
        const candidate = { ...activeShift.value, exit: exitTime };
        const allShifts = store.getters.allShifts;
        // Ignore self
        const others = allShifts.filter(s => s !== activeShift.value && s.id !== activeShift.value.id); // check ref and id

        if (checkOverlap(candidate, -1, others, now)) {
             showToast('error', 'שגיאה: חפיפה בשעות המשמרת עם משמרת קיימת');
             dragX.value = 0; // Reset slider
             return;
        }

        const toUpdate = { ...activeShift.value }; 
        toUpdate.exit = exitTime;
        const { hoursStr, salaryStr } = calculateShiftData(toUpdate);
        toUpdate.hours = hoursStr;
        toUpdate.salary = salaryStr;
        
        try {
            // Optimistic Update local for UI feedback?
            // shifts array is computed from store. Mutating store state?
            // Dispatch update
            await store.dispatch('updateShift', { id: toUpdate.id, shift: toUpdate });
            // Update local ref to show correct data until transition
            activeShift.value = toUpdate; 
        } catch (e) {
            console.error(e);
        }

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
             
             // Wait for reactivity/fetch? 
             // Just invoke logic.
             // Wait small tick?
             setTimeout(() => {
                 handleEntry(); 
                 setTimeout(() => { dragX.value = 0; }, 2000); 
             }, 100);
             return;
        }

        // Already on same month
        handleEntry(); 
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

const confirmSickDay = async (dateStr) => {
    // Parse dateStr DD/MM/YYYY
    const [d, mStr, yVal] = dateStr.split('/');
    const dStr = d.toString().padStart(2, '0');
    const mStrOp = mStr.toString().padStart(2, '0');
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
        notes: tempSickDayType.value,
        date: dateObj.toISOString() // API Field
    };

    // Check Overlap against Store
    const allShifts = store.getters.allShifts;
    // We can optimize by filtering only relevant month if checkOverlap scans all
    const conflict = checkOverlap(newShift, -1, allShifts, dateObj); 
    if (conflict) {
            const conflictDesc = conflict.isVacation ? conflict.type : `${conflict.entry}-${conflict.exit}`;
            alert(`שגיאה: חפיפה בתאריך ${fullDate} עם משמרת קיימת (${conflictDesc}).\nלא ניתן להוסיף ${tempSickDayType.value}.`);
            return; 
    }

    try {
        await store.dispatch('addShift', newShift);
        showToast('success', `נוסף: ${tempSickDayType.value}`);
    } catch (e) {
        showToast('error', 'שגיאה בשמירת נתונים');
    }
};


const confirmMonthlyPayment = async () => {
    if (!monthlyPaymentAmount.value) {
        alert('יש להזין סכום');
        return;
    }
    
    // Ensure 1st of VIEWED month
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
        type: 'תשלום חודשי',
        entry: '--:--',
        exit: '--:--',
        hours: '0:00',
        salary: parseFloat(monthlyPaymentAmount.value).toFixed(2),
        break: 0,
        extra: 0,
        deduction: 0,
        isVacation: true,
        notes: 'תשלום חודשי',
        date: dObj.toISOString()
    };
    
    // No overlap check for monthly payment (bonus)
    
    try {
        await store.dispatch('addShift', newShift);
        isMonthlyPaymentModalOpen.value = false;
        showToast('success', `נוסף תשלום חודשי: ${newShift.salary}`);
    } catch (e) {
        showToast('error', 'שגיאה בשמירת נתונים');
    }
};

const confirmRecuperation = async () => {
    if (!recuperationDays.value) {
        alert('יש להזין כמות ימים');
        return;
    }
    
    const days = parseFloat(recuperationDays.value);
    if (isNaN(days) || days <= 0) return;
    
    // Formula: Days * 8 * 45
    // Note: Use stored wage setting? For now fixed as per user code.
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
        notes: `הבראה (${days} ימים)`,
        date: dObj.toISOString()
    };

    try {
        await store.dispatch('addShift', newShift);
        isRecuperationModalOpen.value = false;
        showToast('success', `ניצול הבראה: ${days} ימים`);
    } catch(e) {
        showToast('error', 'שגיאה בשמירת נתונים');
    }
};

const pickRangeStart = async () => {
    const d = await pickDate(rangeStartDateStr.value);
    if (d) rangeStartDateStr.value = d;
};

const pickRangeEnd = async () => {
    const d = await pickDate(rangeEndDateStr.value);
    if (d) rangeEndDateStr.value = d;
};

const confirmDateRange = async () => {
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
    
    // We should probably fetch all shifts once to avoid redundant checks if we update store inside loop?
    // Actually store updates optimistically.
    // If using store.getters.allShifts inside loop, make sure it reflects added shifts if we await!
    // If we await addShift, store updates, allShifts updates.
    
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
            notes: tempPaymentType.value,
            date: current.toISOString()
        };
        
        // Overlap Check (fetch fresh list from store if awaiting?)
        const allShifts = store.getters.allShifts;
        const conflict = checkOverlap(newShift, -1, allShifts, current);
        if (conflict) {
             const conflictDesc = conflict.isVacation ? conflict.type : `${conflict.entry}-${conflict.exit}`;
             alert(`שגיאה: חפיפה בתאריך ${fullDate} עם משמרת קיימת (${conflictDesc}).\nלא ניתן להוסיף ${tempPaymentType.value}.`);
             return; 
        }
        
        try {
            await store.dispatch('addShift', newShift);
            count++;
        } catch(e) {
             console.error(e);
             alert('שגיאה בשמירה');
             return;
        }
        
        // Next day
        current.setDate(current.getDate() + 1);
    }
    
    showToast('success', `נוספו ${count} רשומות של ${tempPaymentType.value}`);
    isDateRangeModalOpen.value = false;
};

const menuItems = [
  {
    id: 1,
    label: 'משמרת סידור עבודה',
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
// Data from Store
// import { mockData } from '../services/mockData';
// import { mockShiftTypes } from '../services/mockShiftTypes';
// import { mockPaymentTypes } from '../services/mockPaymentTypes';
// import { mockSickTypes } from '../services/mockSickTypes';
// import { mockWeeklyPlans } from '../services/mockWeeklyPlans';

// const mockData = { ... } (Removed local)


const shifts = computed(() => {
  const all = store.getters.allShifts;
  const targetMonth = currentDate.value.getMonth();
  const targetYear = currentDate.value.getFullYear();
  return all.filter(s => {
      if (!s || !s.date) return false;
      const d = new Date(s.date);
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
  });
});

const shiftTypes = computed(() => store.getters.allShiftTypes);
const paymentTypes = computed(() => store.getters.allPaymentTypes);
const sickTypes = computed(() => store.getters.allSickTypes);
const weeklyPlans = computed(() => store.getters.allWeeklyPlans);

// Helper to get defaults from Shift Type settings
const getShiftDefaults = (typeName) => {
    const type = shiftTypes.value.find(t => t.name === typeName);
    if (!type) {
        return { break: 0, extra: 0, deduction: 0 };
    }
    
    // Priority Fix: Use Shift Type defined break FIRST (Specific). If 0, fallback to Global Rules.
    const typeBreak = Number(type.break || 0);
    const ruleBreak = calculateBreakMinutes(type.id);
    
    // If Shift Type has a specific Break (e.g. 42), use it. Otherwise use Rule (e.g. 20).
    const finalBreak = typeBreak > 0 ? typeBreak : ruleBreak;

    return {
        break: finalBreak,
        extra: type.extra || 0,
        deduction: type.deduction || 0
    };
};

const isLoading = ref(false);
const transitionName = ref('fade');

// Computed Totals
const totalHours = computed(() => {
  if (shifts.value.length === 0) return '0:00';
  let totalMinutes = 0;
  shifts.value.forEach(s => {
      // Handle hours format if string 'HH:MM'
    if (!s.hours || s.hours === '0:00') return;
    const [h, m] = s.hours.split(':').map(Number);
    totalMinutes += (h || 0) * 60 + (m || 0);
  });
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
});

const totalSalary = computed(() => {
  if (shifts.value.length === 0) return '0.00';
  const total = shifts.value.reduce((sum, s) => sum + (parseFloat(s.salary) || 0), 0);
  return total.toFixed(2);
});

// Fetch Data (Dummy wrapper for compatibility or trigger store fetch)
// Fetch Data
const fetchShifts = async (date) => {
    isLoading.value = true;
    try {
        // Fetch fresh data from backend
        // We use fetchInitialData on first load or just fetchShifts? 
        // Since getShifts returns all user shifts, and specific settings/types might be needed,
        // it is safer to ensure we have fresh data.
        await store.dispatch('fetchShifts'); 
        
        // If it's the VERY first load, we might want to ensure types/settings are also there
        if (store.getters.allShiftTypes.length === 0) {
             await store.dispatch('fetchShiftTypes');
        }
        if (Object.keys(store.getters.generalSettings).length === 0) {
             await store.dispatch('fetchSettings');
        }
    } catch(e) {
        console.error("Error fetching shifts:", e);
    } finally {
        // Add a small artificial delay only if it was too fast, or just finish.
        // User wants to SEE the loader.
        // If it's instant (cached), user won't see it.
        // Let's ensure at least 500ms loader for "Visual Feedback" on reload if that's what is requested.
        // But usually real network takes time.
        isLoading.value = false;
    }
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

// Return grid for Sun-Fri (6 days), excluding Saturday
const quickShiftGrid = computed(() => {
    const y = quickShiftDate.value.getFullYear();
    const m = quickShiftDate.value.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    
    let days = [];
    let firstAdded = false;

    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(y, m, i);
        const dayOfWeek = d.getDay(); // 0=Sun, 6=Sat

        if (dayOfWeek === 6) continue; // Skip Saturday

        if (!firstAdded) {
            // Pad for the first visible day
            // Mapping: 0->0, 1->1...
            for (let p = 0; p < dayOfWeek; p++) {
                days.push(null);
            }
            firstAdded = true;
        }
        
        days.push({
            label: i,
            date: d,
            inPlan: isDateInPlan(d),
            isCurrentMonth: true
        });
    }
    return days;
});

const isDateInPlan = (dateObj) => {
    if (!dateObj || !activeWeeklyPlan.value) return false;
    
    const d = dateObj instanceof Date ? new Date(dateObj) : new Date(quickShiftDate.value);
    if (!(dateObj instanceof Date) && typeof dateObj === 'number') {
         d.setDate(dateObj); // Fallback for legacy number calls if any remain
    }
    d.setHours(0,0,0,0);
    
    const start = new Date(activeWeeklyPlan.value.weekStart);
    start.setHours(0,0,0,0);
    const end = new Date(activeWeeklyPlan.value.weekEnd);
    end.setHours(0,0,0,0);
    
    return d >= start && d <= end;
};

const handleQuickDayClick = async (dayItem) => {
    if (!dayItem || !dayItem.date) return;
    
    // Create Quick Shift for this date
    const d = new Date(dayItem.date);
    
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const y = d.getFullYear();
    const dayStr = d.getDate().toString();

    const dayNameInPlan = ['יום א', 'יום ב', 'יום ג', 'יום ד', 'יום ה', 'יום ו', 'שבת'][d.getDay()];
    const dayNameFull = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'][d.getDay()];
    
    // Find shift from active weekly plan
    const planShift = activeWeeklyPlan.value?.days?.find(day => day.dayName === dayNameInPlan);
    
    if (!planShift || !planShift.isActive) {
        showToast('info', `אין משמרת מוגדרת בסידור העבודה עבור ${dayNameFull}`);
        return;
    }

    const newShift = {
        dayNumber: dayStr,
        dayName: dayNameFull,
        entry: planShift.entry,
        exit: planShift.exit,
        hours: (planShift.entry !== '--:--' && planShift.exit !== '--:--') ? '' : '0:00', 
        salary: '0.00', // recalculated below
        type: planShift.shiftName,
        fullDate: `${d.getDate().toString().padStart(2,'0')}/${m}/${y}`,
        break: 0,
        extra: 0,
        deduction: 0,
        date: d.toISOString()
    };
    
    // Apply defaults (break, extra, deduction) based on Shift Type
    // This fixes the issue where weekly plan shifts don't inherit breaks/rules
    const defaults = getShiftDefaults(planShift.shiftName);
    newShift.break = defaults.break;
    newShift.extra = defaults.extra;
    newShift.deduction = defaults.deduction;

    // Calculate hours/salary
    const { hoursStr, salaryStr } = calculateShiftData(newShift);
    newShift.hours = hoursStr;
    newShift.salary = salaryStr;

    // Check Overlap
    const allShifts = store.getters.allShifts;
    if (checkOverlap(newShift, -1, allShifts, d)) { // checkOverlap expects normalized shift?
         showToast('error', 'שגיאה: המשמרת חופפת למשמרת קיימת');
         return;
    }
    
    try {
        await store.dispatch('addShift', newShift);
        showToast('success', 'המשמרת נוספה בהצלחה!');
        setTimeout(() => {
           isQuickShiftModalOpen.value = false;
        }, 800);
    } catch (e) {
        showToast('error', 'שגיאה בשמירה');
    }
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
        // user requirement: "long press ... add ALL lines of the period"
        if (activeWeeklyPlan.value) {
            addAllShiftsFromPlan(activeWeeklyPlan.value);
        } else {
            handleQuickDayClick(day); // Fallback if no plan selected (should be blocked by UI but just in case)
        }
        isLongPressHandled.value = true;
        pressingDay.value = null; // visual feedback end
    }, 1000); // 1 second
};

const endPress = (day) => {
    if (!day) return;
    if (pressTimer) clearTimeout(pressTimer);
    pressingDay.value = null;
    
    if (!isLongPressHandled.value) {
        // Short press detected
        // User feedback: "click adds only one date". Expected: Add WHOLE LINE (Weekly Plan).
        if (activeWeeklyPlan.value) {
             addAllShiftsFromPlan(activeWeeklyPlan.value);
        } else {
             handleQuickDayClick(day);
        }
    }
    isLongPressHandled.value = false;
};

const cancelPress = () => {
    if (pressTimer) clearTimeout(pressTimer);
    pressingDay.value = null;
    isLongPressHandled.value = false;
};

// Flag to prevent rapid-fire clicks creating duplicates
const isAddingPlanShifts = ref(false);

const addAllShiftsFromPlan = async (plan) => {
    if (isAddingPlanShifts.value) return; // Block re-entry
    isAddingPlanShifts.value = true;
    
    try {
        let addedCount = 0;
        let conflictCount = 0;
        const planStart = new Date(plan.weekStart);
        
        // We assume plan.days is ordered Sunday to Saturday (0 to 6)
        for (let i = 0; i < 7; i++) {
            const dayPlan = plan.days[i];
            if (!dayPlan || !dayPlan.isActive) continue;
            // ... rest of loop logic stays same but we need to ensure we don't break the try block structure
            
            // To minimize replace footprint, I will just call the original logic processing inside.
            // But since I'm replacing the start of the function, I effectively wrap it.
            // Wait, I need to match the original code indentation/vars.
            
            /* ... Original Logic Replication for context valid ... */
            
            const targetDate = new Date(planStart);
            targetDate.setDate(targetDate.getDate() + i);
            
            // Skip Saturday check just in case, though is Day 6
            if (targetDate.getDay() === 6) continue;
    
            const today = new Date();
            today.setHours(0,0,0,0);
            targetDate.setHours(0,0,0,0);
            
            // Prepare Shift Data
            const dStr = targetDate.getDate().toString().padStart(2, '0');
            const mStr = (targetDate.getMonth() + 1).toString().padStart(2, '0');
            const y = targetDate.getFullYear();
            const fullDate = `${dStr}/${mStr}/${y}`;
            
            // Construct Shift TEMPLATE for overlap check
            const entry = dayPlan.entry;
            const exit = dayPlan.exit;
            
            const [eH, eM] = entry.split(':').map(Number);
            const [xH, xM] = exit.split(':').map(Number);
            let duration = 0;
            if (!isNaN(eH) && !isNaN(xH)) {
                 let startMin = eH * 60 + eM;
                 let endMin = xH * 60 + xM;
                 if (endMin < startMin) endMin += 24 * 60;
                 duration = (endMin - startMin) / 60;
            }
            const hoursStr = isNaN(duration) ? '0:00' : `${Math.floor(duration).toString().padStart(2,'0')}:${Math.round((duration % 1) * 60).toString().padStart(2,'0')}`;
            const salaryStr = (duration * 45).toFixed(2); 
    
            const newShift = {
                dayNumber: dStr,
                dayName: dayPlan.dayName,
                fullDate: fullDate,
                type: dayPlan.shiftName,
                entry: entry,
                exit: exit,
                hours: hoursStr,
                salary: salaryStr,
                break: 0,
                extra: 0,
                deduction: 0,
                notes: '',
                date: targetDate.toISOString()
            };
            
            // Apply defaults (break, extra, deduction) based on Shift Type
            const defaults = getShiftDefaults(dayPlan.shiftName);
            newShift.break = defaults.break;
            newShift.extra = defaults.extra;
            newShift.deduction = defaults.deduction;
            
            // Re-calculate Hours/Salary with the applied break
            // calculateShiftData uses the break value we just set
            const calculated = calculateShiftData(newShift);
            newShift.hours = calculated.hoursStr;
            newShift.salary = calculated.salaryStr;
    
            // Check Overlap
            const allShifts = store.getters.allShifts;
            if (checkOverlap(newShift, -1, allShifts, targetDate)) {
                conflictCount++;
                continue;
            }
    
            // Add
            try {
                await store.dispatch('addShift', newShift);
                addedCount++;
            } catch (e) {
                console.error('Error adding shift from plan', e);
            }
        }
    
        if (addedCount > 0) {
            showToast('success', `נוספו ${addedCount} משמרות${conflictCount ? ` (דולגו ${conflictCount} חפיפות)` : ''}`);
            isQuickShiftModalOpen.value = false;
        } else {
             showToast('info', conflictCount > 0 ? 'לא נוספו משמרות (נמצאו חפיפות)' : 'לא נוספו משמרות');
        }
    } finally {
        isAddingPlanShifts.value = false;
    }
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
        
        editingShiftIndex.value = -1; 
        editingShiftId.value = null; // New Shift Flag
        
        // Populate editingShift
        editingShift.fullDate = fullDate;
        editingShift.type = '';
        editingShift.entry = '--:--';
        editingShift.exit = '--:--';
        
        const defaults = getShiftDefaults('');
        editingShift.break = defaults.break;
        editingShift.extra = defaults.extra;
        editingShift.deduction = defaults.deduction;
        
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

/* Header Title replaced by Nav */
.header-date-nav {
    display: flex;
    align-items: center;
    gap: 10px;
    direction: ltr; /* Arrows Logic */
}

.header-date-text {
    font-size: 1.1rem;
    font-weight: 700;
}

.nav-arrow {
    background: none;
    border: none;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 5px;
}

.nav-arrow:hover {
    color: white;
}

.header-right-spacer {
    width: 75px;
    display: flex;
    justify-content: center;
}
.mini-timer {
    font-size: 0.8rem; 
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
    color: #4DB6CD; /* Blue/Teal text */
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
}

.title-icon {
    background-color: #5C6BC0; /* Indigo/Purple Icon Background */
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.title-icon svg {
    width: 20px;
    height: 20px;
}

/* Month Selector - Removed visually but keeping class placeholder if needed for JS ref (which shouldn't be valid anymore) */
.month-selector {
  display: none; 
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
/* FAB Wrapper */
.fab-wrapper {
  position: absolute;
  bottom: 120px; /* Adjusted to accommodate label and keep button position */
  left: 20px;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.fab {
  /* Position handled by wrapper now */
  position: relative;
  bottom: auto;
  left: auto;
  
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
  transition: all 0.3s ease;
}

.fab-label {
  color: #555;
  font-size: 0.85rem;
  font-weight: 500;
  transition: opacity 0.3s;
}

.fab-label.fade-out-label {
  opacity: 0.5;
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

.red-text {
    color: red !important;
    font-weight: bold;
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
  z-index: 2000;
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
    top: auto; /* Override global App.vue style */
    bottom: 20px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: fit-content;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
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
  direction: rtl; 
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

.read-only-field {
    background-color: #f9f9f9;
    color: #666;
    border-color: #e0e0e0;
    pointer-events: none; /* Make it unclickable */
}
</style>
