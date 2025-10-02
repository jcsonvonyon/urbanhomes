import { signIn, getSession, resendConfirmationEmail } from './auth.js';

document.addEventListener('DOMContentLoaded', async function () {
    const { session } = await getSession();
    if (session) {
        window.location.href = 'dashboard.html';
        return;
    }

    const form = document.querySelector('.auth-form');
    const submitBtn = form.querySelector('.submit-btn');

    document.getElementById('resendVerification').addEventListener('click', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();

        if (!email) {
            showAlert('Please enter your email address first', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }

        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        this.style.pointerEvents = 'none';

        const { error } = await resendConfirmationEmail(email);

        this.innerHTML = 'Didn\'t receive confirmation email?';
        this.style.pointerEvents = 'auto';

        if (error) {
            showAlert(error.message || 'Failed to resend confirmation email', 'error');
            return;
        }

        showAlert('Confirmation email sent! Please check your inbox.', 'success');
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showAlert('Please enter your email and password', 'error');
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        submitBtn.disabled = true;

        const { data, error } = await signIn(email, password);

        if (error) {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            if (error.message.includes('Invalid login credentials')) {
                showAlert('Invalid email or password. Please try again.', 'error');
            } else if (error.message.includes('Email not confirmed')) {
                showAlert('Please confirm your email address before signing in. Check your inbox for the confirmation link.', 'error');
            } else if (error.message.includes('email') && error.message.includes('confirm')) {
                showAlert('Please verify your email address. Check your inbox for the confirmation link.', 'error');
            } else {
                showAlert(error.message || 'Failed to sign in. Please try again.', 'error');
            }
            return;
        }

        showAlert('Sign in successful! Redirecting to dashboard...', 'success');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
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
