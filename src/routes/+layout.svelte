<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { authState } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { startVisit, sendHeartbeat } from '$lib/features/analytics/api';
	import type { UserSession } from '$lib/features/analytics/api';

	let { children, data } = $props();

	// Analytics
	let sessionId: number | null = null;
	let startTime: number = Date.now();
	let heartbeatInterval: any;

	function handleVisibilityChange() {
        if (document.visibilityState === 'hidden' && sessionId) {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            sendHeartbeat(sessionId, duration);
        }
    }

	onMount(async () => {
		if (!browser) return;

		// Start session
		const session = await startVisit();
		if (session) {
			sessionId = session.id;
			
			// Send heartbeat every 60 seconds (optimized for reduced load)
			heartbeatInterval = setInterval(() => {
				if (sessionId) {
					const duration = Math.floor((Date.now() - startTime) / 1000);
					sendHeartbeat(sessionId, duration);
				}
			}, 60000);

            // Handle visibility change (tab switch/minimize)
            document.addEventListener('visibilitychange', handleVisibilityChange);
		}
	});

	onDestroy(() => {
		if (browser) {
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
			
			// Try one last update with keepalive=true for reliability on unload
			if (sessionId) {
				const duration = Math.floor((Date.now() - startTime) / 1000);
				sendHeartbeat(sessionId, duration, true);
			}
		}
	});

	// Sync authState with server data on the client
	$effect(() => {
		if (browser && data.user) {
			authState.set(data.user);
		} else if (browser) {
			authState.set({ username: null });
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
