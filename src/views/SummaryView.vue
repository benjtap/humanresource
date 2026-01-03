<template>
  <div class="summary-page">
    <!-- Header (Simple with Back button only if needed, but per request keeping Shift style color but NO hamburger) -->
    <!-- User asked to remove hamburger. Usually there is a back button. 
         If standard hierarchy, Back button is on Right (RTL) or Left? 
         In ShiftsView (RTL), Hamburger is Right (start), Back/Arrow is Left (end)?
         Let's keep the Back button (Chevron) if logical, or just Title. 
         "Garder le meme design" -> Shifts design had header. 
         I will keep the Header bar, center the title, remove the hamburger. 
    -->
    <header class="header">
      <!-- Spacer to balance the back button if we want title centered, or just empty -->
      <div class="header-spacer"></div>
      
      <div class="header-title-area">
          <span>סיכום חודשי</span>
      </div>

      <button class="icon-btn" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </header>

    <!-- Sub Header: Month Display -->
    <div class="month-header">
       {{ formattedMonth }}
    </div>

    <!-- Content -->
    <div class="summary-content">
       
       <!-- Section 1: Days / Hours -->
       <div class="section-title">ימים / שעות:</div>
       <div class="stat-row">
          <span class="stat-label">סה"כ ימים:</span>
          <span class="stat-value">{{ totalDays }} ימים</span>
       </div>
       <div class="stat-row">
          <span class="stat-label">סה"כ שעות:</span>
          <span class="stat-value">{{ totalHoursFormatted }} שעות</span> <!-- Simplified format -->
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

    <!-- Net Salary Footer (Blue Area) -->
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

    <!-- Bottom Navigation (Matching ShiftsView style) -->
    <nav class="bottom-nav">
       <button class="nav-item" @click="goBack">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
         <span>משמרות</span>
       </button>
        <button class="nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          <span>פירוט שכר</span>
        </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Mock Data
import { mockData } from '../services/mockData';

const router = useRouter();
const route = useRoute();

const currentMonth = ref('');
const shifts = ref([]);

onMounted(() => {
    // Get month from query, e.g. ?date=2026-01-03
    const dateStr = route.query.date;
    let d = new Date();
    if (dateStr) {
        d = new Date(dateStr);
    }
    
    // Set formatted month header
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const y = d.getFullYear();
    currentMonth.value = `${m}/${y}`;
    
    // Load Data
    const key = `${y}-${m}`;
    shifts.value = mockData[key] || [];
});

const formattedMonth = computed(() => currentMonth.value);

// Computers
const totalDays = computed(() => shifts.value.length);

const totalHoursFormatted = computed(() => {
    let totalMins = 0;
    shifts.value.forEach(s => {
        if (!s.hours) return;
        const [h, m] = s.hours.split(':').map(Number);
        totalMins += (h * 60) + m;
    });
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h} שעות ${m} דקות`; // Format like "36 hours 25 minutes"
});

const vacationDays = computed(() => shifts.value.filter(s => s.type && s.type.includes('חופש')).length);
const sickDays = computed(() => shifts.value.filter(s => s.type && s.type.includes('מחלה')).length);
const holidayDays = computed(() => shifts.value.filter(s => s.type && s.type.includes('חג')).length);
const recuperationDays = computed(() => shifts.value.filter(s => s.type && s.type.includes('הבראה')).length);

const totalExtra = computed(() => shifts.value.reduce((acc, s) => acc + (parseFloat(s.extra) || 0), 0).toFixed(2));
const totalDeduction = computed(() => shifts.value.reduce((acc, s) => acc + (parseFloat(s.deduction) || 0), 0).toFixed(2));

const totalSalary = computed(() => shifts.value.reduce((acc, s) => acc + (parseFloat(s.salary) || 0), 0).toFixed(2));

// Mandatory Deductions Calculation (Approximation)
const gross = computed(() => parseFloat(totalSalary.value));

const nationalInsurance = computed(() => (gross.value * 0.004).toFixed(2)); // ~0.4% Mock
const healthTax = computed(() => (gross.value * 0.031).toFixed(2)); // ~3.1% Mock
const incomeTax = computed(() => (0.00).toFixed(2)); // Usually 0 for low outcome
const pensionFund = computed(() => (gross.value * 0.06).toFixed(2)); // 6%

const totalMandatoryDeductions = computed(() => {
    return (parseFloat(nationalInsurance.value) + parseFloat(healthTax.value) + parseFloat(incomeTax.value) + parseFloat(pensionFund.value));
});

const netSalary = computed(() => {
    const val = gross.value - totalMandatoryDeductions.value - parseFloat(totalDeduction.value);
    return val.toFixed(2);
});

const goBack = () => router.back();

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');

.summary-page {
  font-family: 'Heebo', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #333;
  direction: rtl;
}

.header {
  background-color: #0093AB;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-spacer {
    width: 24px; /* To balance the back icon size approx */
}

.header-title-area {
    font-size: 1.2rem;
    font-weight: bold;
}

.icon-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.month-header {
    background-color: #4DD0E1; 
    color: white;
    text-align: center;
    padding: 10px;
    font-weight: 700;
    font-size: 1.2rem;
    letter-spacing: 1px;
}

.summary-content {
    flex: 1;
    background-color: white;
    padding: 24px;
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
    color: #666; /* Gray labels */
    font-weight: 400;
}

.stat-value {
    color: #333; /* Darker values */
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
  height: 60px;
  background-color: white;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #999;
  font-family: inherit;
  font-size: 0.8rem;
}

.nav-item.active {
  color: #0093AB;
}

/* Net Salary Footer */
.net-salary-footer {
    background-color: #4DD0E1; /* Cyan/Teal like Image */
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    text-align: left; /* Align text to left side relative to container (RTL flip -> actually right?) Image has text on right side? No, "Net Salary" title is on Right in Hebrew. Content aligns. */
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
    justify-content: space-between; /* Label .... Value */
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
