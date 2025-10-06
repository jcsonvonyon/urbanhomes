import { getCurrentUser, signOut, onAuthStateChange } from './auth.js';
import { supabase } from './supabase-client.js';
import { logAuthEvent } from './auth-logger.js';
import { initSessionManager } from './session-manager.js';

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
            const welcomeSection = document.querySelector('.welcome-section h1');
            if (welcomeSection) {
                welcomeSection.textContent = `Hi, ${profile.first_name || 'User'}`;
            }

            const tenantNameElements = document.querySelectorAll('.tenant-details .detail-row span');
            if (tenantNameElements.length > 0) {
                tenantNameElements[0].textContent = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
            }

            const userBtn = document.querySelector('.header-actions .header-btn:last-child');
            if (userBtn) {
                userBtn.title = `${currentUser.email}`;
                userBtn.addEventListener('click', () => {
                    window.location.href = 'profile.html';
                });
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function setupLogout() {
    const logoutLinks = document.querySelectorAll('.logout .nav-item, #logoutBtn, [data-logout]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();

            if (currentUser) {
                await logAuthEvent(currentUser.id, 'logout');
            }

            const { error } = await signOut();
            if (!error) {
                window.location.href = 'signin.html';
            }
        });
    });
}

onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
        window.location.href = 'signin.html';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    setupLogout();
    initSessionManager();
});
