<script setup>
// No script logic needed for this static dashboard, but setup is good practice
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="container">
        <header>
            <div class="header-content">
                <h1><i class="fas fa-user-tie"></i> Portail Employé Hargal</h1>
                <nav class="nav-menu">
                    <router-link to="/dashboard"><i class="fas fa-home"></i> Accueil</router-link>
                    <a href="#"><i class="fas fa-file-invoice-dollar"></i> Fiches de Paie</a>
                    <a href="#"><i class="fas fa-user-circle"></i> Profil</a>
                    <router-link to="/"><i class="fas fa-sign-out-alt"></i> Déconnexion</router-link>
                </nav>
            </div>
        </header>
        <main>
            <div class="dashboard-welcome">
                <h2>Bienvenue, <span>Jean Dupont</span> !</h2>
                <p>Gérez vos informations personnelles et accédez à vos documents depuis votre espace employé.</p>
            </div>

            <div class="dashboard-cards">
                <a href="#" class="card">
                    <div class="card-icon"><i class="fas fa-file-invoice-dollar"></i></div>
                    <h3>Mes Fiches de Paie</h3>
                    <p>Consultez et téléchargez vos fiches de paie mensuelles.</p>
                </a>
                <a href="#" class="card">
                    <div class="card-icon"><i class="fas fa-user-edit"></i></div>
                    <h3>Mon Profil</h3>
                    <p>Mettez à jour vos coordonnées et informations bancaires.</p>
                </a>
                <div class="card">
                    <div class="card-icon"><i class="fas fa-calendar-alt"></i></div>
                    <h3>Mes Congés</h3>
                    <p>Suivez vos soldes de congés et posez vos jours de repos.</p>
                </div>
                <div class="card">
                    <div class="card-icon"><i class="fas fa-book"></i></div>
                    <h3>Documents Internes</h3>
                    <p>Accédez au guide de l'employé et aux politiques de l'entreprise.</p>
                </div>
            </div>
            
            <h2>Mes Fiches de Paie</h2>
            <table>
                <thead>
                    <tr>
                        <th>Mois / Année</th>
                        <th>Salaire Brut</th>
                        <th>Salaire Net</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2024-03</td>
                        <td>2600.00 €</td>
                        <td>2190.00 €</td>
                        <td><a href="#" class="btn-download">Télécharger PDF</a></td>
                    </tr>
                    <tr>
                        <td>2024-02</td>
                        <td>2550.00 €</td>
                        <td>2145.75 €</td>
                        <td><a href="#" class="btn-download">Télécharger PDF</a></td>
                    </tr>
                    <tr>
                        <td>2024-01</td>
                        <td>2500.00 €</td>
                        <td>2100.50 €</td>
                        <td><a href="#" class="btn-download">Télécharger PDF</a></td>
                    </tr>
                </tbody>
            </table>
        </main>
        <footer>
            <p>&copy; 2024 H&O Fashion. Tous droits réservés.</p>
        </footer>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles from main.css */
:root {
    --primary-color: #0A2F51;
    --secondary-color: #E67E22;
    --background-color: #F8F9FA;
    --card-background: #FFFFFF;
    --text-color: #333333;
    --text-light: #6C757D;
    --border-color: #DEE2E6;
    --shadow-light: 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.12);
    --font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}

.dashboard-wrapper {
    font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    background-color: #F8F9FA;
    min-height: 100vh;
    color: #333333;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
header {
    background-color: #0A2F51;
    color: #fff;
    padding: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

header h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    padding: 1rem 0;
}

header h1 i {
    margin-right: 10px;
    color: #E67E22;
}

.nav-menu a {
    color: #fff;
    text-decoration: none;
    margin: 0 15px;
    font-weight: 500;
    padding: 1rem 0;
    display: inline-block;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: #E67E22;
}

.nav-menu a i {
    margin-right: 5px;
}

/* Main */
main {
    padding: 2rem 0;
}

.dashboard-welcome {
    text-align: center;
    margin-bottom: 50px;
}

.dashboard-welcome h2 {
    font-size: 2.2rem;
    font-weight: 300;
    color: #0A2F51;
}

.dashboard-welcome h2 span {
    font-weight: 600;
}

.dashboard-welcome p {
    font-size: 1.1rem;
    color: #6C757D;
    max-width: 600px;
    margin: 10px auto 0;
}

.dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-bottom: 50px;
}

.card {
    background: #FFFFFF;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-decoration: none;
    color: #333333;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: block;
    text-align: center;
}

.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-icon {
    font-size: 3rem;
    color: #E67E22;
    margin-bottom: 20px;
}

.card h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.4rem;
    color: #0A2F51;
    font-weight: 600;
}

.card p {
    font-size: 1rem;
    color: #6C757D;
    line-height: 1.5;
}

/* Table */
h2 {
    color: #0A2F51;
    font-weight: 600;
    margin-bottom: 25px;
}

table {
    width: 100%;
    border-collapse: collapse;
    background: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 50px;
}

th, td {
    padding: 18px 20px;
    text-align: left;
    border-bottom: 1px solid #DEE2E6;
}

thead {
    background-color: #0A2F51;
    color: #fff;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
}

tbody tr:last-child td {
    border-bottom: none;
}

tbody tr:nth-child(even) {
    background-color: #fdfdfd;
}

.btn-download {
    display: inline-block;
    padding: 8px 16px;
    background: #E67E22;
    color: #fff;
    text-decoration: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background-color 0.3s;
}

.btn-download:hover {
    background: #d35400;
}

footer {
    text-align: center;
    margin-top: 40px;
    padding: 20px;
    font-size: 0.9em;
    color: #6C757D;
    border-top: 1px solid #DEE2E6;
}
</style>
