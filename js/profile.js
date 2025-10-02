import { getCurrentUser, signOut, updatePassword } from './auth.js';
import { supabase } from './supabase-client.js';

let currentUser = null;

async function checkAuth() {
    const { user, error } = await getCurrentUser();

    if (error || !user) {
        window.location.href = 'signin.html';
        return;
    }

    currentUser = user;
    await loadUserProfile();
}

async function loadUserProfile() {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle();

        if (error) throw error;

        if (profile) {
            document.getElementById('firstName').value = profile.first_name || '';
            document.getElementById('lastName').value = profile.last_name || '';
            document.getElementById('phone').value = profile.phone || '';
        }

        document.getElementById('email').value = currentUser.email || '';
    } catch (error) {
        console.error('Error loading profile:', error);
        showAlert('Failed to load profile data', 'error');
    }
}

async function updateProfile(firstName, lastName, phone) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: firstName,
                last_name: lastName,
                phone: phone,
            })
            .eq('id', currentUser.id);

        if (error) throw error;

        return { error: null };
    } catch (error) {
        return { error };
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();

    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!firstName || !lastName || !phone) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }

        const submitBtn = profileForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;

        const { error } = await updateProfile(firstName, lastName, phone);

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (error) {
            showAlert(error.message || 'Failed to update profile', 'error');
            return;
        }

        showAlert('Profile updated successfully!', 'success');
    });

    const passwordForm = document.getElementById('passwordForm');
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            showAlert('Please fill in all password fields', 'error', passwordForm);
            return;
        }

        if (newPassword.length < 8) {
            showAlert('New password must be at least 8 characters long', 'error', passwordForm);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            showAlert('New passwords do not match', 'error', passwordForm);
            return;
        }

        const submitBtn = passwordForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        submitBtn.disabled = true;

        const { error } = await updatePassword(newPassword);

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (error) {
            showAlert(error.message || 'Failed to update password', 'error', passwordForm);
            return;
        }

        showAlert('Password updated successfully!', 'success', passwordForm);
        passwordForm.reset();
    });

    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        const { error } = await signOut();
        if (!error) {
            window.location.href = 'signin.html';
        }
    });
});

function showAlert(message, type = 'info', targetElement = null) {
    const existingAlerts = document.querySelectorAll('.alert-message');
    existingAlerts.forEach(alert => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-message ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' :
        type === 'error' ? 'fa-exclamation-circle' :
            'fa-info-circle';

    alertDiv.innerHTML = `<i class="fas ${icon}"></i> ${message}`;

    const container = targetElement || document.querySelector('.profile-content');
    container.insertBefore(alertDiv, container.firstChild);

    if (type !== 'success') {
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}
