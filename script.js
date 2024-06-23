document.addEventListener('DOMContentLoaded', () => {
    // Initially navigate to exerciseSection
    navigateTo('exerciseSection'); // Navigate to exerciseSection when the page initially loads
    loadUserProfile();

    // Set button click events
    document.getElementById('exerciseBtn').addEventListener('click', () => navigateTo('exerciseSection')); // Click exerciseBtn to navigate to exerciseSection
    document.getElementById('statsBtn').addEventListener('click', showHistoryLog); // Click statsBtn to display history log
    document.getElementById('profileBtn').addEventListener('click', () => navigateTo('profileSection')); // Click profileBtn to navigate to profileSection
    document.getElementById('cardioBtn').addEventListener('click', () => navigateTo('exerciseSection')); // Click cardioBtn to navigate to exerciseSection
    document.getElementById('strengthBtn').addEventListener('click', () => showWorkoutType('Strength')); // Click strengthBtn to display Strength type

    // Listen for changes in user information
    document.getElementById('userName').addEventListener('change', saveUserProfile); // Save user information when userName changes
    document.getElementById('userWeight').addEventListener('change', saveUserProfile); // Save user information when userWeight changes
    document.getElementById('userHeight').addEventListener('change', saveUserProfile); // Save user information when userHeight changes
    document.getElementById('userWeight').addEventListener('input', calculateBMI); // Calculate BMI when userWeight input changes
    document.getElementById('userHeight').addEventListener('input', calculateBMI); // Calculate BMI when userHeight input changes

    // Add event listener to track specific exercise history
    document.getElementById('treadmillBtn').addEventListener('click', () => showExerciseHistory('Treadmill'));
});

/**
 * Function to navigate to a specific section by ID
 * @param {string} sectionId - The ID of the section to navigate to
 */
function navigateTo(sectionId) {
    // Hide all sections and remove active class
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active'); // Remove active class
        section.style.display = 'none'; // Hide section
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active'); // Add active class
        targetSection.style.display = 'block'; // Show target section
    } else {
        console.error(`Section with ID ${sectionId} not found.`);
    }
}

/**
 * Function to show workout type options (Cardio or Strength)
 * @param {string} type - The workout type ('Cardio' or 'Strength')
 */
function showWorkoutType(type) {
    if (type === 'Cardio') {
        document.getElementById('cardioOptions').style.display = 'block'; // Display Cardio options
        navigateTo('exerciseSection');
    } else if (type === 'Strength') {
        navigateTo('strengthSection');
    }

    document.getElementById('cardioBtn').classList.toggle('active', type === 'Cardio'); // Toggle Cardio button active state
    document.getElementById('strengthBtn').classList.toggle('active', type === 'Strength'); // Toggle Strength button active state
}

/**
 * Function to show the history of a specific exercise type
 * @param {string} exerciseName - The name of the exercise type to track (e.g., 'Treadmill')
 */
function showExerciseHistory(exerciseName) {
    // Retrieve all Cardio and Strength logs
    const cardioLogs = JSON.parse(localStorage.getItem('cardioLogs')) || [];
    const strengthLogs = JSON.parse(localStorage.getItem('strengthLogs')) || [];
    const exerciseLogs = [...cardioLogs, ...strengthLogs];

    // Filter logs for the specific exercise type
    const filteredLogs = exerciseLogs.filter(log => log.exerciseName === exerciseName);
    const logList = document.getElementById('exerciseHistoryList');

    // Generate HTML for the filtered logs
    logList.innerHTML = filteredLogs.map((log, index) => `
        <li>
            <strong>${log.exerciseName}</strong> - ${log.logDate}
            <p>Details: ${log.startTime ? `Start: ${log.startTime}, End: ${log.endTime}, Heart Rate: ${log.heartRate} bpm, Respiration: ${log.respirationRate}` : `${log.description}, Reps: ${log.repetitions}, Weight: ${log.weight} kg, Sets: ${log.sets}, Status: ${log.status}`}</p>
        </li>
    `).join('');

    // Display the history section
    navigateTo('exerciseHistorySection');
}

/**
 * Function to log details of a Cardio workout
 * @param {string} exerciseName - The name of the Cardio exercise
 */
function logCardio(exerciseName) {
    document.getElementById('cardioDetailTitle').innerText = `Log ${exerciseName} Workout`; // Set form title
    document.getElementById('cardioForm').dataset.exerciseName = exerciseName; // Set form data
    document.getElementById('cardioForm').dataset.logDate = new Date().toISOString().split('T')[0]; // Set log date
    navigateTo('cardioDetailSection');
}

/**
 * Function to save Cardio workout details
 */
function saveCardioWorkout() {
    const exerciseName = document.getElementById('cardioForm').dataset.exerciseName;
    const logDate = document.getElementById('cardioForm').dataset.logDate;
    const startTime = document.getElementById('cardioStartTime').value;
    const endTime = document.getElementById('cardioEndTime').value;
    const heartRate = document.getElementById('cardioHeartRate').value;
    const respirationRate = document.getElementById('cardioRespirationRate').value;

    // Calculate duration
    const duration = calculateDuration(startTime, endTime);

    const cardioWorkout = {
        exerciseName,
        logDate,
        startTime,
        endTime,
        heartRate,
        respirationRate,
        duration, 
        type: 'Cardio', 
        date: new Date().toLocaleDateString()
    };

    let logs = JSON.parse(localStorage.getItem('cardioLogs')) || [];
    logs.push(cardioWorkout);
    localStorage.setItem('cardioLogs', JSON.stringify(logs));
    alert('Cardio workout saved successfully!');
    navigateTo('exerciseSection');
}

/**
 * Function to save Strength workout details
 */
function saveStrengthWorkout() {
    const exerciseName = document.getElementById('strengthExerciseName').value;
    const logDate = new Date().toISOString().split('T')[0];
    const description = document.getElementById('strengthDescription').value;
    const repetitions = document.getElementById('strengthRepetitions').value;
    const weight = document.getElementById('strengthWeight').value;
    const sets = document.getElementById('strengthSets').value;
    const status = document.getElementById('strengthStatus').value;

    const strengthWorkout = {
        exerciseName,
        logDate,
        description,
        repetitions,
        weight,
        sets,
        status,
        type: 'Strength', 
        date: new Date().toLocaleDateString()
    };

    let logs = JSON.parse(localStorage.getItem('strengthLogs')) || [];
    logs.push(strengthWorkout);
    localStorage.setItem('strengthLogs', JSON.stringify(logs));
    alert('Strength workout saved successfully!');
    navigateTo('exerciseSection');
}

/**
 * Function to display the history of logged workouts
 */
function showHistoryLog() {
    const cardioLogs = JSON.parse(localStorage.getItem('cardioLogs')) || [];
    const strengthLogs = JSON.parse(localStorage.getItem('strengthLogs')) || [];
    const logList = document.getElementById('logList');

    if (!logList) {
        console.error('logList element not found.');
        return;
    }

    // Clear logList to prevent duplicate entries
    logList.innerHTML = '';

    // Render Cardio logs
    cardioLogs.forEach((log, index) => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <strong class="clickable" onclick="showLogsByAttribute('exerciseName', '${log.exerciseName}')">${log.exerciseName}</strong> 
            - <span class="clickable" onclick="showLogsByAttribute('logDate', '${log.logDate}')">${log.logDate}</span>
            <p>Start: ${log.startTime}, End: ${log.endTime}</p>
            <p>Heart Rate: ${log.heartRate} bpm, Respiration: ${log.respirationRate}</p>
            <button onclick="deleteCardioLog(${index})">x</button>
            <div class="tag ${log.type.toLowerCase()}" onclick="showLogsByAttribute('type', '${log.type}')">${log.type}</div>
        `;
        logList.appendChild(logItem);
    });

  

    strengthLogs.forEach((log, index) => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <strong class="clickable" onclick="showLogsByAttribute('exerciseName', '${log.exerciseName}')">${log.exerciseName}</strong> 
            - <span class="clickable" onclick="showLogsByAttribute('logDate', '${log.logDate}')">${log.logDate}</span>
            <p>${log.description}</p>
            <p>Reps: ${log.repetitions}, Weight: ${log.weight} kg, Sets: ${log.sets}, Status: ${log.status}</p>
            <button onclick="deleteStrengthLog(${index})">x</button>
            <div class="tag ${log.type.toLowerCase()}" onclick="showLogsByAttribute('type', '${log.type}')">${log.type}</div>
        `;
        logList.appendChild(logItem);
    });

    navigateTo('statsSection');
}

/**
 * Function to calculate duration between two time values
 * @param {string} startTime - The start time in HH:MM format
 * @param {string} endTime - The end time in HH:MM format
 * @return {string} - The duration in minutes
 */
function calculateDuration(startTime, endTime) {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const duration = (end - start) / 1000 / 60; 
    return `${duration} minutes`;
}

/**
 * Function to delete a Cardio log entry by its index
 * @param {number} index - The index of the log entry to delete
 */
function deleteCardioLog(index) {
    let logs = JSON.parse(localStorage.getItem('cardioLogs')) || [];
    logs.splice(index, 1); 
    localStorage.setItem('cardioLogs', JSON.stringify(logs));
    showHistoryLog();
}

/**
 * Function to delete a Strength log entry by its index
 * @param {number} index - The index of the log entry to delete
 */
function deleteStrengthLog(index) {
    let logs = JSON.parse(localStorage.getItem('strengthLogs')) || [];
    logs.splice(index, 1); 
    localStorage.setItem('strengthLogs', JSON.stringify(logs));
    showHistoryLog();
}

/**
 * Function to set and save a user-defined goal
 */
function setGoal() {
    const goalValue = document.getElementById('goalValue').value;
    localStorage.setItem('goal', goalValue);
    alert('Goal saved successfully!');
}

/**
 * Function to save user profile data to local storage
 */
function saveUserProfile() {
    const userName = document.getElementById('userName').value;
    const userWeight = document.getElementById('userWeight').value;
    const userHeight = document.getElementById('userHeight').value;

    const userProfile = {
        name: userName,
        weight: userWeight,
        height: userHeight
    };

    localStorage.setItem('userProfile', JSON.stringify(userProfile)); 
}

/**
 * Function to load user profile data from local storage
 */
function loadUserProfile() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));

    if (userProfile) {
        document.getElementById('userName').value = userProfile.name;
        document.getElementById('userWeight').value = userProfile.weight;
        document.getElementById('userHeight').value = userProfile.height;
        calculateBMI();
    }
}

/**
 * Function to calculate and display the user's BMI
 */
function calculateBMI() {
    const weight = parseFloat(document.getElementById('userWeight').value);
    const height = parseFloat(document.getElementById('userHeight').value) / 100;

    if (weight && height) {
        const bmi = (weight / (height * height)).toFixed(2);
        document.getElementById('bmiValue').value = bmi;
    } else {
        document.getElementById('bmiValue').value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Get the navigation bar and circular indicator
    const tabBar = document.getElementById('top-nav');
    const circleIndicator = tabBar.querySelector('.tab-bar_circle-indicator');
    const navIcons = tabBar.querySelectorAll('.nav-icon');

    // Set initial position of the circle indicator to the center of exerciseBtn
    const exerciseBtn = document.getElementById('exerciseBtn');
    const initialOffset = exerciseBtn.offsetLeft + (exerciseBtn.clientWidth / 2) - (circleIndicator.clientWidth / 2);
    circleIndicator.style.left = `${initialOffset}px`;

    // Add click event listeners to each navigation icon
    navIcons.forEach((item, key) => {
        item.addEventListener('click', () => {
            const color = getComputedStyle(document.documentElement).getPropertyValue(`--theme-${item.dataset.theme}`);
            circleIndicator.classList.remove('animate'); // Remove animation class to reset animation

            circleIndicator.classList.add('animate'); // Add animation class to trigger animation

            // Calculate the new position of the circle indicator
            const iconCenter = item.offsetLeft + (item.clientWidth / 2);
            const indicatorOffset = iconCenter - (circleIndicator.clientWidth / 2);
            circleIndicator.style.left = `${indicatorOffset}px`; // Set new position of the circle indicator
            document.body.style.backgroundColor = color; // Change background color of the body
            circleIndicator.style.backgroundColor = color; // Change background color of the circle indicator
        });
    });
});

/**
 * Function to display the history of logged workouts
 * Displays a list of workout logs, separated by workout type.
 */
function showHistoryLog() {
    const cardioLogs = JSON.parse(localStorage.getItem('cardioLogs')) || []; // Get Cardio logs from localStorage
    const strengthLogs = JSON.parse(localStorage.getItem('strengthLogs')) || []; // Get Strength logs from localStorage
    const logList = document.getElementById('logList');

    // Generate HTML for Cardio logs
    logList.innerHTML = cardioLogs.map((log, index) => `
        <div class="log-item">
            <div class="tag cardio" onclick="showLogsByType('Cardio')">Cardio</div>
            <strong class="clickable" onclick="showLogsByAttribute('exerciseName', '${log.exerciseName}')">${log.exerciseName}</strong>
            - <span class="clickable" onclick="showLogsByAttribute('logDate', '${log.logDate}')">${log.logDate}</span>
            <p>Type: ${log.type}, Duration: ${log.duration}</p>
            <p>Start: ${log.startTime}, End: ${log.endTime}</p>
            <p>Heart Rate: ${log.heartRate} bpm, Respiration: ${log.respirationRate}</p>
            <button onclick="deleteCardioLog(${index})">x</button>
        </div>
    `).join('') + strengthLogs.map((log, index) => `
        <div class="log-item">
            <div class="tag strength" onclick="showLogsByType('Strength')">Strength</div>
            <strong class="clickable" onclick="showLogsByAttribute('exerciseName', '${log.exerciseName}')">${log.exerciseName}</strong>
            - <span class="clickable" onclick="showLogsByAttribute('logDate', '${log.logDate}')">${log.logDate}</span>
            <p>Type: ${log.type}</p>
            <p>${log.description}, Reps: ${log.repetitions}, Weight: ${log.weight} kg, Sets: ${log.sets}, Status: ${log.status}</p>
            <button onclick="deleteStrengthLog(${index})">x</button>
        </div>
    `).join('');

    navigateTo('statsSection'); // Navigate to the statsSection
}

/**
 * Function to show logs by workout type
 * @param {string} type - The type of the workout ('Cardio' or 'Strength')
 * Filters and displays logs based on the selected workout type.
 */
function showLogsByType(type) {
    const cardioLogs = JSON.parse(localStorage.getItem('cardioLogs')) || []; // Get Cardio logs from localStorage
    const strengthLogs = JSON.parse(localStorage.getItem('strengthLogs')) || []; // Get Strength logs from localStorage
    const allLogs = [...cardioLogs, ...strengthLogs]; // Combine all logs
    const filteredLogs = allLogs.filter(log => log.type === type); // Filter logs by type

    const logList = document.getElementById('logList');
    logList.innerHTML = filteredLogs.map(log => `
        <div class="log-item">
            <div class="tag ${type.toLowerCase()}" onclick="showLogsByType('${type}')">${type}</div>
            <strong>${log.exerciseName}</strong> - ${log.logDate}
            <p>Type: ${log.type}, Duration: ${log.duration}</p>
            <p>Start: ${log.startTime}, End: ${log.endTime}</p>
            <p>Heart Rate: ${log.heartRate} bpm, Respiration: ${log.respirationRate}</p>
            <p>${log.description}, Reps: ${log.repetitions}, Weight: ${log.weight} kg, Sets: ${log.sets}, Status: ${log.status}</p>
        </div>
    `).join('');

    navigateTo('statsSection'); // Navigate to the statsSection
}

/**
 * Function to show logs by a specific attribute
 * @param {string} attribute - The attribute to filter by (e.g., 'logDate', 'exerciseName')
 * @param {string} value - The value of the attribute to filter by
 * Filters and displays logs based on a specific attribute value.
 */
function showLogsByAttribute(attribute, value) {
    const cardioLogs = JSON.parse(localStorage.getItem('cardioLogs')) || []; // Get Cardio logs from localStorage
    const strengthLogs = JSON.parse(localStorage.getItem('strengthLogs')) || []; // Get Strength logs from localStorage
    const allLogs = [...cardioLogs, ...strengthLogs]; // Combine all logs
    const filteredLogs = allLogs.filter(log => log[attribute] === value); // Filter logs by attribute

    const logList = document.getElementById('logList');
    logList.innerHTML = filteredLogs.map(log => `
        <div class="log-item">
            <strong>${log.exerciseName}</strong> - ${log.logDate}
            <p>Start: ${log.startTime}, End: ${log.endTime}</p>
            <p>Heart Rate: ${log.heartRate} bpm, Respiration: ${log.respirationRate}</p>
            <p>${log.description}, Reps: ${log.repetitions}, Weight: ${log.weight} kg, Sets: ${log.sets}, Status: ${log.status}</p>
        </div>
    `).join('');

    navigateTo('statsSection'); // Navigate to the statsSection
}
