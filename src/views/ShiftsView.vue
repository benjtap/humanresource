<template>
  <div class="shifts-page">
    <!-- Header -->
    <header class="header">
      <button class="icon-btn" @click="isMenuOpen = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      <div class="spacer"></div>
      <button class="icon-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      </button>
    </header>

    <!-- Month Selector -->
    <div class="month-selector">
      <span class="month-side">mber 2025</span>
      <span class="current-month">December 2025</span>
      <span class="month-side">January 2</span>
    </div>

    <!-- Table Header -->
    <div class="table-header">
      <div>תאריך</div>
      <div>כניסה</div>
      <div>יציאה</div>
      <div>שעות</div>
      <div>שכר</div>
    </div>

    <!-- Main Content (Empty State) -->
    <main class="content-area">
      <div class="empty-state">
        <div class="hand-icon-wrapper">
           <svg class="hand-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
             <!-- Left Arrow -->
             <path d="M30 40 L20 50 L30 60" stroke="#00C853" stroke-width="3" stroke-linecap="round"/>
             <!-- Right Arrow -->
             <path d="M70 40 L80 50 L70 60" stroke="#00C853" stroke-width="3" stroke-linecap="round"/>
             <!-- Hand -->
             <path d="M50 80 C50 80 45 70 45 60 L45 35 C45 32 47 30 50 30 C53 30 55 32 55 35 L55 55 L58 55 C60 55 62 57 62 60 L60 80" stroke="#9E9E9E" stroke-width="3" fill="none" stroke-linecap="round"/>
             <!-- Simplified Finger visual -->
             <path d="M40 55 Q 40 45 45 35" stroke="#9E9E9E" stroke-width="2" fill="none"/> 
           </svg>
        </div>
        <p class="empty-text title">אין משמרות</p>
        <p class="empty-text subtitle">לתקופה שנבחרה</p>
      </div>
    </main>

    <!-- Floating Action Button -->
    <button class="fab">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </button>

    <!-- Footer Summary -->
    <div class="footer-summary">
      <div class="summary-item">
        <span class="label">שעות:</span>
        <span class="value">0:00</span>
      </div>
      <div class="summary-item">
        <span class="label">סה"כ:</span>
        <span class="value">0.00</span>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
       <button class="nav-item active">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
         <span>משמרות</span>
       </button>
       <button class="nav-item">
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
import { ref } from 'vue';

const isMenuOpen = ref(false);
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
  justify-content: center;
  align-items: center;
  position: relative;
}

.empty-state {
  text-align: center;
  color: #757575;
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
  z-index: 10;
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

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: white;
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
</style>
