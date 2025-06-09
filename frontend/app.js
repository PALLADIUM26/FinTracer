const BASE_URL = 'http://localhost:5000';  // Flask backend URL

const form = document.getElementById('transactionForm');
const tbody = document.querySelector('#transactionsTable tbody');


// Token helpers
function saveToken(token) {
    localStorage.setItem('token', token);
  }
  function getToken() {
    return localStorage.getItem('token');
  }
  function clearToken() {
    localStorage.removeItem('token');
  }
  
  // Show or hide sections based on login state
  function updateUI() {
    if (getToken()) {
      document.getElementById('transactionSection').style.display = 'block';
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('registerForm').style.display = 'none';
      loadTransactions();
    } else {
      document.getElementById('transactionSection').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
      document.getElementById('registerForm').style.display = 'block';
    }
  }
  
  // Login form
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
  
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
  
    if (res.ok) {
      saveToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      document.getElementById('loginMsg').textContent = 'Login successful!';
      updateUI();
    } else {
      document.getElementById('loginMsg').textContent = data.msg || 'Login failed.';
    }
  });
  
  // Register form
  document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
  
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
  
    if (res.ok) {
      document.getElementById('registerMsg').textContent = 'Registration successful! You can login now.';
    } else {
      document.getElementById('registerMsg').textContent = data.msg || 'Registration failed.';
    }
  });
  
  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', () => {
    clearToken();
    localStorage.removeItem("token");
    updateUI();
  });


// Load transactions when the page loads
// window.onload = loadTransactions;

// Fetch and display transactions
async function loadTransactions() {
  const token = getToken();
  try {
    const res = await fetch(`${BASE_URL}/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
    
    if (res.ok) {
    const transactions = await res.json();
    const tbody = document.querySelector('#transactionsTable tbody');

    // Clear existing rows
    tbody.innerHTML = '';

    // Render each transaction
    transactions.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.amount.toFixed(2)}</td>
        <td>${t.type}</td>
        <td>${t.category}</td>
        <td>${t.date}</td>
        <td>${t.description}</td>
        <td><button onclick="deleteTransaction(${t.id})">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });
    loadChartData();
    } else {
        console.error('Failed to fetch transactions');
    }

  } catch (error) {
    console.error('Failed to load transactions:', error);
    alert('Error loading transactions.');
  }
}

// Add a transaction
// form.addEventListener('submit', async e => {
document.getElementById('transactionForm').addEventListener('submit', async e => {
  e.preventDefault();
  const token = getToken();

  const data = {
    amount: parseFloat(document.getElementById('amount').value),
    type: document.getElementById('type').value,
    category: document.getElementById('category').value,
    date: document.getElementById('date').value,
    description: document.getElementById('description').value || ''
  };

  try {
    const res = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },      
      body: JSON.stringify(data)
    });

    if (res.ok) {
    //   form.reset();
      document.getElementById('transactionForm').reset();
      loadTransactions();
    } else {
      const err = await res.json();
      alert('Error: ' + err.error);
    }
  } catch (error) {
    console.error('Failed to add transaction:', error);
    alert('Error adding transaction.');
  }
});

// Delete a transaction
async function deleteTransaction(id) {
  if (!confirm('Are you sure you want to delete this transaction?')) return;

  try {
    const res = await fetch(`${BASE_URL}/transactions/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      loadTransactions();
    } else {
      const err = await res.json();
      alert('Error: ' + err.error);
    }
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    alert('Error deleting transaction.');
  }
}

// loadTransactions();

let typeChart;
let categoryChart;

async function loadChartData() {
  const token = getToken();

  try {
    const res = await fetch('http://localhost:5000/transactions', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
    const transactions = await res.json();
    if (!Array.isArray(transactions)) {
        console.error('Invalid transactions response:', transactions);
        return;
    }

    const selectedMonth = document.getElementById("monthFilter").value;
    const selectedCategory = document.getElementById("categoryFilter").value;

    // Group by 
    let income = 0;
    let expense = 0;
    const expenseCategories = {};

    transactions.forEach(tx => {
        const txDate = new Date(tx.date);
        const month = String(txDate.getMonth() + 1).padStart(2, '0');

        if (
            (selectedMonth && month !== selectedMonth) ||
            (selectedCategory && tx.category !== selectedCategory)
        ) return;
        
        if (tx.type === 'income') {
          income += tx.amount;
        } else if (tx.type === 'expense') {
          expense += tx.amount;
    
          const category = tx.category || 'Other';
          if (!expenseCategories[category]) {
            expenseCategories[category] = 0;
          }
          expenseCategories[category] += tx.amount;
        }
    });

    // Prepare data for Chart.js
    // const labels = Object.keys(categoryTotals);
    // const data = Object.values(categoryTotals);

    renderChart_IncExp(income, expense);
    renderChart_ExpCat(expenseCategories);

  } catch (err) {
    console.error("Failed to load chart data", err);
  }
}

function renderChart_IncExp(income, expense) {
  const ctx = document.getElementById('typeChart').getContext('2d');

  if (typeChart) {
    typeChart.destroy(); // Avoid duplicates on re-render
  }

  typeChart = new Chart(ctx, {
    type: 'pie', // You can change to 'bar' or 'doughnut'
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        label: 'Spending by Category',
        data: [income, expense],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    },
    options: {
        responsive: false,
        plugins: { legend: { position: 'bottom' }}
        // responsive: true,
    //     maintainAspectRatio: false,
    },
  });
}




function renderChart_ExpCat(expenseCategories) {
  if (categoryChart) {
    categoryChart.destroy(); // Avoid duplicates on re-render
  }
    
  const ctx = document.getElementById('categoryChart').getContext('2d');
  const labels = Object.keys(expenseCategories);
  const data = Object.values(expenseCategories);
  const colors = labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`);

  categoryChart = new Chart(ctx, {
    type: 'pie', // You can change to 'bar' or 'doughnut'
    data: {
      labels: labels,
      datasets: [{
        // label: 'Spending by Category',
        data: data,
        backgroundColor: colors
      }]
    },
    options: {
        responsive: false,
        plugins: { legend: { position: 'bottom' } }
        // responsive: true,
    //     maintainAspectRatio: false,
    },
  });
}



window.onload = function () {
    // Other functions on page load
    updateUI(); // or whatever starts your app
  
    // Add filter listeners here
    document.getElementById("monthFilter").addEventListener("change", loadChartData);
    document.getElementById("categoryFilter").addEventListener("change", loadChartData);

    document.getElementById("darkModeToggle").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
      
        // Optional: save preference
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", isDark);
      });
      
      // On page load: apply saved mode
      window.addEventListener("DOMContentLoaded", () => {
        if (localStorage.getItem("darkMode") === "true") {
          document.body.classList.add("dark-mode");
        }
      });
  };
  