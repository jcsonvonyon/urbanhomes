import { resetPasswordForEmail } from './auth.js';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('forgotPasswordForm');
    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();

        if (!email) {
            showAlert('Please enter your email address', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Please enter a valid email address', 'error');
            document.getElementById('email').focus();
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const { data, error } = await resetPasswordForEmail(email);

        if (error) {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            showAlert(error.message || 'Failed to send reset email. Please try again.', 'error');
            return;
        }

        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        showAlert('Password reset link has been sent to your email. Please check your inbox.', 'success');

        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 3000);
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
});
