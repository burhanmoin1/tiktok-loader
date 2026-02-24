import { apiFetchWithAuth } from '$lib/api/client';

export async function fetchStudentList() {
	const response = await apiFetchWithAuth('/student/');
	if (!response.ok) {
		throw new Error('Failed to load student');
	}
	return response.json();
}
