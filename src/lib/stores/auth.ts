import { derived, writable } from 'svelte/store';
import { login, clearTokens, getAccessToken, getAccessTokenPayload } from '$lib/api/client';

type AuthState = {
	username: string | null;
};

const authState = writable<AuthState>({
	username: null,
});

const isAuthenticated = derived(authState, () => !!getAccessToken());

async function loginWithPassword(username: string, password: string) {
	await login(username, password);
	authState.set({ username });
}

function logout() {
	clearTokens();
	authState.set({ username: null });
}

function initAuthFromStorage() {
	const token = getAccessToken();
	if (!token) {
		authState.set({ username: null });
		return;
	}

	// Try to get username from payload if not in store
	const payload = getAccessTokenPayload();
	const username = payload?.username as string | undefined;

	authState.update((current) => {
		return {
			username: current.username || username || 'User', // Fallback to 'User' if no username found
		};
	});
}

export { authState, isAuthenticated, loginWithPassword, logout, initAuthFromStorage };
