import { signUp, getSession } from './auth.js';

document.addEventListener('DOMContentLoaded', async function () {
    const { session } = await getSession();
    if (session) {
        window.location.href = 'dashboard.html';
        return;
    }

    const form = document.querySelector('.auth-form');
    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const email = formData.get('email');
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const phone = formData.get('phone');
        const password = formData.get('password');
        const termsAccepted = formData.get('terms');

        if (!email || !firstName || !lastName || !phone || !password) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }

        if (!termsAccepted) {
            showAlert('Please accept the Terms of Service and Privacy Policy', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Please enter a valid email address', 'error');
            document.getElementById('email').focus();
            return;
        }

        if (password.length < 8) {
            showAlert('Password must be at least 8 characters long', 'error');
            document.getElementById('password').focus();
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        this.classList.add('submitting');

        const { data, error } = await signUp(email, password, firstName, lastName, phone);

        if (error) {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            this.classList.remove('submitting');

            if (error.message.includes('already registered')) {
                showAlert('An account with this email already exists. Please sign in instead.', 'error');
            } else {
                showAlert(error.message || 'Failed to create account. Please try again.', 'error');
            }
            return;
        }

        showAlert('Account created successfully! Please check your email to confirm your account.', 'success');

        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 2000);
    });

    function showAlert(message, type = 'info') {
        const existingAlerts = document.querySelectorAll('.alert-message');
        existingAlerts.forEach(alert => alert.remove());

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-message ${type}`;

        const icon = type === 'success' ? 'fa-check-circle' :
            type === 'error' ? 'fa-exclamation-circle' :
                'fa-info-circle';

        alertDiv.innerHTML = `<i class="fas ${icon}"></i> ${message}`;

        const formContainer = document.querySelector('.form-container');
        formContainer.insertBefore(alertDiv, formContainer.firstChild);

        if (type !== 'success') {
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    }

    document.getElementById('password').addEventListener('input', function () {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthIndicator(strength);
    });

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    }

    function updatePasswordStrengthIndicator(strength) {
        let indicator = document.querySelector('.password-strength');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'password-strength';
            document.querySelector('#password').parentNode.appendChild(indicator);
        }

        const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

        if (strength === 0) {
            indicator.style.display = 'none';
            return;
        }

        indicator.style.display = 'block';
        indicator.innerHTML = `
            <div class="strength-bar">
                ${Array(5).fill(0).map((_, i) =>
            `<div class="strength-segment ${i < strength ? 'active' : ''}" style="background-color: ${i < strength ? colors[strength - 1] : '#e5e7eb'}"></div>`
        ).join('')}
            </div>
            <span class="strength-text" style="color: ${colors[strength - 1]}">${levels[strength - 1]}</span>
        `;
    }
});
