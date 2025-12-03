// Config
const API_URL = 'http://localhost:5000/api';
const APP_START_DATE = new Date(2025, 10, 9); // November 9, 2025 (month is 0-indexed)

// State
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
let selectedDate = null;
let habitData = {}; // Will store data from backend

// DOM elements
const calendarEl = document.getElementById('calendar');
const modalEl = document.getElementById('modal');
const modalDateEl = document.getElementById('modal-date');
const currentMonthEl = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const closeModalBtn = document.getElementById('close-modal');
const saveBtnEl = document.getElementById('save-btn');
const alcoholSelect = document.getElementById('alcohol-level');
const notesTextarea = document.getElementById('notes');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadHabitData();
    renderCalendar();
    setupEventListeners();
});

// Render calendar for current month
function renderCalendar() {
    const year = currentYear;
    const month = currentMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Update month header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthEl.textContent = `${monthNames[month]} ${year}`;

    // Enable/disable navigation buttons
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    nextMonthBtn.disabled = isCurrentMonth;

    // Disable prev button if we're at the app start month
    const appStartYear = APP_START_DATE.getFullYear();
    const appStartMonth = APP_START_DATE.getMonth();
    const isStartMonth = year === appStartYear && month === appStartMonth;
    prevMonthBtn.disabled = isStartMonth;

    // Clear calendar
    calendarEl.innerHTML = '';

    // Create day rows

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = habitData[dateStr] || null;

        const dayRow = document.createElement('div');
        dayRow.className = 'day-row';
        dayRow.dataset.date = dateStr;

        // Check if this day is in the future or before app start
        const date = new Date(year, month, day);
        const isFuture = date > today;
        const isBeforeStart = date < APP_START_DATE;
        const isToday = date.getTime() === today.getTime();

        if (isFuture || isBeforeStart) {
            dayRow.classList.add('future');
        }

        if (isToday) {
            dayRow.classList.add('today');
        }

        // Add weekend classes
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0) {
            dayRow.classList.add('sun');
        } else if (dayOfWeek === 6) {
            dayRow.classList.add('sat');
        }

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;

        const indicators = document.createElement('div');
        indicators.className = 'day-indicators';

        if (dayData) {
            // Apply background color for no drinks
            if (dayData.alcohol === 0) {
                dayRow.classList.add('no-drinks');
            }

            if (dayData.exercise === true) {
                const exerciseIcon = document.createElement('span');
                exerciseIcon.className = 'indicator';
                exerciseIcon.textContent = '💪';
                indicators.appendChild(exerciseIcon);
            }

            if (dayData.drugs === true) {
                const drugsIcon = document.createElement('span');
                drugsIcon.className = 'indicator';
                drugsIcon.textContent = '💊';
                indicators.appendChild(drugsIcon);
            }

            // Show notes indicator if notes exist
            if (dayData.notes && dayData.notes.trim() !== '') {
                const notesIcon = document.createElement('span');
                notesIcon.className = 'indicator';
                notesIcon.textContent = '📝';
                indicators.appendChild(notesIcon);
            }

            // Show alcohol level as text
            if (dayData.alcohol !== undefined) {
                const alcoholLabels = ['No drinks', 'Few drinks', 'Tipsy', 'Drunk', 'Hammered', 'Black out'];
                const alcoholText = document.createElement('span');
                alcoholText.className = 'indicator alcohol-text';
                alcoholText.textContent = alcoholLabels[dayData.alcohol];
                indicators.appendChild(alcoholText);
            }
        }

        dayRow.appendChild(dayNumber);
        dayRow.appendChild(indicators);
        calendarEl.appendChild(dayRow);

        // Add click handler (only for valid days)
        if (!isFuture && !isBeforeStart) {
            dayRow.addEventListener('click', () => openModal(dateStr, dayData));
        }
    }
}

// Open modal for a specific date
function openModal(dateStr, existingData) {
    selectedDate = dateStr;

    // Format date for display
    const date = new Date(dateStr + 'T12:00:00');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    modalDateEl.textContent = date.toLocaleDateString('en-US', options);

    // Populate form with existing data or defaults
    if (existingData) {
        alcoholSelect.value = existingData.alcohol || 0;
        setToggleState('exercise', existingData.exercise || false);
        setToggleState('drugs', existingData.drugs || false);
        notesTextarea.value = existingData.notes || '';
    } else {
        // Reset to defaults
        alcoholSelect.value = 0;
        setToggleState('exercise', false);
        setToggleState('drugs', false);
        notesTextarea.value = '';
    }

    modalEl.classList.remove('hidden');
}

// Close modal
function closeModal() {
    modalEl.classList.add('hidden');
    selectedDate = null;
}

// Set toggle button state
function setToggleState(inputName, value) {
    const buttons = document.querySelectorAll(`[data-input="${inputName}"]`);
    buttons.forEach(btn => {
        const btnValue = btn.dataset.value === 'true';
        if (btnValue === value) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Get toggle button value
function getToggleValue(inputName) {
    const activeBtn = document.querySelector(`[data-input="${inputName}"].active`);
    return activeBtn ? activeBtn.dataset.value === 'true' : false;
}

// Load habit data from backend
async function loadHabitData() {
    try {
        const response = await fetch(`${API_URL}/habits`);
        if (response.ok) {
            habitData = await response.json();
        }
    } catch (error) {
        console.error('Error loading habit data:', error);
    }
}

// Save habit data
async function saveHabitData() {
    const data = {
        date: selectedDate,
        alcohol: parseInt(alcoholSelect.value),
        exercise: getToggleValue('exercise'),
        drugs: getToggleValue('drugs'),
        notes: notesTextarea.value.trim()
    };

    try {
        const response = await fetch(`${API_URL}/habits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Update local state
            habitData[selectedDate] = data;

            // Re-render calendar and close modal
            renderCalendar();
            closeModal();
        } else {
            console.error('Error saving habit data');
        }
    } catch (error) {
        console.error('Error saving habit data:', error);
    }
}

// Event listeners
function setupEventListeners() {
    // Month navigation
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // Modal controls
    closeModalBtn.addEventListener('click', closeModal);
    saveBtnEl.addEventListener('click', saveHabitData);

    // Close modal when clicking outside
    modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) {
            closeModal();
        }
    });

    // Toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const inputName = btn.dataset.input;
            const value = btn.dataset.value === 'true';
            setToggleState(inputName, value);
        });
    });
}
