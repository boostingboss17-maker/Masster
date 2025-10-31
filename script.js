// Categories data structure
const categories = [
    {
        id: 'spam',
        label: 'Spam',
        hasSubOptions: false,
        helperText: 'Number of identical spam reports to submit.',
        subOptions: []
    },
    {
        id: 'suicide',
        label: 'Suicide, self-injury or eating disorders',
        hasSubOptions: true,
        subOptions: [
            { id: 'suicide_self_injury', label: 'Suicide or self-injury' },
            { id: 'eating_disorder', label: 'Eating disorder' }
        ]
    },
    {
        id: 'violence',
        label: 'Violence, hate or exploitation',
        hasSubOptions: true,
        subOptions: [
            { id: 'credible_threat', label: 'Credible threat to safety' },
            { id: 'terrorism', label: 'Seems like terrorism or organised crime' },
            { id: 'exploitation', label: 'Seems like exploitation' },
            { id: 'hate_speech', label: 'Hate speech or symbols' },
            { id: 'calling_violence', label: 'Calling for violence' },
            { id: 'showing_violence', label: 'Showing violence, death or severe injury' }
        ]
    },
    {
        id: 'restricted_items',
        label: 'Selling or promoting restricted items',
        hasSubOptions: true,
        subOptions: [
            { id: 'drugs', label: 'Drugs' },
            { id: 'weapons', label: 'Weapons' },
            { id: 'animals', label: 'Animals' }
        ]
    },
    {
        id: 'nudity',
        label: 'Nudity or sexual activity',
        hasSubOptions: true,
        subOptions: [
            { id: 'nude_images', label: 'Threatening to share or sharing nude images' },
            { id: 'prostitution', label: 'Seems like prostitution' },
            { id: 'sexual_exploitation', label: 'Seems like sexual exploitation' },
            { id: 'nudity_activity', label: 'Nudity or sexual activity' }
        ]
    },
    {
        id: 'scam',
        label: 'Scam or fraud',
        hasSubOptions: true,
        subOptions: [
            { id: 'fraud', label: 'Fraud or scam' },
            { id: 'spam_scam', label: 'Spam' }
        ]
    },
    {
        id: 'false_info',
        label: 'False information',
        hasSubOptions: false,
        subOptions: []
    },
    {
        id: 'impersonation',
        label: 'Impersonation — They are pretending to be someone else',
        hasSubOptions: true,
        subOptions: [
            { id: 'impersonation_me', label: 'Me', helperText: 'You will be asked to confirm your identity in Instagram\'s process.' },
            { id: 'impersonation_someone', label: 'Someone else', requiresUsername: true }
        ]
    }
];

// Global state
const state = {
    username: '',
    selectedCategories: {},
    totalReports: 0,
    results: []
};

// DOM elements
const elements = {
    username: document.getElementById('username'),
    usernameError: document.getElementById('username-error'),
    normalizedUsername: document.getElementById('normalized-username'),
    categoriesList: document.getElementById('categories-list'),
    totalReportsCount: document.getElementById('total-reports-count'),
    previewButton: document.getElementById('preview-button'),
    summaryModal: document.getElementById('summary-modal'),
    closeModal: document.getElementById('close-modal'),
    summaryContent: document.getElementById('summary-content'),
    consentCheckbox: document.getElementById('consent-checkbox'),
    confirmButton: document.getElementById('confirm-button'),
    cancelButton: document.getElementById('cancel-button'),
    resultsSection: document.getElementById('results-section'),
    resultsContent: document.getElementById('results-content'),
    progressBar: document.getElementById('progress-bar'),
    statusText: document.getElementById('status-text')
};

// Initialize the application
function init() {
    renderCategories();
    setupEventListeners();
}

// Render categories list
function renderCategories() {
    categories.forEach(category => {
        const categoryElement = createCategoryElement(category);
        elements.categoriesList.appendChild(categoryElement);
    });
}

// Create a category element
function createCategoryElement(category) {
    const categoryItem = document.createElement('div');
    categoryItem.className = 'category-item';
    categoryItem.id = `category-${category.id}`;
    
    // Create category header
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'category-checkbox';
    checkbox.id = `checkbox-${category.id}`;
    checkbox.setAttribute('aria-label', `Select ${category.label} category`);
    
    const label = document.createElement('label');
    label.className = 'category-label';
    label.htmlFor = `checkbox-${category.id}`;
    label.textContent = category.label;
    
    const badge = document.createElement('span');
    badge.className = 'category-badge';
    badge.id = `badge-${category.id}`;
    
    categoryHeader.appendChild(checkbox);
    categoryHeader.appendChild(label);
    categoryHeader.appendChild(badge);
    
    // Create category content
    const categoryContent = document.createElement('div');
    categoryContent.className = 'category-content';
    categoryContent.id = `content-${category.id}`;
    
    // Add sub-options if any
    if (category.hasSubOptions && category.subOptions.length > 0) {
        const subOptionsContainer = document.createElement('div');
        subOptionsContainer.className = 'sub-options';
        
        category.subOptions.forEach(subOption => {
            const subOptionElement = document.createElement('div');
            subOptionElement.className = 'sub-option';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `${category.id}-option`;
            radio.id = `${subOption.id}`;
            radio.value = subOption.id;
            radio.setAttribute('aria-label', subOption.label);
            
            const subLabel = document.createElement('label');
            subLabel.htmlFor = `${subOption.id}`;
            subLabel.textContent = subOption.label;
            
            subOptionElement.appendChild(radio);
            subOptionElement.appendChild(subLabel);
            subOptionsContainer.appendChild(subOptionElement);
            
            // Add impersonation username field if required
            if (subOption.requiresUsername) {
                const impersonationField = document.createElement('div');
                impersonationField.className = 'impersonation-field';
                impersonationField.id = `${subOption.id}-field`;
                
                const impersonationLabel = document.createElement('label');
                impersonationLabel.htmlFor = `${subOption.id}-username`;
                impersonationLabel.textContent = 'Impersonated username (required)';
                
                const impersonationInput = document.createElement('input');
                impersonationInput.type = 'text';
                impersonationInput.id = `${subOption.id}-username`;
                impersonationInput.placeholder = 'Enter username (with or without @)';
                impersonationInput.setAttribute('aria-required', 'true');
                
                const impersonationError = document.createElement('div');
                impersonationError.className = 'error-message';
                impersonationError.id = `${subOption.id}-username-error`;
                
                impersonationField.appendChild(impersonationLabel);
                impersonationField.appendChild(impersonationInput);
                impersonationField.appendChild(impersonationError);
                
                subOptionsContainer.appendChild(impersonationField);
                
                // Show impersonation field when the option is selected
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        impersonationField.style.display = 'block';
                    } else {
                        impersonationField.style.display = 'none';
                    }
                });
            }
            
            // Add helper text if available
            if (subOption.helperText) {
                const helperText = document.createElement('div');
                helperText.className = 'helper-text';
                helperText.textContent = subOption.helperText;
                subOptionElement.appendChild(helperText);
            }
        });
        
        categoryContent.appendChild(subOptionsContainer);
    }
    
    // Add quantity selector
    const quantitySelector = document.createElement('div');
    quantitySelector.className = 'quantity-selector';
    
    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '−';
    decreaseButton.setAttribute('aria-label', 'Decrease quantity');
    decreaseButton.id = `decrease-${category.id}`;
    
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = '1';
    quantityInput.max = '10';
    quantityInput.value = '1';
    quantityInput.id = `quantity-${category.id}`;
    quantityInput.setAttribute('aria-label', 'Report quantity');
    
    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.setAttribute('aria-label', 'Increase quantity');
    increaseButton.id = `increase-${category.id}`;
    
    quantitySelector.appendChild(decreaseButton);
    quantitySelector.appendChild(quantityInput);
    quantitySelector.appendChild(increaseButton);
    
    categoryContent.appendChild(quantitySelector);
    
    // Add helper text if available
    if (category.helperText) {
        const helperText = document.createElement('div');
        helperText.className = 'helper-text';
        helperText.textContent = category.helperText;
        categoryContent.appendChild(helperText);
    }
    
    // Assemble the category item
    categoryItem.appendChild(categoryHeader);
    categoryItem.appendChild(categoryContent);
    
    return categoryItem;
}

// Setup event listeners
function setupEventListeners() {
    // Username validation
    elements.username.addEventListener('input', validateUsername);
    
    // Category checkboxes
    document.querySelectorAll('.category-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleCategoryToggle);
    });
    
    // Add test button listener (if test section exists)
    const runTestsButton = document.getElementById('run-tests');
    if (runTestsButton) {
        runTestsButton.addEventListener('click', runUsernameSanitizationTests);
    }
    
    // Add enable tests link listener
    const enableTestsLink = document.getElementById('enable-tests');
    if (enableTestsLink) {
        enableTestsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const testSection = document.getElementById('test-section');
            if (testSection) {
                testSection.style.display = testSection.style.display === 'none' ? 'block' : 'none';
                enableTestsLink.textContent = testSection.style.display === 'none' ? 'Enable Tests' : 'Hide Tests';
            }
        });
    }
    
    // Quantity selectors
    document.querySelectorAll('.quantity-selector button').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });
    
    document.querySelectorAll('.quantity-selector input').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
    
    // Sub-options
    document.querySelectorAll('.sub-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', handleSubOptionSelect);
    });
    
    // Preview button
    elements.previewButton.addEventListener('click', showPreviewModal);
    
    // Modal controls
    elements.closeModal.addEventListener('click', closeModal);
    elements.cancelButton.addEventListener('click', closeModal);
    elements.consentCheckbox.addEventListener('change', toggleConfirmButton);
    elements.confirmButton.addEventListener('click', submitReports);
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === elements.summaryModal) {
            closeModal();
        }
    });
}

// Sanitize and validate username
function sanitizeUsername(input) {
    if (!input) return '';
    
    // Trim whitespace
    let sanitized = input.trim();
    
    // Remove leading @ if present
    if (sanitized.startsWith('@')) {
        sanitized = sanitized.substring(1);
    }
    
    // Convert to lowercase (Instagram usernames are case-insensitive)
    sanitized = sanitized.toLowerCase();
    
    return sanitized;
}

function validateUsername() {
    const rawInput = elements.username.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (rawInput === '') {
        isValid = false;
        errorMessage = 'Username is required';
        elements.normalizedUsername.style.display = 'none';
    } else {
        const sanitized = sanitizeUsername(rawInput);
        
        // Validate Instagram username rules: letters, numbers, periods, underscores, 1-30 chars
        if (!/^[a-z0-9._]{1,30}$/.test(sanitized)) {
            isValid = false;
            errorMessage = 'Invalid username — use only letters, numbers, periods, or underscores and 1–30 characters.';
            elements.normalizedUsername.style.display = 'none';
        } else {
            // Show normalized username
            elements.normalizedUsername.textContent = `Looking up: @${sanitized}`;
            elements.normalizedUsername.style.display = 'block';
        }
    }
    
    elements.usernameError.textContent = errorMessage;
    state.username = isValid ? sanitizeUsername(rawInput) : '';
    return isValid;
}

// Handle category toggle
function handleCategoryToggle(event) {
    const checkbox = event.target;
    const categoryId = checkbox.id.replace('checkbox-', '');
    const categoryContent = document.getElementById(`content-${categoryId}`);
    const badge = document.getElementById(`badge-${categoryId}`);
    
    if (checkbox.checked) {
        categoryContent.style.display = 'block';
        
        // Initialize category in state if not exists
        if (!state.selectedCategories[categoryId]) {
            state.selectedCategories[categoryId] = {
                quantity: 1,
                subOption: null,
                impersonatedUsername: null
            };
        }
        
        // Update badge
        updateCategoryBadge(categoryId);
    } else {
        categoryContent.style.display = 'none';
        badge.style.display = 'none';
        
        // Remove category from state
        if (state.selectedCategories[categoryId]) {
            state.totalReports -= state.selectedCategories[categoryId].quantity;
            delete state.selectedCategories[categoryId];
        }
    }
    
    updateTotalReports();
}

// Handle quantity change
function handleQuantityChange(event) {
    const button = event.target;
    const categoryId = button.id.split('-')[1];
    const quantityInput = document.getElementById(`quantity-${categoryId}`);
    let quantity = parseInt(quantityInput.value);
    
    if (button.id.startsWith('decrease')) {
        quantity = Math.max(1, quantity - 1);
    } else {
        quantity = Math.min(10, quantity + 1);
    }
    
    quantityInput.value = quantity;
    updateQuantity({ target: quantityInput });
}

// Update quantity
function updateQuantity(event) {
    const input = event.target;
    const categoryId = input.id.replace('quantity-', '');
    let quantity = parseInt(input.value);
    
    // Validate quantity
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    } else if (quantity > 10) {
        quantity = 10;
    }
    
    input.value = quantity;
    
    // Update state
    if (state.selectedCategories[categoryId]) {
        const oldQuantity = state.selectedCategories[categoryId].quantity;
        state.selectedCategories[categoryId].quantity = quantity;
        state.totalReports += (quantity - oldQuantity);
    }
    
    updateCategoryBadge(categoryId);
    updateTotalReports();
}

// Handle sub-option selection
function handleSubOptionSelect(event) {
    const radio = event.target;
    const categoryId = radio.name.split('-')[0];
    const subOptionId = radio.value;
    
    // Update state
    if (state.selectedCategories[categoryId]) {
        state.selectedCategories[categoryId].subOption = subOptionId;
    }
    
    // Handle impersonation username field
    if (subOptionId === 'impersonation_someone') {
        document.getElementById(`${subOptionId}-field`).style.display = 'block';
    } else {
        const impersonationField = document.getElementById('impersonation_someone-field');
        if (impersonationField) {
            impersonationField.style.display = 'none';
        }
    }
}

// Update category badge
function updateCategoryBadge(categoryId) {
    const badge = document.getElementById(`badge-${categoryId}`);
    const category = categories.find(cat => cat.id === categoryId);
    
    if (state.selectedCategories[categoryId]) {
        const quantity = state.selectedCategories[categoryId].quantity;
        badge.textContent = `${category.label.split(' ')[0]} ×${quantity}`;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

// Update total reports counter
function updateTotalReports() {
    elements.totalReportsCount.textContent = state.totalReports;
}

// Show preview modal
function showPreviewModal() {
    // Validate username first
    if (!validateUsername()) {
        elements.username.focus();
        return;
    }
    
    // Check if any category is selected
    if (Object.keys(state.selectedCategories).length === 0) {
        alert('Please select at least one report category');
        return;
    }
    
    // Collect and validate impersonation usernames
    Object.keys(state.selectedCategories).forEach(categoryId => {
        const selectedCategory = state.selectedCategories[categoryId];
        if (selectedCategory.subOption === 'impersonation_someone') {
            const impersonationInput = document.getElementById('impersonation_someone-username');
            if (impersonationInput) {
                const rawUsername = impersonationInput.value.trim();
                if (rawUsername === '') {
                    alert('Please enter the impersonated username');
                    impersonationInput.focus();
                    return;
                }
                
                const sanitized = sanitizeUsername(rawUsername);
                if (!/^[a-z0-9._]{1,30}$/.test(sanitized)) {
                    alert('Invalid impersonated username — use only letters, numbers, periods, or underscores and 1–30 characters.');
                    impersonationInput.focus();
                    return;
                }
                
                // Store sanitized username
                selectedCategory.impersonatedUsername = sanitized;
            }
        }
    });
    
    // Generate summary content
    generateSummaryContent();
    
    // Show modal
    elements.summaryModal.style.display = 'block';
}

// Build a sanitized payload for backend calls
function buildReportPayload() {
    const payload = {
        username: state.username, // already sanitized lowercase without leading @
        reports: Object.keys(state.selectedCategories).map(categoryId => {
            const category = categories.find(cat => cat.id === categoryId);
            const selectedCategory = state.selectedCategories[categoryId];
            return {
                category: category.label,
                subOption: selectedCategory.subOption || null,
                quantity: selectedCategory.quantity,
                impersonatedUsername: selectedCategory.impersonatedUsername || null
            };
        })
    };
    return payload;
}

// Generate summary content
function generateSummaryContent() {
    const summaryContent = elements.summaryContent;
    summaryContent.innerHTML = '';
    
    // Add target username
    const usernameSection = document.createElement('div');
    usernameSection.className = 'summary-section';
    usernameSection.innerHTML = `<strong>Target Username:</strong> @${state.username}`;
    summaryContent.appendChild(usernameSection);
    
    // Add selected categories
    const categoriesSection = document.createElement('div');
    categoriesSection.className = 'summary-section';
    categoriesSection.innerHTML = '<strong>Selected Reports:</strong>';
    
    const categoriesList = document.createElement('ul');
    
    Object.keys(state.selectedCategories).forEach(categoryId => {
        const category = categories.find(cat => cat.id === categoryId);
        const selectedCategory = state.selectedCategories[categoryId];
        
        const listItem = document.createElement('li');
        let itemText = `${category.label} (${selectedCategory.quantity})`;
        
        // Add sub-option if selected
        if (selectedCategory.subOption) {
            const subOption = category.subOptions.find(opt => opt.id === selectedCategory.subOption);
            if (subOption) {
                itemText += ` - ${subOption.label}`;
            }
        }
        
        // Add impersonated username if provided
        if (selectedCategory.subOption === 'impersonation_someone' && selectedCategory.impersonatedUsername) {
            itemText += ` - Impersonating: @${selectedCategory.impersonatedUsername}`;
        }
        
        listItem.textContent = itemText;
        categoriesList.appendChild(listItem);
    });
    
    categoriesSection.appendChild(categoriesList);
    summaryContent.appendChild(categoriesSection);
    
    // Add total reports
    const totalSection = document.createElement('div');
    totalSection.className = 'summary-section';
    totalSection.innerHTML = `<strong>Total Reports:</strong> ${state.totalReports}`;
    summaryContent.appendChild(totalSection);
}

// Toggle confirm button based on consent checkbox
function toggleConfirmButton() {
    elements.confirmButton.disabled = !elements.consentCheckbox.checked;
}

// Close modal
function closeModal() {
    elements.summaryModal.style.display = 'none';
    elements.consentCheckbox.checked = false;
    elements.confirmButton.disabled = true;
}

// Submit reports
function submitReports() {
    // Close the summary modal
    closeModal();
    
    // Show results section
    elements.resultsSection.style.display = 'block';
    
    // Simulate report submission
    const totalReports = state.totalReports;
    let completedReports = 0;
    
    // Clear previous results
    elements.resultsContent.innerHTML = '';
    state.results = [];
    
    // Create status elements
    const statusElement = document.createElement('div');
    statusElement.className = 'status';
    statusElement.innerHTML = '<strong>Status:</strong> <span id="status">Processing...</span>';
    elements.resultsContent.appendChild(statusElement);
    
    const progressElement = document.createElement('div');
    progressElement.className = 'progress';
    progressElement.innerHTML = `<strong>Progress:</strong> <span id="progress">0/${totalReports}</span>`;
    elements.resultsContent.appendChild(progressElement);
    
    const logElement = document.createElement('div');
    logElement.className = 'log';
    logElement.innerHTML = '<strong>Log:</strong>';
    
    const logList = document.createElement('ul');
    logList.id = 'log-list';
    logElement.appendChild(logList);
    elements.resultsContent.appendChild(logElement);
    
    // Process each category
    Object.keys(state.selectedCategories).forEach(categoryId => {
        const category = categories.find(cat => cat.id === categoryId);
        const selectedCategory = state.selectedCategories[categoryId];
        
        // Process each report in the category
        for (let i = 0; i < selectedCategory.quantity; i++) {
            // Simulate API call with setTimeout
            setTimeout(() => {
                // Simulate success/failure (90% success rate)
                const success = Math.random() < 0.9;
                
                // Create result object
                const result = {
                    category: category.label,
                    subOption: selectedCategory.subOption ? 
                        category.subOptions.find(opt => opt.id === selectedCategory.subOption).label : null,
                    impersonatedUsername: selectedCategory.impersonatedUsername,
                    status: success ? 'sent' : 'failed'
                };
                
                state.results.push(result);
                
                // Update log
                const logItem = document.createElement('li');
                logItem.className = success ? 'success' : 'error';
                
                let logText = `Report ${completedReports + 1}: ${category.label}`;
                if (result.subOption) {
                    logText += ` - ${result.subOption}`;
                }
                logText += ` - ${result.status.toUpperCase()}`;
                
                logItem.textContent = logText;
                document.getElementById('log-list').appendChild(logItem);
                
                // Update progress
                completedReports++;
                document.getElementById('progress').textContent = `${completedReports}/${totalReports}`;
                elements.progressBar.style.width = `${(completedReports / totalReports) * 100}%`;
                
                // Check if all reports are processed
                if (completedReports === totalReports) {
                    document.getElementById('status').textContent = 'Completed';
                    elements.statusText.textContent = 'All reports have been processed.';
                    
                    // Add done button
                    const doneButton = document.createElement('button');
                    doneButton.className = 'done-button';
                    doneButton.textContent = 'Done';
                    doneButton.addEventListener('click', () => {
                        // Reset the form for new reports
                        resetForm();
                    });
                    elements.resultsContent.appendChild(doneButton);
                }
            }, 500 + (i * 300)); // Stagger the reports for visual effect
        }
    });
}

// Reset the form
function resetForm() {
    // Clear username
    elements.username.value = '';
    elements.usernameError.textContent = '';
    
    // Uncheck all categories
    document.querySelectorAll('.category-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Hide all category contents
    document.querySelectorAll('.category-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Hide all badges
    document.querySelectorAll('.category-badge').forEach(badge => {
        badge.style.display = 'none';
    });
    
    // Reset quantities
    document.querySelectorAll('.quantity-selector input').forEach(input => {
        input.value = '1';
    });
    
    // Uncheck all radio buttons
    document.querySelectorAll('.sub-option input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Hide impersonation field
    const impersonationField = document.getElementById('impersonation_someone-field');
    if (impersonationField) {
        impersonationField.style.display = 'none';
    }
    
    // Reset state
    state.username = '';
    state.selectedCategories = {};
    state.totalReports = 0;
    state.results = [];
    
    // Update total reports counter
    updateTotalReports();
    
    // Hide results section
    elements.resultsSection.style.display = 'none';
}

// Username sanitization tests
function runUsernameSanitizationTests() {
    const testCases = [
        { input: '@ExampleUser', expected: 'exampleuser', description: '@ExampleUser → exampleuser' },
        { input: 'ExampleUser', expected: 'exampleuser', description: 'ExampleUser → exampleuser' },
        { input: ' @ExAm_123. ', expected: 'exam_123.', description: ' @ExAm_123.  → exam_123.' },
        { input: 'user!name', expected: null, description: 'user!name → invalid (contains !)' },
        { input: '', expected: null, description: 'empty string → invalid' },
        { input: 'a'.repeat(31), expected: null, description: 'very long string (>30) → invalid' },
        { input: 'valid_user.123', expected: 'valid_user.123', description: 'valid_user.123 → valid_user.123' },
        { input: '@UPPERCASE', expected: 'uppercase', description: '@UPPERCASE → uppercase' }
    ];
    
    const testResults = document.getElementById('test-results');
    testResults.innerHTML = '<h3>Test Results:</h3>';
    
    let passed = 0;
    let failed = 0;
    
    testCases.forEach((testCase, index) => {
        const result = document.createElement('div');
        result.className = 'test-result';
        
        const sanitized = sanitizeUsername(testCase.input);
        const isValid = sanitized && /^[a-z0-9._]{1,30}$/.test(sanitized);
        const actualResult = isValid ? sanitized : null;
        
        const success = actualResult === testCase.expected;
        if (success) {
            passed++;
        } else {
            failed++;
        }
        
        result.innerHTML = `
            <div class="test-case ${success ? 'pass' : 'fail'}">
                <strong>Test ${index + 1}:</strong> ${testCase.description}<br>
                <strong>Input:</strong> "${testCase.input}"<br>
                <strong>Expected:</strong> ${testCase.expected === null ? 'invalid' : testCase.expected}<br>
                <strong>Actual:</strong> ${actualResult === null ? 'invalid' : actualResult}<br>
                <strong>Result:</strong> ${success ? '✅ PASS' : '❌ FAIL'}
            </div>
        `;
        
        testResults.appendChild(result);
    });
    
    const summary = document.createElement('div');
    summary.className = 'test-summary';
    summary.innerHTML = `
        <h4>Summary: ${passed} passed, ${failed} failed</h4>
        <div class="${failed === 0 ? 'all-pass' : 'some-fail'}">
            ${failed === 0 ? '🎉 All tests passed!' : '⚠️ Some tests failed'}
        </div>
    `;
    testResults.appendChild(summary);
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);