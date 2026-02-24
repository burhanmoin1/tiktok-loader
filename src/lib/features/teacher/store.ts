import { writable } from 'svelte/store';
import type { TeacherItem } from './types';
import { fetchTeacherList } from './api';

const items = writable<TeacherItem[]>([]);
const isLoading = writable(false);
const error = writable<string | null>(null);

async function loadTeacherList() {
	isLoading.set(true);
	error.set(null);
	try {
		const data = await fetchTeacherList();
		items.set(data);
	} catch (err) {
		error.set('Failed to load teacher');
	} finally {
		isLoading.set(false);
	}
}

export { items, isLoading, error, loadTeacherList };
