import { supabase } from './supabase-client.js';
import { signOut } from './auth.js';

const SESSION_TIMEOUT = 30 * 60 * 1000;
const ACTIVITY_CHECK_INTERVAL = 60 * 1000;

let activityTimeout = null;
let lastActivityTime = Date.now();

export function initSessionManager() {
    resetActivityTimer();
    setupActivityListeners();
    startActivityCheck();
}

function resetActivityTimer() {
    lastActivityTime = Date.now();

    if (activityTimeout) {
        clearTimeout(activityTimeout);
    }

    activityTimeout = setTimeout(handleSessionTimeout, SESSION_TIMEOUT);
}

function setupActivityListeners() {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
        document.addEventListener(event, () => {
            resetActivityTimer();
        }, { passive: true });
    });
}

function startActivityCheck() {
    setInterval(() => {
        const inactiveTime = Date.now() - lastActivityTime;

        if (inactiveTime >= SESSION_TIMEOUT) {
            handleSessionTimeout();
        }
    }, ACTIVITY_CHECK_INTERVAL);
}

async function handleSessionTimeout() {
    if (activityTimeout) {
        clearTimeout(activityTimeout);
    }

    await signOut();

    sessionStorage.setItem('session_expired', 'true');
    window.location.href = 'signin.html';
}

export async function checkSessionValidity() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            window.location.href = 'signin.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Session check failed:', error);
        return false;
    }
}
