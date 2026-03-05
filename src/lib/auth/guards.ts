import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { getAccessToken } from '$lib/api/client';

export function requireClientAuth() {
	if (browser && !getAccessToken()) {
		throw redirect(303, '/');
	}
}
