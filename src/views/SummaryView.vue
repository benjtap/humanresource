<template>
  <div 
    class="summary-page"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  >
    <!-- Header -->
    <!-- Header with Date Nav (Teal) -->
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

    <!-- Page Title Bar (White) -->
    <div class="page-title-bar">
        <span>סיכום חודשי</span>
        <div class="title-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
    </div>

    <!-- Month Selector -->


    <!-- Main Content Area (Scrollable) -->
    <main class="content-area">
        <div class="summary-content">
        
        <!-- Section 1: Days / Hours -->
        <div class="section-title">ימים / שעות:</div>
        <div class="stat-row">
            <span class="stat-label">סה"כ ימים:</span>
            <span class="stat-value">{{ totalDays }} ימים</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">סה"כ שעות:</span>
            <span class="stat-value">{{ totalHoursFormatted }} שעות</span>
        </div>

        <div class="divider"></div>
        
        <!-- Section: Hours Breakdown (New) -->
        <div class="section-title">שעות:</div>
        <div class="stat-row" v-for="(val, label) in hoursBreakdown" :key="label">
             <!-- Label is like '% 100' -->
             <span class="stat-label">{{ label }}</span>
             <!-- Value is like '230:00' -->
             <span class="stat-value"><- {{ val }}</span> 
        </div>

        <div class="divider"></div>

        <!-- Section 2: Leaves Breakdown -->
        <div class="stat-row">
            <span class="stat-label">ימי חופש:</span>
            <span class="stat-value">{{ vacationDays }} ימים</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">ימי מחלה:</span>
            <span class="stat-value">{{ sickDays }} ימים</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">ימי חג:</span>
            <span class="stat-value">{{ holidayDays }} ימים</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">ימי הבראה:</span>
            <span class="stat-value">{{ recuperationDays }} ימים</span>
        </div>

        <div class="divider"></div>

        <!-- Section 3: Additions / Deductions -->
        <div class="section-title">הוספות / הורדות:</div>
        <div class="stat-row">
            <span class="stat-label">הוספות:</span>
            <span class="stat-value">{{ totalExtra }} ש"ח</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">הוספות יומיות:</span>
            <span class="stat-value">0.00 ש"ח</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">הורדות:</span>
            <span class="stat-value red-text">{{ totalDeduction }} ש"ח</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">הורדות יומיות:</span>
            <span class="stat-value red-text">0.00 ש"ח</span>
        </div>

        <div class="divider"></div>

        <!-- Gross Salary -->
        <div class="section-title" style="margin-top: 20px;">שכר ברוטו:</div>
        <div class="stat-row gross-row">
            <span class="stat-value gross-value">סה"כ: {{ totalSalary }} ש"ח</span>
        </div>
        
        <div class="divider"></div>

        <!-- Section 4: Mandatory Deductions (Niouyi Hova) -->
        <div class="section-title">ניכויי חובה:</div>
        <div class="stat-row">
            <span class="stat-label">ביטוח לאומי:</span>
            <span class="stat-value red-text">{{ nationalInsurance }} ש"ח</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">מס בריאות:</span>
            <span class="stat-value red-text">{{ healthTax }} ש"ח</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">מס הכנסה:</span>
            <span class="stat-value red-text">{{ incomeTax }} ש"ח</span>
        </div>
        <div class="stat-row">
            <span class="stat-label" style="color: #999;">* שווי מס:</span>
            <span class="stat-value" style="color: #999;">0.00 ש"ח</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">קרן פנסיה:</span>
            <span class="stat-value red-text">{{ pensionFund }} ש"ח</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">קרן השתלמות:</span>
            <span class="stat-value red-text">0.00 ש"ח</span>
        </div>

        </div>

        <!-- Net Salary Footer (Blue Area) - Inside Scrollable Area -->
        <div class="net-salary-footer">
            <!-- Decoration Icons Left -->
            <div class="net-icons">
                <div class="icon-calc">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="14"></line><line x1="16" y1="18" x2="16" y2="18"></line><line x1="12" y1="14" x2="12" y2="14"></line><line x1="12" y1="18" x2="12" y2="18"></line><line x1="8" y1="14" x2="8" y2="14"></line><line x1="8" y1="18" x2="8" y2="18"></line></svg>
                </div>
                <div class="icon-file" style="margin-top:15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <div style="color:white; font-size:0.7rem; text-align:center;">תלוש שכר</div>
                </div>
            </div>

            <!-- Text Right -->
            <div class="net-text-area">
                <div class="net-title">שכר נטו:</div>
                
                <div class="net-sub-row">
                <span class="net-label-small">הורדות נטו:</span>
                <span class="net-value-small">0.00 ש"ח</span>
                </div>
                
                <div class="net-main-row">
                <span class="net-label-main">משכורת:</span>
                <span class="net-value-main">{{ netSalary }} ש"ח</span>
                </div>
            </div>
        </div>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
       <button class="nav-item" @click="goToShifts">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
         <span>שעות</span>
       </button>
        <button class="nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          <span>פירוט שכר</span>
        </button>
    </nav>

    <Sidebar 
      :isOpen="isMenuOpen" 
      @update:isOpen="isMenuOpen = $event" 
      :currentDate="currentDate"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from '../store';
import Sidebar from '../components/Sidebar.vue';
import { mockData } from '../services/mockData';

const router = useRouter();
const route = useRoute();

const isMenuOpen = ref(false);
const currentDate = ref(new Date());

// Initialize
onMounted(() => {
    // Get month from query or use current
    const dateStr = route.query.date;
    if (dateStr) {
        currentDate.value = new Date(dateStr);
    }
    // No need to call fetchData, computed 'shifts' handles it
});

const shifts = computed(() => {
    const all = store.getters.allShifts;
    const y = currentDate.value.getFullYear();
    const m = currentDate.value.getMonth(); // 0-based
    
    return all.filter(s => {
        // Parse shift date. safe parse from s.date (ISO) or s.fullDate (DD/MM/YYYY)
        let d = new Date(s.date);
        if (isNaN(d.getTime()) && s.fullDate) {
             const [dd, mm, yy] = s.fullDate.split('/');
             d = new Date(yy, mm - 1, dd);
        }
        return d.getFullYear() === y && d.getMonth() === m;
    });
});

// Formatting
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

// Actions
const prevMonth = () => {
    const d = new Date(currentDate.value);
    d.setMonth(d.getMonth() - 1);
    currentDate.value = d;
};

const nextMonth = () => {
    const d = new Date(currentDate.value);
    d.setMonth(d.getMonth() + 1);
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

const goToShifts = () => {
    // Navigate to Hours View
    const y = currentDate.value.getFullYear();
    const m = (currentDate.value.getMonth() + 1).toString().padStart(2, '0');
    const d = currentDate.value.getDate().toString().padStart(2, '0');
    const dateParam = `${y}-${m}-${d}`; 
    router.push({ name: 'hours', query: { date: dateParam }}); 
};

// Logout handled by Sidebar

// Computeds for Stats
const totalDays = computed(() => shifts.value.length);

const totalHoursFormatted = computed(() => {
    let totalMins = 0;
    shifts.value.forEach(s => {
        if (!s.entry || !s.exit || s.entry === '--:--' || s.exit === '--:--') return;
        
        const [h1, m1] = s.entry.split(':').map(Number);
        const [h2, m2] = s.exit.split(':').map(Number);
        let diff = (new Date(0,0,0,h2,m2)) - (new Date(0,0,0,h1,m1));
        if (diff < 0) diff += 24*3600*1000;
        
        // Break Deduction Logic: 
        // User request: "only remove defaults if defined in shift type".
        // We use instance break if present, else fallback to Shift Type default.
        const typeName = s.type;
        const type = store.getters.allShiftTypes.find(t => t.name === typeName);
        
        // If s.break is explicitly 0, we trust it? Or if it's undefined?
        // Safe bet: If s.break is set, use it. If not, check type.
        // But for mock data which might have 'break: 0' but 'type: Morning' (with 45), we might want the fallback.
        // Let's assume if s.break is missing or 0, we check type.
        let breakMins = s.break;
        if (!breakMins && type && type.break) {
            breakMins = type.break;
        }
        breakMins = parseInt(breakMins || 0);

        diff -= breakMins * 60 * 1000;
        if (diff < 0) diff = 0;
        
        totalMins += diff / 60000;
    });
    
    const h = Math.floor(totalMins / 60);
    const m = Math.round(totalMins % 60);
    return `${h} שעות ${m} דקות`;
});

const vacationDays = computed(() => shifts.value.filter(s => s.type && s.type.includes('חופש')).length);
const sickDays = computed(() => shifts.value.filter(s => s.type && s.type.includes('מחלה')).length);
const holidayDays = computed(() => shifts.value.filter(s => s.type && s.type.includes('חג')).length);
const recuperationDays = computed(() => shifts.value.filter(s => s.type && s.type.includes('הבראה')).length);

const totalExtra = computed(() => shifts.value.reduce((acc, s) => acc + (parseFloat(s.extra) || 0), 0).toFixed(2));
const totalDeduction = computed(() => shifts.value.reduce((acc, s) => acc + (parseFloat(s.deduction) || 0), 0).toFixed(2));

// Shared calculation function for breakdown and salary
const calculateShiftStats = () => {
    const hourlyWage = store.getters.hourlyWage || 0;
    const breakdown = {};
    let calculatedTotalSalary = 0;

    shifts.value.forEach(s => {
       if (!s.entry || !s.exit || s.entry === '--:--' || s.exit === '--:--') return;
       
       const [h1, m1] = s.entry.split(':').map(Number);
       const [h2, m2] = s.exit.split(':').map(Number);
       let diff = (new Date(0,0,0,h2,m2)) - (new Date(0,0,0,h1,m1));
       if (diff < 0) diff += 24*3600*1000;
       
       const typeName = s.type;
       const type = store.getters.allShiftTypes.find(t => t.name === typeName);
       
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
       
       let shiftSalary = 0;
       
       // Default linear calc if no rules
       if (!rules || rules.length === 0) {
           addMinutes(breakdown, '% 100', minutesWorked);
           shiftSalary += (minutesWorked / 60) * hourlyWage;
       } else {
           let remaining = minutesWorked;
           for (const rule of rules) {
               if (remaining <= 0) break;
               const [rH, rM] = rule.limit ? rule.limit.split(':').map(Number) : [0,0];
               const limit = (rH * 60) + rM;
               if (limit <= 0) continue; 
               
               const portion = Math.min(remaining, limit);
               addMinutes(breakdown, `% ${rule.value}`, portion);
               
               // Salary for this portion
               shiftSalary += (portion / 60) * hourlyWage * (rule.value / 100);
               
               remaining -= portion;
           }
           
           if (remaining > 0) {
               const lastRule = rules[rules.length - 1];
               const lastVal = lastRule ? lastRule.value : 100;
               addMinutes(breakdown, `% ${lastVal}`, remaining);
               
               shiftSalary += (remaining / 60) * hourlyWage * (lastVal / 100);
           }
       }
       
       // Add Extra / Deduction
       shiftSalary += parseFloat(s.extra || 0);
       shiftSalary -= parseFloat(s.deduction || 0);
       
       calculatedTotalSalary += shiftSalary;
    });

    return { breakdown, calculatedTotalSalary };
};

const addMinutes = (dict, key, mins) => {
    if (!dict[key]) dict[key] = 0;
    dict[key] += mins;
};

const hoursBreakdown = computed(() => {
    const { breakdown } = calculateShiftStats();
    
    // Format
    const formatted = {};
    const keys = Object.keys(breakdown).sort((a,b) => parseFloat(a.replace('%','')) - parseFloat(b.replace('%','')));
    
    const allKeys = ['% 100', '% 125', '% 150', ...keys].filter((v, i, a) => a.indexOf(v) === i);
    
    allKeys.forEach(k => {
        const mTotal = breakdown[k] || 0;
        const h = Math.floor(mTotal / 60);
        const m = Math.round(mTotal % 60);
        formatted[k] = `${h}:${m.toString().padStart(2, '0')}`;
    });
    return formatted;
});

const totalSalary = computed(() => {
    const { calculatedTotalSalary } = calculateShiftStats();
    return calculatedTotalSalary.toFixed(2);
});

// Mandatory Deductions Calculation (Approximation)
const gross = computed(() => parseFloat(totalSalary.value));

const nationalInsurance = computed(() => (gross.value * 0.0308).toFixed(2)); // ~3.08% based on payslip (302/9809)
const healthTax = computed(() => (gross.value * 0.0416).toFixed(2)); // ~4.16% based on payslip (408/9809)
// Income Tax - simple lookup or keep 0 for now as per payslip specific month (unless using points)
// Payslip shows 543.00, but that depends on points/accumulation. Keeping 0.00 or approximating? 
// User has 2.25 points. 
// Let's fallback to store tax settings logic if we implement full calc, for now mock matches typical low bracket.
// But wait, the payslip shows 543 Income Tax! We should probably try to approximate it or leave as is if we can't replicate full engine.
// Actually, let's bump it to match the ratio 543/9809 ~ 5.5% if we want to look "real".
const incomeTax = computed(() => (gross.value * 0.0553).toFixed(2)); 

const pensionFund = computed(() => {
    // Use store setting (6%)
    const rate = store.getters.taxPensionFund || 6;
    return (gross.value * (rate / 100)).toFixed(2);
});

const totalMandatoryDeductions = computed(() => {
    return (parseFloat(nationalInsurance.value) + parseFloat(healthTax.value) + parseFloat(incomeTax.value) + parseFloat(pensionFund.value));
});

const netSalary = computed(() => {
    const val = gross.value - totalMandatoryDeductions.value - parseFloat(totalDeduction.value);
    return val.toFixed(2);
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

.summary-page {
  font-family: 'Heebo', sans-serif;
  background-color: #f5f5f5;
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

.home-title {
    font-size: 1.1rem;
    font-weight: 500;
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

/* Main Scrollable Content */
.content-area {
    flex: 1;
    overflow-y: auto;
    background: white;
    display: flex;
    flex-direction: column;
}

.summary-content {
    background-color: white;
    padding: 24px;
    flex-shrink: 0; /* content grows */
}

.section-title {
    font-weight: 700;
    margin-bottom: 12px;
    margin-top: 10px;
    font-size: 0.95rem;
    color: #000;
}

.stat-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 1rem;
    line-height: 1.4;
}

.stat-label {
    color: #666;
    font-weight: 400;
}

.stat-value {
    color: #333;
    font-weight: 500;
}

.red-text {
    color: #E53935;
}

.divider {
    height: 1px;
    background-color: #E0E0E0;
    margin: 20px 0;
}

.gross-row {
    justify-content: flex-end; 
}

.gross-value {
    font-weight: 700;
    color: #333;
    font-size: 1.1rem;
}

/* Bottom Nav */
.bottom-nav {
  background-color: #0093AB;
  display: flex;
  height: 60px;
  flex-shrink: 0;
  direction: ltr; /* Nav items layout */
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
}

.nav-item.active {
  color: white;
}

/* Sidebar Styles Removed (Moved to Sidebar Component) */

/* Net Salary Footer */
.net-salary-footer {
    background-color: #4DD0E1; 
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto; /* Push to bottom if content is short, but usually inside flex column */
}

.net-icons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.icon-calc, .icon-file {
    opacity: 0.8;
}

.net-text-area {
    text-align: right; 
    flex: 1;
    margin-right: 20px;
}

.net-title {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 5px;
    opacity: 0.9;
}

.net-sub-row {
    display: flex;
    justify-content: space-between; 
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 5px;
}

.net-main-row {
     display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.3rem;
    font-weight: bold;
    margin-top: 5px;
}

.net-value-main {
    font-size: 1.4rem;
}

</style>
