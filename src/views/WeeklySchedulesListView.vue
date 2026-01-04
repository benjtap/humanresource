<template>
  <div class="weekly-list-page">
    
    <!-- Header -->
    <header class="header">
      <div class="header-spacer"></div>
      <div class="header-title-area">
          <span>רשימת סידורי עבודה</span>
      </div>
      <button class="icon-btn" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </header>

    <!-- Content -->
    <div class="list-container">
        <div class="empty-state" v-if="plans.length === 0">
            <span>אין סידורי עבודה להצגה</span>
        </div>

        <div v-else class="plans-list">
             <div v-for="(plan, index) in plans" :key="plan.id" class="plan-card" @click="openPlan(plan.id)">
                 <div class="plan-info">
                     <div class="plan-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0093AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                     </div>
                     <div class="plan-dates">
                         <span class="week-label">{{ plan.label }}</span>
                     </div>
                 </div>
                 
                 <div class="plan-actions">
                     <button class="delete-btn" @click.stop="deletePlan(index)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                     </button>
                     <div class="plan-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                     </div>
                 </div>
             </div>
        </div>
    </div>

    <!-- FAB Add Button -->
    <button class="fab-add" @click="createNewPlan">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </button>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { mockWeeklyPlans } from '../services/mockWeeklyPlans';

const router = useRouter();
const plans = computed(() => mockWeeklyPlans);

const goBack = () => router.push({ name: 'shifts' });

const openPlan = (id) => {
    router.push({ name: 'weekly-plan', query: { id: id } });
};

const createNewPlan = () => {
    router.push({ name: 'weekly-plan', query: { mode: 'new' } });
};

const deletePlan = (index) => {
    if (confirm('האם אתה בטוח שברצונך למחוק סידור עבודה זה?')) {
        mockWeeklyPlans.splice(index, 1);
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

.header-spacer { width: 24px; }

.header-title-area {
    font-size: 1.2rem;
    font-weight: bold;
}

.icon-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.list-container {
    padding: 20px;
    flex: 1;
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

/* Actions */
.plan-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #e57373; /* Soft Red */
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.delete-btn:hover {
    background-color: #ffebee;
}

.plan-arrow {
    display: flex;
    align-items: center;
}

.fab-add {
    position: fixed;
    bottom: 30px;
    left: 30px; /* FAB Left for RTL */
    width: 56px;
    height: 56px;
    background-color: #E91E63; /* Pink */
    color: white;
    border-radius: 50%;
    border: none;
    box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 100;
}

.empty-state {
    text-align: center;
    color: #999;
    margin-top: 50px;
}
</style>
