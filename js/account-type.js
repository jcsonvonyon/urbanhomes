// DOM Elements
const accountCards = document.querySelectorAll('.account-card');
const selectBtn = document.getElementById('selectBtn');
const signInBtn = document.querySelector('.sign-in-btn');

// State
let selectedCard = null;

// Account Selection Functionality
function initializeAccountSelection() {
    accountCards.forEach(card => {
        card.addEventListener('click', handleCardSelection);
        // Make cards focusable for accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'radio');
        card.setAttribute('aria-checked', 'false');
    });
}

function handleCardSelection(event) {
    const clickedCard = event.currentTarget;
    
    // Remove previous selection
    if (selectedCard) {
        selectedCard.classList.remove('selected');
        selectedCard.setAttribute('aria-checked', 'false');
    }
    
    // Add selection to clicked card
    clickedCard.classList.add('selected');
    clickedCard.setAttribute('aria-checked', 'true');
    selectedCard = clickedCard;
    
    // Enable select button
    enableSelectButton();
    
    // Log selection for debugging
    const accountType = clickedCard.dataset.type;
    const accountTitle = clickedCard.querySelector('.card-title').textContent;
    console.log('Account selected:', { type: accountType, title: accountTitle });
}

function enableSelectButton() {
    selectBtn.disabled = false;
}

function disableSelectButton() {
    selectBtn.disabled = true;
}

// Select Button Functionality - Navigate to signup.html
function handleSelectButtonClick() {
    if (selectedCard) {
        const accountType = selectedCard.dataset.type;
        const accountTitle = selectedCard.querySelector('.card-title').textContent;
        
        // Store selected account type for the signup page
        if (typeof(Storage) !== "undefined") {
            sessionStorage.setItem('selectedAccountType', accountType);
            sessionStorage.setItem('selectedAccountTitle', accountTitle);
        }
        
        // Log selection
        console.log('Navigating to signup with account type:', {
            type: accountType,
            title: accountTitle
        });
        
        // Navigate to signup.html
        window.location.href = 'signup.html';
    } else {
        // This shouldn't happen since button is disabled when no selection
        alert('Please select an account type first.');
    }
}

// Sign In Button Functionality
function handleSignInClick() {
    // Navigate to sign in page
    console.log('Navigating to sign in page');
    
    // You can replace this with actual sign-in page URL
    window.location.href = 'signin.html';
    
    // Fallback alert if signin.html doesn't exist
    // alert('Redirecting to sign in page...');
}

// Keyboard Navigation Support
function handleKeyNavigation(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        if (event.target.classList.contains('account-card')) {
            event.preventDefault();
            handleCardSelection(event);
        } else if (event.target === selectBtn && !selectBtn.disabled) {
            event.preventDefault();
            handleSelectButtonClick();
        }
    }
    
    // Arrow key navigation between cards
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('account-card')) {
            event.preventDefault();
            
            const cards = Array.from(accountCards);
            const currentIndex = cards.indexOf(focusedElement);
            let nextIndex;
            
            if (event.key === 'ArrowLeft') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
            } else {
                nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
            }
            
            cards[nextIndex].focus();
        }
    }
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Card selection
    initializeAccountSelection();
    
    // Select button
    selectBtn.addEventListener('click', handleSelectButtonClick);
    
    // Sign in button
    signInBtn.addEventListener('click', handleSignInClick);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
}

// Utility function to get selected account type (for other scripts)
function getSelectedAccountType() {
    if (selectedCard) {
        return {
            type: selectedCard.dataset.type,
            title: selectedCard.querySelector('.card-title').textContent
        };
    }
    return null;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    
    // Check if there's a previously selected account type from sessionStorage
    if (typeof(Storage) !== "undefined") {
        const savedAccountType = sessionStorage.getItem('selectedAccountType');
        if (savedAccountType) {
            const savedCard = document.querySelector(`[data-type="${savedAccountType}"]`);
            if (savedCard) {
                // Simulate click to select the saved card
                savedCard.click();
            }
        }
    }
    
    console.log('UrbanHomes Account Type Selection initialized');
});

// Export functions for potential module use or testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleCardSelection,
        enableSelectButton,
        disableSelectButton,
        handleSelectButtonClick,
        getSelectedAccountType
    };
}