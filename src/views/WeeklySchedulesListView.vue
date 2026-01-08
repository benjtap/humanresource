<template>
  <div 
    class="weekly-list-page"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  >
    
    <!-- Header -->
    <!-- Header with Hamburger and Date Nav -->
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

      <button class="icon-btn" style="visibility: visible;"> <!-- Right spacer/icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      </button>
    </header>

    <!-- Page Title Bar -->
    <div class="page-title-bar">
        <span>רשימת סידורי עבודה</span>
        <div class="title-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
    </div>

    <!-- Content -->
    <div class="list-container">
        <transition :name="transitionName" mode="out-in">
            <div key="list" style="width: 100%;">
                <div class="empty-state" v-if="sortedPlans.length === 0">
                    <div class="hand-icon-wrapper">
                         <svg class="hand-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M30 40 L20 50 L30 60" stroke="#00C853" stroke-width="3" stroke-linecap="round"/>
                           <path d="M70 40 L80 50 L70 60" stroke="#00C853" stroke-width="3" stroke-linecap="round"/>
                           <path d="M50 80 C50 80 45 70 45 60 L45 35 C45 32 47 30 50 30 C53 30 55 32 55 35 L55 55 L58 55 C60 55 62 57 62 60 L60 80" stroke="#9E9E9E" stroke-width="3" fill="none" stroke-linecap="round"/>
                           <path d="M40 55 Q 40 45 45 35" stroke="#9E9E9E" stroke-width="2" fill="none"/> 
                         </svg>
                    </div>
                    <p class="empty-text title">אין סידורי עבודה</p>
                    <p class="empty-text subtitle">עדיין לא נוצרו סידורים</p>
                </div>

                <div v-else class="plans-list">
                     <div v-for="(plan, index) in sortedPlans" :key="plan.id" class="plan-card" @click="openPlan(plan.id)">
                         <div class="plan-info">
                             <div class="plan-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0093AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                             </div>
                             <div class="plan-dates">
                                 <span class="week-label">{{ plan.label }}</span>
                             </div>
                         </div>
                         
                         <div class="plan-actions">
                             <button class="edit-btn" @click.stop="openEditModal(plan)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                             </button>
                             <button class="delete-btn" @click.stop="deletePlan(plan.id)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                             </button>
                             <div class="plan-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        </transition>
    </div>

    <!-- FAB Add Button -->
    <button class="fab-add" @click="openModalNew">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </button>
    
    <!-- Bottom Tab Bar -->
    <div class="bottom-tab-bar">
        <div class="tab-item active">
            <span class="tab-label">סידור עבודה</span>
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
    </div>



    <!-- Detail Modal Wrapper -->
    <div v-if="showDetailModal" class="modal-overlay-wrapper">
        <WeeklyPlanView 
            :planId="selectedDetailedPlanId" 
            :mode="detailMode"
            :isModal="true" 
            @close="closeDetailModal" 
            class="centered-modal-content"
        />
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
        <router-link to="/weekly-schedules" class="menu-item active-menu-item" @click="isMenuOpen = false">
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

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';
import WeeklyPlanView from './WeeklyPlanView.vue';

const router = useRouter();

// Sidebar
const isMenuOpen = ref(false);

const logout = () => {
    store.dispatch('saveToken', null);
    store.commit('SET_USER', null);
    router.push({ name: 'login' });
};


// Date State
const currentDate = ref(new Date());
const transitionName = ref('fade');

// Month Formatting
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

// Month Navigation
const nextMonth = () => {
  transitionName.value = 'slide-prev'; 
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() + 1);
  currentDate.value = d;
};

const prevMonth = () => {
  transitionName.value = 'slide-next'; 
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() - 1);
  currentDate.value = d;
};

const showDetailModal = ref(false);
const selectedDetailedPlanId = ref(null);

// Filtering Plans
const sortedPlans = computed(() => {
    const selectedMonth = currentDate.value.getMonth();
    const selectedYear = currentDate.value.getFullYear();

    const getMonthYear = (dateStr) => {
        const d = new Date(dateStr);
        return { m: d.getMonth(), y: d.getFullYear() };
    };

    const filtered = store.getters.allWeeklyPlans.filter(plan => {
        const start = getMonthYear(plan.weekStart);
        const end = getMonthYear(plan.weekEnd);
        
        const startsInMonth = start.m === selectedMonth && start.y === selectedYear;
        const endsInMonth = end.m === selectedMonth && end.y === selectedYear;
        const spansMonth = (new Date(plan.weekStart) < new Date(selectedYear, selectedMonth, 1)) && (new Date(plan.weekEnd) > new Date(selectedYear, selectedMonth + 1, 0));

        return startsInMonth || endsInMonth || spansMonth;
    });

    // Sort Ascending by Date
    return filtered.sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));
});

const detailMode = ref('view');

const openModalNew = () => {
    selectedDetailedPlanId.value = null;
    detailMode.value = 'new';
    showDetailModal.value = true;
};

const openEditModal = (plan) => {
    selectedDetailedPlanId.value = plan.id;
    detailMode.value = 'view';
    showDetailModal.value = true;
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedDetailedPlanId.value = null;
};

// Navigation & Actions
const goBack = () => router.push({ name: 'shifts' });
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

const toggleMenu = () => goBack(); 

const openPlan = (id) => {
    // Open in Detail Modal
    selectedDetailedPlanId.value = id;
    detailMode.value = 'view';
    showDetailModal.value = true;
};

const deletePlan = async (id) => {
    if (confirm('האם אתה בטוח שברצונך למחוק סידור עבודה זה?')) {
        try {
            await store.dispatch('deleteWeeklyPlan', id);
        } catch (e) {
            console.error(e);
            alert('שגיאה במחיקת סידור העבודה');
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

.weekly-list-page {
  font-family: 'Heebo', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #333;
  direction: rtl;
  position: relative;
  padding-bottom: 60px; /* Space for bottom tab */
}

/* Header from ShiftsView */
/* Header from ShiftsView */
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

.header-spacer { width: 0; }

.icon-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 8px;
}

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

/* Month Selector */
.month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #008ba3; /* Slightly darker teal */
  color: white;
  font-size: 1rem;
  flex-direction: row-reverse; /* Fix LTR/RTL visual order */
}

.month-side {
  font-size: 0.9rem;
  opacity: 0.7;
  cursor: pointer;
  min-width: 80px;
  text-align: center;
}

.current-month {
  font-weight: bold;
  font-size: 1.1rem;
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

.list-container {
    padding: 20px;
    flex: 1;
    overflow-y: auto;
}

.plans-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.plan-card {
    background: white;
    border-radius: 12px;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.plan-card:active {
    transform: scale(0.98);
    background-color: #fafafa;
}

.plan-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.plan-icon {
    background-color: rgba(0, 147, 171, 0.1);
    padding: 10px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.week-label {
    font-size: 1.1rem;
    font-weight: 500;
    color: #333;
}

.plan-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.edit-btn, .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.edit-btn { color: #0093AB; }
.delete-btn { color: #e57373; }

.edit-btn:hover, .delete-btn:hover {
    background-color: #f5f5f5;
}

.fab-add {
    position: fixed;
    left: 30px; 
    right: auto;
    width: 56px;
    height: 56px;
    background-color: #E91E63;
    color: white;
    border-radius: 50%;
    border: none;
    box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 90; 
    bottom: 80px;
}

/* Bottom Tab Bar */
.bottom-tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: #0093AB;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 100;
}

.tab-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: white; /* Active color */
    padding: 10px 20px;
    border-bottom: 3px solid white;
}

.tab-label {
    font-size: 1.1rem;
    font-weight: bold;
}

/* Empty State */
.empty-state {
    text-align: center;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeIn 0.5s ease-out;
}

.hand-icon-wrapper {
    width: 120px;
    height: 120px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.hand-icon {
    width: 80px;
    height: 80px;
    opacity: 0.8;
}

.empty-text.title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #444;
    margin-bottom: 5px;
}

.empty-text.subtitle {
    font-size: 1.1rem;
    color: #888;
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
    z-index: 200;
}

.modal-card {
    background: white;
    width: 320px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-title {
    background-color: #0093AB;
    color: white;
    padding: 15px;
    font-size: 1.1rem;
    font-weight: bold;
    text-align: center;
}

.modal-body {
    padding: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #555;
    font-size: 0.9rem;
}

.form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: inherit;
    font-size: 1rem;
}

.form-input:focus {
    outline: none;
    border-color: #0093AB;
}

.modal-footer {
    padding: 15px 20px;
    background-color: #f9f9f9;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.modal-btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    font-family: inherit;
}

.modal-btn.cancel {
    background-color: #e0e0e0;
    color: #333;
}

.modal-btn.save {
    background-color: #0093AB;
    color: white;
}

/* Full Screen Modal Override */
/* Centered Modal Overlay */
.modal-overlay-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.6);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.centered-modal-content {
    width: 100%;
    max-width: 600px;
    height: 90vh;
    max-height: 800px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.3s ease-out;
}

.slide-next-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}
.slide-next-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
.slide-prev-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
