<template>
  <div 
    class="hours-page"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  >
    
    <!-- Header -->
    <!-- Header with Date Nav -->
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

      <button class="icon-btn" style="visibility: hidden">
         <div style="width: 24px;"></div>
      </button>
    </header>

    <!-- Page Title Bar -->
    <div class="page-title-bar">
        <span>שעות</span>
        <div class="title-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
    </div>

    <!-- Month Header -->


    <!-- Main Content (Scrollable) -->
    <div class="content-scroll">
        
        <!-- Stats List -->
        <div class="stats-list">
             <div class="stat-item" v-for="(val, label) in hoursBreakdown" :key="label">
                <!-- Label e.g. "100 %" -->
                <!-- Transform "% 100" to "100 %" for display if needed or keep format -->
                <span class="stat-percent">{{ label.replace('% ', '') }} %</span>
                <span class="stat-arrow">--></span>
                <span class="stat-time">{{ val }}</span>
            </div>
            <!-- If empty show default -->
            <div v-if="Object.keys(hoursBreakdown).length === 0" class="stat-item">
                <span class="stat-percent">100 %</span>
                <span class="stat-arrow">--></span>
                <span class="stat-time">0:00</span>
            </div>
        </div>

        <!-- Donut Charts -->
        <div class="charts-row">
            <!-- Orange Chart (Hours) -->
            <div class="chart-wrapper">
                <div class="donut-chart orange">
                     <div class="donut-hole"></div>
                </div>
                <span class="chart-label">שעות</span>
            </div>

            <!-- Blue Chart (Salary) -->
            <div class="chart-wrapper">
                <div class="donut-chart blue">
                     <div class="donut-hole"></div>
                </div>
                <span class="chart-label">שכר חודשי</span>
            </div>
        </div>

        <!-- Bar Chart -->
        <div class="bar-chart-container">
             <div class="y-axis">
                 <span>6k</span>
                 <span>4.5k</span>
                 <span>3k</span>
                 <span>1.5k</span>
                 <span>0</span>
             </div>
             <div class="chart-area">
                 <div class="grid-lines">
                     <div class="line"></div>
                     <div class="line"></div>
                     <div class="line"></div>
                     <div class="line"></div>
                     <div class="line base"></div>
                 </div>
                 <div class="bars-container">
                     <!-- Loop for mock bars, only current month active -->
                     <div class="bar-group" v-for="m in 12" :key="m">
                         <div v-if="m === 1" class="bar-pair">
                             <div class="bar blue" style="height: 30%"></div>
                             <div class="bar orange" style="height: 28%"></div>
                         </div>
                     </div>
                 </div>
                 <div class="x-axis">
                     <span v-for="m in 12" :key="m">{{ m }}</span>
                 </div>
             </div>
        </div>

    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
        <button class="nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>שעות</span>
        </button>
        <button class="nav-item" @click="goToSummary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>פירוט שכר</span>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { mockData } from '../services/mockData';

import store from '../store';

const router = useRouter();
const currentDate = ref(new Date());
const isMenuOpen = ref(false);

const logout = () => {
    store.dispatch('saveToken', null);
    store.commit('SET_USER', null);
    router.push({ name: 'login' });
};

const currentMonthLabel = computed(() => {
   return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate.value);
});

// Real Data Calculation
// Helper for breakdown (Must be defined before use)
const monthlyShifts = computed(() => {
    const all = store.getters.allShifts;
    const y = currentDate.value.getFullYear();
    const m = currentDate.value.getMonth();
    
    return all.filter(s => {
        let d = new Date(s.date);
        if (isNaN(d.getTime()) && s.fullDate) {
             const [dd, mm, yy] = s.fullDate.split('/');
             d = new Date(yy, mm - 1, dd);
        }
        return d.getFullYear() === y && d.getMonth() === m;
    });
});

onMounted(() => {
    calculateHours();
});

// Helper for breakdown (Must be defined before use)
const addMinutes = (dict, key, mins) => {
    if (!dict[key]) dict[key] = 0;
    dict[key] += mins;
};

const calculateShiftStats = () => {
    const shifts = monthlyShifts.value;
    const hourlyWage = store.getters.hourlyWage || 0;
    const breakdown = {};
    
    // Default keys to ensure order 100, 125, 150
    breakdown['% 100'] = 0;
    breakdown['% 125'] = 0;
    breakdown['% 150'] = 0;

    shifts.forEach(s => {
       // Only process fully defined shifts
       if (!s.entry || !s.exit || s.entry === '--:--' || s.exit === '--:--') return;
       
       const [h1, m1] = s.entry.split(':').map(Number);
       const [h2, m2] = s.exit.split(':').map(Number);
       let diff = (new Date(0,0,0,h2,m2)) - (new Date(0,0,0,h1,m1));
       if (diff < 0) diff += 24*3600*1000;
       
       const typeName = s.type;
       const type = store.getters.allShiftTypes.find(t => t.name === typeName);
       
       // Break Logic: Instance > Type > 0
       let breakMins = s.break;
       if (!breakMins && type && type.break) {
            breakMins = type.break;
       }
       breakMins = parseInt(breakMins || 0);
       
       diff -= breakMins * 60 * 1000;
       if (diff < 0) diff = 0;
       
       const minutesWorked = diff / 60000;
       if (minutesWorked <= 0) return;

       const rules = type ? type.rates : [];
       
       if (!rules || rules.length === 0) {
           addMinutes(breakdown, '% 100', minutesWorked);
       } else {
           let remaining = minutesWorked;
           for (const rule of rules) {
               if (remaining <= 0) break;
               const [rH, rM] = rule.limit ? rule.limit.split(':').map(Number) : [0,0];
               const limit = (rH * 60) + rM;
               if (limit <= 0) continue; 
               
               const portion = Math.min(remaining, limit);
               addMinutes(breakdown, `% ${rule.value}`, portion);
               
               remaining -= portion;
           }
           
           if (remaining > 0) {
               const lastRule = rules[rules.length - 1];
               const lastVal = lastRule ? lastRule.value : 100;
               addMinutes(breakdown, `% ${lastVal}`, remaining);
           }
       }
    });

    return breakdown;
};

const hoursBreakdown = ref({});

const calculateHours = () => {
    const breakdown = calculateShiftStats();
    
    const formatted = {};
    // Sort keys based on numeric value
    const keys = Object.keys(breakdown).sort((a,b) => parseFloat(a.replace('%','')) - parseFloat(b.replace('%','')));
    
    keys.forEach(k => {
        const mTotal = breakdown[k];
        // Only include if > 0 or if it's a standard key
        const h = Math.floor(mTotal / 60);
        const m = Math.round(mTotal % 60);
        formatted[k] = `${h}:${m.toString().padStart(2, '0')}`;
    });
    
    hoursBreakdown.value = formatted;
};

// Watch for changes in filtered data (e.g. month navigation)


watch(monthlyShifts, () => {
    calculateHours();
});

const nextMonth = () => {
    const d = new Date(currentDate.value);
    d.setMonth(d.getMonth() + 1);
    currentDate.value = d;
};

const prevMonth = () => {
    const d = new Date(currentDate.value);
    d.setMonth(d.getMonth() - 1);
    currentDate.value = d;
};

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
        nextMonth(); // Swipe Left -> Next Month
    }
    if (touchEndX.value > touchStartX.value + threshold) {
        prevMonth(); // Swipe Right -> Prev Month
    }
};

const goToSummary = () => {
    router.push({ name: 'summary' });
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

.hours-page {
  font-family: 'Heebo', sans-serif;
  background-color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: #333;
  direction: rtl;
  overflow: hidden;
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

/* Header Navigation */
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
    background-color: #0093AB; /* Teal Icon Background */
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

/* Month Header */


/* Content */
.content-scroll {
    flex: 1;
    overflow-y: auto;
    background: white;
}

/* Stats List */
.stats-list {
    margin-bottom: 20px;
}

.stat-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #eee;
    font-size: 1rem;
    color: #444;
    gap: 10px;
}

.stat-percent { font-weight: 500; min-width: 50px; text-align: right; }
.stat-arrow { color: #888; margin: 0 10px; font-size: 0.8rem; }
.stat-time { font-weight: 400; min-width: 50px; text-align: left; }

/* Charts Row */
.charts-row {
    display: flex;
    justify-content: space-around;
    padding: 20px 40px;
    margin-bottom: 20px;
}

.chart-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.donut-chart {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.donut-chart.orange {
    background: conic-gradient(#FF7043 0% 70%, #eee 70% 100%);
}

.donut-chart.blue {
    background: conic-gradient(#03A9F4 0% 70%, #eee 70% 100%);
}

.donut-hole {
    width: 35px;
    height: 35px;
    background: white;
    border-radius: 50%;
}

.chart-label {
    font-size: 0.9rem;
    color: #555;
    font-weight: 500;
}

/* Bar Chart */
.bar-chart-container {
    padding: 0 20px 20px 20px;
    display: flex;
    height: 240px;
    font-size: 0.7rem;
    color: #888;
}

.y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 10px;
    padding-bottom: 20px; /* Align with x-axis */
}

.chart-area {
    flex: 1;
    position: relative;
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    display: flex;
    flex-direction: column;
}

.grid-lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 20px; /* x-axis space */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 0;
}

.line {
    width: 100%;
    height: 1px;
    background-color: #eee;
}

.bars-container {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    padding-bottom: 5px;
    z-index: 1;
    padding-left: 5px;
}

.bar-group {
    width: 6%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.bar-pair {
    display: flex;
    gap: 2px;
    height: 100%;
    align-items: flex-end;
}

.bar {
    width: 6px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
}

.bar.blue { background-color: #03A9F4; }
.bar.orange { background-color: #FF7043; }

.x-axis {
    height: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #aaa;
}


/* Bottom Nav */
.bottom-nav {
  height: 60px;
  background-color: #0093AB;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-shrink: 0;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: row; /* Icon left of text? Image shows stacked or row? Step 101 was row. Image 2 shows Text below icon or side? Hard to tell. Step 101 used row. Let's keep row for consistency or column. Image shows "Pay Details" and "Hours". */
  /* Re-reading user request: "fais une nouvelle vue". View Step 101: Nav items Row. */
  gap: 8px;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
}

.nav-item.active {
  color: white;
  font-weight: 700;
}

</style>
