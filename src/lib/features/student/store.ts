import { writable } from 'svelte/store';
import type { StudentItem } from './types';
import { fetchStudentList } from './api';

const items = writable<StudentItem[]>([]);
const isLoading = writable(false);
const error = writable<string | null>(null);

async function loadStudentList() {
	isLoading.set(true);
	error.set(null);
	try {
		const data = await fetchStudentList();
		items.set(data);
	} catch (err) {
		error.set('Failed to load student');
	} finally {
		isLoading.set(false);
	}
}

export { items, isLoading, error, loadStudentList };
