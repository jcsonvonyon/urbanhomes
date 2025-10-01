import { getCurrentUser, signOut, onAuthStateChange } from './auth.js';
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
            const welcomeSection = document.querySelector('.welcome-section h1');
            if (welcomeSection) {
                welcomeSection.textContent = `Hi, ${profile.first_name || 'User'}`;
            }

            const tenantNameElements = document.querySelectorAll('.tenant-details .detail-row span');
            if (tenantNameElements.length > 0) {
                tenantNameElements[0].textContent = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function setupLogout() {
    const logoutLink = document.querySelector('.logout .nav-item');
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const { error } = await signOut();
            if (!error) {
                window.location.href = 'signin.html';
            }
        });
    }
}

onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
        window.location.href = 'signin.html';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    setupLogout();
});
