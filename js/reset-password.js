import { updatePassword } from './auth.js';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('resetPasswordForm');
    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!password || !confirmPassword) {
            showAlert('Please fill in all fields', 'error');
            return;
        }

        if (password.length < 8) {
            showAlert('Password must be at least 8 characters long', 'error');
            document.getElementById('password').focus();
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            document.getElementById('confirmPassword').focus();
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
        submitBtn.disabled = true;

        const { data, error } = await updatePassword(password);

        if (error) {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            showAlert(error.message || 'Failed to reset password. Please try again.', 'error');
            return;
        }

        showAlert('Password reset successful! Redirecting to dashboard...', 'success');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
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
