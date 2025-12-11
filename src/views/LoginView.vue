<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isSmsLogin = ref(true);

const toggleTab = (sms) => {
  isSmsLogin.value = sms;
};

const handleLogin = () => {
    // Simulate login and redirect to dashboard
    router.push('/dashboard');
};
</script>

<template>
  <div class="login-wrapper">
      <div class="login-container">
        <div class="login-card">
            <div class="logo-container">
                <i class="fas fa-user-circle fa-3x" style="color: #ccc;"></i>
            </div>
            
            <div class="login-tabs">
                <button class="tab-btn" :class="{ active: isSmsLogin }" @click="toggleTab(true)">SMS</button>
                <div class="tab-divider"></div>
                <button class="tab-btn" :class="{ active: !isSmsLogin }" @click="toggleTab(false)">סיסמא</button>
            </div>

            <!-- SMS Login Form -->
            <form v-if="isSmsLogin" @submit.prevent="handleLogin" class="login-form">
                <div class="input-group">
                    <input type="text" placeholder="מספר זהות" required>
                </div>
                <div class="input-group">
                     <input type="tel" placeholder="טלפון נייד" required>
                </div>
                <button type="submit" class="submit-btn">כניסה</button>
            </form>

            <!-- Password Login Form -->
            <form v-else @submit.prevent="handleLogin" class="login-form">
                <div class="input-group">
                    <input type="text" placeholder="מספר זהות" required>
                </div>
                <div class="input-group">
                    <input type="password" placeholder="סיסמא" required>
                    <i class="fas fa-lock input-icon"></i>
                </div>
                
                <div class="form-footer">
                    <a href="#" class="forgot-password">שכחתי/ איני יודע את הסיסמא</a>
                </div>

                <button type="submit" class="submit-btn">כניסה</button>
            </form>
            
            <div class="external-links">
                <a href="#">סרטון הדרכה לכניסה למערכת</a>
                <br>
                <a href="#">קובץ הדרכה לכניסה למערכת</a>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #eef2f5;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    direction: rtl;
}

.login-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
}

.login-card {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
    padding: 40px 30px;
    text-align: center;
}

.logo-container {
    margin-bottom: 30px;
}

.login-tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.tab-btn {
    background: none;
    border: none;
    font-size: 1.1rem;
    color: #888;
    cursor: pointer;
    padding: 10px 20px;
    font-weight: 600;
    font-family: inherit;
    position: relative;
    transition: color 0.3s;
}

.tab-btn.active {
    color: #3498db;
}

.tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -11px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #3498db;
}

.tab-divider {
    width: 1px;
    height: 20px;
    background-color: #ddd;
    margin: 0 10px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.input-group {
    position: relative;
}

.input-group input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    font-family: inherit;
}

.input-group input:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.input-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #ccc;
}

.submit-btn {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 10px;
    font-family: inherit;
}

.submit-btn:hover {
    background-color: #2980b9;
}

.form-footer {
    text-align: right;
    margin-top: -10px;
    margin-bottom: 10px;
}

.forgot-password {
    color: #3498db;
    font-size: 0.9rem;
    text-decoration: none;
}

.external-links {
    margin-top: 30px;
    font-size: 0.9rem;
}

.external-links a {
    color: #555;
    text-decoration: none;
    display: inline-block;
    margin-bottom: 5px;
}
</style>
