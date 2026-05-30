import { analyzeMeal } from './dify.js';

// DOM Elements
const mealForm = document.getElementById('mealForm');
const mealPhotoInput = document.getElementById('mealPhoto');
const mealTextInput = document.getElementById('mealText');
const mealTypeInput = document.getElementById('mealType');
const previewContainer = document.getElementById('previewContainer');
const photoPreview = document.getElementById('photoPreview');
const removePhotoBtn = document.getElementById('removePhoto');
const resultSection = document.getElementById('resultSection');
const aiResponseBox = document.getElementById('aiResponse');
const confirmBtn = document.getElementById('confirmBtn');
const retryBtn = document.getElementById('retryBtn');

// State
let currentAnalysis = null;

// Event Listeners
mealPhotoInput.addEventListener('change', handlePhotoSelect);
mealForm.addEventListener('submit', handleAnalyze);
confirmBtn.addEventListener('click', handleConfirm);
retryBtn.addEventListener('click', () => {
    resultSection.classList.add('hidden');
    mealForm.scrollIntoView({ behavior: 'smooth' });
});

// Meal Type Selection
const mealTypeButtons = document.querySelectorAll('.meal-type-btn');
mealTypeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        mealTypeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mealTypeInput.value = type;
    });
});

// Remove Photo
if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', () => {
        mealPhotoInput.value = '';
        previewContainer.classList.add('hidden');
    });
}

// Handlers
function handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.src = e.target.result;
            previewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.classList.add('hidden');
    }
}

async function handleAnalyze(e) {
    e.preventDefault();
    const text = mealTextInput.value.trim();
    const photo = mealPhotoInput.files[0];
    const mealType = mealTypeInput.value;

    // Validation
    if (!mealType) {
        alert("食事タイプを選択してください。");
        return;
    }

    if (!text && !photo) {
        alert("食事の内容を入力するか、写真をアップロードしてください。");
        return;
    }

    // Show loading state
    const btn = document.getElementById('analyzeBtn');
    const originalBtnText = btn.innerText;
    btn.innerText = "分析中...";
    btn.disabled = true;

    resultSection.classList.remove('hidden');
    aiResponseBox.innerHTML = '<div class="loading-spinner">最強の栄養管理師AIが分析中...</div>';
    resultSection.scrollIntoView({ behavior: 'smooth' });

    try {
        currentAnalysis = await analyzeMeal(photo, text, mealType);
        currentAnalysis.mealType = mealType; // Add meal type to analysis
        renderResult(currentAnalysis);
    } catch (error) {
        console.error(error);
        aiResponseBox.innerHTML = `<div class="text-danger">エラー: ${error.message}</div>`;
    } finally {
        btn.innerText = originalBtnText;
        btn.disabled = false;
    }
}

function renderResult(data) {
    aiResponseBox.replaceChildren();

    if (data.raw_output) {
        aiResponseBox.textContent = data.raw_output;
        return;
    }

    const menu = document.createElement('strong');
    menu.textContent = data.menu ?? '';
    const meta = document.createTextNode(
        `\nCalories: ${data.calories}kcal\nP: ${data.pfc.p}g, F: ${data.pfc.f}g, C: ${data.pfc.c}g\n\n`
    );
    const advice = document.createElement('em');
    advice.textContent = data.advice ?? '';

    aiResponseBox.append(menu, meta, advice);
}

function handleConfirm() {
    if (!currentAnalysis) return;

    // Save to LocalStorage for now (simulating DB)
    const today = new Date().toISOString().split('T')[0];
    const logs = JSON.parse(localStorage.getItem('mealLogs') || '{}');
    if (!logs[today]) logs[today] = [];

    logs[today].push({
        ...currentAnalysis,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('mealLogs', JSON.stringify(logs));

    alert("食事を記録しました！💪");
    window.location.href = '/';
}
