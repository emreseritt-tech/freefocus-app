// FocusFree - Digital Wellbeing Application
// Main Application Logic

console.log('FocusFree Digital Wellbeing App loaded successfully!');

// Application State
let appState = {
    dailyLimit: 240, // minutes
    dailyUsage: 0,
    apps: [],
    settings: {
        notifications: true,
        theme: 'light'
    }
};

// Initialize the app
function initializeApp() {
    console.log('Initializing FocusFree app...');
    
    // Load from localStorage if available
    loadFromStorage();
    
    // Update UI if on dashboard page
    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
    
    console.log('App initialized:', appState);
}

// Load data from localStorage
function loadFromStorage() {
    try {
        const saved = localStorage.getItem('focusfree_data');
        if (saved) {
            appState = JSON.parse(saved);
            console.log('Data loaded from localStorage');
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// Save data to localStorage
function saveToStorage() {
    try {
        localStorage.setItem('focusfree_data', JSON.stringify(appState));
        console.log('Data saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Add a new app to track
function addApp(name, limit, category = 'Other') {
    const newApp = {
        id: Date.now(),
        name: name,
        limit: parseInt(limit),
        usage: 0,
        category: category,
        isActive: false
    };
    
    appState.apps.push(newApp);
    saveToStorage();
    console.log('App added:', newApp);
    
    return newApp;
}

// Remove an app
function removeApp(appId) {
    const index = appState.apps.findIndex(app => app.id === appId);
    if (index !== -1) {
        appState.apps.splice(index, 1);
        saveToStorage();
        console.log('App removed:', appId);
        return true;
    }
    return false;
}

// Get app by ID
function getApp(appId) {
    return appState.apps.find(app => app.id === appId);
}

// Update daily limit
function updateDailyLimit(newLimit) {
    appState.dailyLimit = parseInt(newLimit);
    saveToStorage();
    console.log('Daily limit updated to:', newLimit);
}

// Get current statistics
function getStats() {
    const totalApps = appState.apps.length;
    const totalLimit = appState.apps.reduce((sum, app) => sum + app.limit, 0);
    const totalUsage = appState.apps.reduce((sum, app) => sum + app.usage, 0);
    
    return {
        totalApps,
        totalLimit,
        totalUsage,
        dailyLimit: appState.dailyLimit,
        dailyUsage: appState.dailyUsage,
        remainingDaily: Math.max(0, appState.dailyLimit - appState.dailyUsage)
    };
}

// Export functions for use in HTML
window.FocusFree = {
    initializeApp,
    addApp,
    removeApp,
    getApp,
    updateDailyLimit,
    getStats,
    getState: () => appState,
    saveToStorage,
    loadFromStorage
};

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', initializeApp);

// Sample data for testing (comment out in production)
// Uncomment to add sample apps automatically
/*
if (appState.apps.length === 0) {
    addApp('Instagram', 60, 'Social');
    addApp('YouTube', 90, 'Entertainment');
    addApp('TikTok', 45, 'Social');
    console.log('Sample apps added for testing');
}
*/
