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
      <div class="spacer"></div>
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
          <div v-for="(shift, index) in shifts" :key="index" class="shift-row" :class="{ 'row-selected': selectedIndices.has(index) }" @click="handleRowClick(shift)">
            <div class="col-date">
              <div class="date-circle" :class="[shift.type, { selected: selectedIndices.has(index) }]" @click.stop="toggleSelection(index)">
                <template v-if="selectedIndices.has(index)">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </template>
                <template v-else>
                  <span class="day-name">{{ shift.dayName }}</span>
                  <span class="day-number">{{ shift.dayNumber }}</span>
                </template>
              </div>
            </div>
            <div class="col-entry">{{ shift.entry }}</div>
            <div class="col-exit">
              <span v-if="shift.isVacation" class="vacation-text">חופש</span>
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

    <!-- FAB Overlay (captures clicks outside) -->
    <transition name="fade">
      <div v-if="isFabMenuOpen" class="fab-overlay" @click="isFabMenuOpen = false"></div>
    </transition>

      <!-- FAB Menu Options -->
      <div class="fab-menu">
        <transition-group name="fab-item">
          <button 
            v-for="(item, index) in fabOptions" 
            :key="item.id"
            class="fab-menu-item"
            :style="{ transitionDelay: `${index * 100}ms` }"
          >
            <div class="menu-icon-circle" :class="item.iconClass">
              <svg v-if="item.isSvg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="item.svgPath"></svg>
              <span v-else class="currency-symbol">{{ item.textIcon }}</span>
            </div>
            <span class="menu-label">{{ item.label }}</span>
            <div class="menu-handle">=</div>
          </button>
        </transition-group>
      </div>

      <!-- Floating Action Button -->
      <button 
        class="fab" 
        :class="{ 'fab-rotate': isFabMenuOpen && !isSelectionMode, 'delete-mode': isSelectionMode }" 
        @click.stop="handleFabClick"
      >
        <svg v-if="isSelectionMode" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
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
              <button class="shift-type-selector">בוקר</button>

              <div class="shift-times-row">
                 <div class="time-col">
                   <span class="time-label">זמן כניסה</span>
                   <span class="time-value">-- : --</span>
                 </div>
                 <div class="time-col">
                   <span class="time-label">זמן יציאה</span>
                   <span class="time-value">-- : --</span>
                 </div>
              </div>
           </div>
        </div>

        <div class="slider-container">
           <button class="slider-btn">
             <div class="slider-arrow">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><arrow-right points=""></arrow-right><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
             </div>
             <span class="slider-text">גלול ימינה לכניסה</span>
           </button>
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
               <input type="text" v-model="editingShift.fullDate" readonly class="input-box" />
            </div>

            <div class="detail-form-row">
               <label>משמרת:</label>
               <input type="text" v-model="editingShift.type" class="input-box" />
            </div>

            <div class="detail-form-row">
               <label>כניסה:</label>
               <input type="text" v-model="editingShift.entry" class="input-box" />
            </div>

            <div class="detail-form-row">
               <label>
                 יציאה:
                 <input type="checkbox" class="inline-checkbox" />
               </label>
               <div class="input-with-icon">
                 <input type="text" v-model="editingShift.exit" class="input-box" />
                 <div class="icon-cancel-red">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="red" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                 </div>
               </div>
            </div>

            <div class="detail-form-row">
               <label>הפסקה:</label>
               <div class="input-with-unit">
                 <span class="unit-text">דק'</span>
                 <input type="number" v-model="editingShift.break" class="input-box" />
               </div>
            </div>

            <div class="detail-form-row">
               <label>תוספת יומית:</label>
               <div class="input-with-unit">
                 <span class="unit-text">ש"ח</span>
                 <input type="number" v-model="editingShift.extra" class="input-box" />
               </div>
            </div>

            <div class="detail-form-row">
               <label>הורדה יומית:</label>
               <div class="input-with-unit">
                 <span class="unit-text">ש"ח</span>
                 <input type="number" v-model="editingShift.deduction" class="input-box" />
               </div>
            </div>

            <div class="detail-form-row notes-row">
               <label class="notes-label">הערות:</label>
                <textarea class="notes-area"></textarea>
            </div>

          </div>

          <div class="detail-footer">
            <button class="footer-btn btn-delete" @click="closeDetailModal">
               <span>מחיקה</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div class="footer-divider"></div>
            <button class="footer-btn btn-cancel" @click="closeDetailModal">
               <span>ביטול</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div class="footer-divider"></div>
            <button class="footer-btn btn-update" @click="closeDetailModal">
               <span>עדכן</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
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
         <span>כניסה</span>
       </button>
    </nav>

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
        <a href="#" class="menu-item">
          <span class="item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </span>
          <span>משמרות</span>
        </a>
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
import { ref, computed, reactive } from 'vue';

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

const handleRowClick = (shift) => {
  // If in selection mode, maybe row click should select? User requested "simple click on row makes screen appear".
  // Let's assume selection mode strictly requires clicking the circle as implemented in toggleSelection.
  // But if the user wants row click to open modal, we normally prevent conflicts.
  // We'll allow opening modal unless we are explicitly clicking the circle (handled by @click.stop on circle).
  
  // Populate
  editingShift.fullDate = `24/12/2025`; // logic to build full date from partial
  // For demo, let's map:
  editingShift.fullDate = `${shift.dayNumber}/12/2025`; // simplistic
  editingShift.type = 'בוקר'; // default or from shift data
  editingShift.entry = shift.entry;
  editingShift.exit = shift.exit;
  editingShift.break = 0;
  editingShift.extra = 0.0;
  editingShift.deduction = 0.0;
  
  isDetailModalOpen.value = true;
};

const closeDetailModal = () => {
    isDetailModalOpen.value = false;
};

// Entry View Data
const currentTime = ref('20 31');
const currentDateString = ref("יום שני, ט' טבת ה'תשפ\"ו | 29/12/2025");

const menuItems = [
  {
    id: 1,
    label: 'משמרת מהירה',
    iconClass: 'red',
    isSvg: true,
    svgPath: '<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>',
  },
  {
    id: 2,
    label: 'משמרת חדשה',
    iconClass: 'teal',
    isSvg: true,
    svgPath: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="12" y1="16" x2="12" y2="22"></line><line x1="9" y1="19" x2="15" y2="19"></line>',
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
  isLoading.value = true;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const key = `${year}-${month}`;

  // Simulate API delay
  setTimeout(() => {
    shifts.value = mockData[key] || [];
    isLoading.value = false;
  }, 500); // 500ms delay
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
  fetchShifts(d);
};

const prevMonth = () => {
  transitionName.value = 'slide-prev';
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() - 1);
  currentDate.value = d;
  fetchShifts(d);
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

/* Transitions */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
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
  background-color: #E91E63; /* Pink */
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
}

.fab-menu-item {
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
  justify-content: space-between;
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
  flex: 1;
  text-align: right; /* Hebrew text alignment */
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  padding: 0 16px;
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
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
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
}

.card-label {
  display: block;
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: 10px;
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

.shift-times-row {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.time-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-label {
  font-size: 0.9rem;
  color: #777;
}

.time-value {
  font-size: 1.5rem;
  font-weight: 300;
  color: #444;
}

.slider-container {
  width: 90%;
  max-width: 400px;
  margin-bottom: 40px;
}

.slider-btn {
  width: 100%;
  height: 56px;
  border-radius: 28px;
  border: 1px solid #0093AB; /* border only as per image */
  background: white;
  display: flex;
  align-items: center;
  padding: 4px;
  position: relative;
  cursor: pointer;
}

.slider-arrow {
  width: 48px;
  height: 48px;
  background-color: #4DD0E1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.slider-text {
  flex: 1;
  text-align: center;
  color: #0093AB;
  font-weight: 700;
  font-size: 1.1rem;
}

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
  backdrop-filter: blur(2px);
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
</style>
