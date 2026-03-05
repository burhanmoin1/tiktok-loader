import { getAccessToken } from '$lib/api/client';

export type UserSession = {
    id: number;
    user_id: number | null;
    ip_address: string | null;
    user_agent: string | null;
    start_time: string;
    last_seen: string;
    duration_seconds: number;
    device_id: string | null;
};

function getOrCreateDeviceId(): string {
    const key = 'analytics_device_id';
    let deviceId = localStorage.getItem(key);
    if (!deviceId) {
        // Generate a random UUID-like string
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            deviceId = crypto.randomUUID();
        } else {
            // Fallback for older browsers
            deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        localStorage.setItem(key, deviceId);
    }
    return deviceId;
}

function getPreviousSessionId(): number | null {
    const sid = sessionStorage.getItem('analytics_session_id');
    return sid ? parseInt(sid) : null;
}

function setSessionId(id: number) {
    sessionStorage.setItem('analytics_session_id', id.toString());
}

export async function startVisit(): Promise<UserSession | null> {
    try {
        const token = getAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const deviceId = getOrCreateDeviceId();
        const previousSessionId = getPreviousSessionId();

        const res = await fetch('/api/analytics/visit', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                user_agent: navigator.userAgent,
                device_id: deviceId,
                previous_session_id: previousSessionId
            })
        });

        if (!res.ok) return null;
        const session = await res.json();
        
        // Update session storage
        if (session && session.id) {
            setSessionId(session.id);
        }
        
        return session;
    } catch (e) {
        console.error("Failed to start analytics session", e);
        return null;
    }
}

export async function sendHeartbeat(sessionId: number, durationSeconds: number, useKeepalive = false): Promise<boolean> {
    try {
        const url = `/api/analytics/heartbeat/${sessionId}`;
        const data = { duration_seconds: durationSeconds };
        
        const init: RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        if (useKeepalive) {
            init.keepalive = true;
        }

        const res = await fetch(url, init);
        return res.ok;
    } catch (e) {
        console.error("Failed to send heartbeat", e);
        return false;
    }
}
