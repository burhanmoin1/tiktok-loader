import { apiFetchWithAuth } from '$lib/api/client';

export async function fetchTeacherList() {
	const response = await apiFetchWithAuth('/teacher/');
	if (!response.ok) {
		throw new Error('Failed to load teacher');
	}
	return response.json();
}
