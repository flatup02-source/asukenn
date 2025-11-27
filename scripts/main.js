// Main Dashboard Logic

// Constants
const CALORIE_GOAL = 2200; // Example goal

// DOM Elements
const calCurrentEl = document.getElementById('calCurrent');
const calGoalEl = document.getElementById('calGoal');
const calFillEl = document.getElementById('calFill');
const valPEl = document.getElementById('valP');
const valFEl = document.getElementById('valF');
const valCEl = document.getElementById('valC');
const mealListEl = document.getElementById('mealList');
const heroMessageEl = document.getElementById('heroMessage');

// Meal Type Filter
let currentMealType = 'all';

// Hero Messages
const MOTIVATIONAL_QUOTES = [
    "筋肉はキッチンで作られる！今日も栄養目標を達成しよう！",
    "あなたは食べたものでできている。強く、健康に！",
    "毎食が体を育てるチャンス。",
    "継続が鍵。記録を続けて、成長し続けよう！",
    "願うだけじゃなく、行動しよう。この食事から始めよう。"
];

// Meal Type Labels
const MEAL_TYPE_LABELS = {
    breakfast: "🌅 朝食",
    lunch: "☀️ 昼食",
    dinner: "🌙 夕食",
    snack: "🍪 間食",
    all: "すべて"
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    setHeroMessage();
    setupMealTypeTabs();
});

function setHeroMessage() {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    if (heroMessageEl) {
        heroMessageEl.textContent = `"${MOTIVATIONAL_QUOTES[randomIndex]}"`;
    }
}

function loadDashboardData() {
    const today = new Date().toISOString().split('T')[0];
    const logs = JSON.parse(localStorage.getItem('mealLogs') || '{}');
    const todaysLogs = logs[today] || [];

    // Calculate Totals (filtered by meal type if needed)
    let filteredLogs = todaysLogs;
    if (currentMealType !== 'all') {
        filteredLogs = todaysLogs.filter(log => log.mealType === currentMealType);
    }

    let totalCal = 0;
    let totalP = 0;
    let totalF = 0;
    let totalC = 0;

    filteredLogs.forEach(log => {
        totalCal += log.calories || 0;
        totalP += log.pfc?.p || 0;
        totalF += log.pfc?.f || 0;
        totalC += log.pfc?.c || 0;
    });

    // Update UI
    updateSummaryCard(totalCal, totalP, totalF, totalC);
    renderMealList(todaysLogs);
}

function updateSummaryCard(cal, p, f, c) {
    if (calCurrentEl) calCurrentEl.textContent = cal;
    if (calGoalEl) calGoalEl.textContent = CALORIE_GOAL;

    // Progress Bar
    const percentage = Math.min((cal / CALORIE_GOAL) * 100, 100);
    if (calFillEl) calFillEl.style.width = `${percentage}%`;

    if (valPEl) valPEl.textContent = `${p}g`;
    if (valFEl) valFEl.textContent = `${f}g`;
    if (valCEl) valCEl.textContent = `${c}g`;
}

function setupMealTypeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update filter
            currentMealType = btn.dataset.mealType;
            loadDashboardData();
        });
    });
}

function renderMealList(logs) {
    if (!mealListEl) return;

    // Filter by meal type
    let filteredLogs = logs;
    if (currentMealType !== 'all') {
        filteredLogs = logs.filter(log => log.mealType === currentMealType);
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    mealListEl.innerHTML = '';

    if (filteredLogs.length === 0) {
        const emptyMessage = currentMealType === 'all' 
            ? 'まだ食事が記録されていません。記録を始めましょう！'
            : `${MEAL_TYPE_LABELS[currentMealType]}の記録がありません。`;
        mealListEl.innerHTML = `<li class="empty-state text-muted text-center">${emptyMessage}</li>`;
        return;
    }

    filteredLogs.forEach(log => {
        const li = document.createElement('li');
        li.className = 'meal-item';
        const pfc = log.pfc || { p: 0, f: 0, c: 0 };
        const mealTypeLabel = MEAL_TYPE_LABELS[log.mealType] || '';
        li.innerHTML = `
      <div class="meal-info">
        <div class="meal-header">
          <span class="meal-type-badge">${mealTypeLabel}</span>
          <h4>${log.menu || '食事'}</h4>
        </div>
        <div class="meal-meta">${log.calories || 0} kcal (P:${pfc.p}g F:${pfc.f}g C:${pfc.c}g)</div>
      </div>
      <div class="meal-time text-muted text-sm">
        ${new Date(log.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
      </div>
    `;
        mealListEl.appendChild(li);
    });
}
