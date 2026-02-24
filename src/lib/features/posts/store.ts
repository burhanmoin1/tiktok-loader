import { writable } from 'svelte/store';
import type { Post } from './types';
import { fetchPosts, createPostRequest, deletePostRequest } from './api';

const posts = writable<Post[]>([]);
const status = writable('');

async function loadPosts() {
	status.set('');
	try {
		const data = await fetchPosts();
		posts.set(data);
	} catch (error) {
		status.set('Failed to load posts');
	}
}

async function createPost(title: string, body: string) {
	status.set('');
	try {
		await createPostRequest({ title, body });
		await loadPosts();
	} catch (error) {
		status.set('Failed to create post');
	}
}

async function deletePost(id: number) {
	status.set('');
	try {
		await deletePostRequest(id);
		await loadPosts();
	} catch (error) {
		status.set('Failed to delete post');
	}
}

export { posts, status, loadPosts, createPost, deletePost };
