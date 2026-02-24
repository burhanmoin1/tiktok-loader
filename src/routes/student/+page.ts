import { requireRole } from '$lib/auth/guards';

export function load() {
	requireRole('student');
}
