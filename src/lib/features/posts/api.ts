import { apiFetchWithAuth } from '$lib/api/client';
import type { Post } from './types';

export async function fetchPosts() {
	const response = await apiFetchWithAuth('/posts/');
	if (!response.ok) {
		throw new Error('Failed to load posts');
	}
	const data = await response.json();
	return data as Post[];
}

export async function createPostRequest(input: { title: string; body: string }) {
	const response = await apiFetchWithAuth('/posts/', {
		method: 'POST',
		body: input,
	});
	if (!response.ok) {
		throw new Error('Failed to create post');
	}
	const data = await response.json();
	return data as Post;
}

export async function deletePostRequest(id: number) {
	const response = await apiFetchWithAuth(`/posts/${id}/`, {
		method: 'DELETE',
	});
	if (!response.ok && response.status !== 204) {
		throw new Error('Failed to delete post');
	}
}

