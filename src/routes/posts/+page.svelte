<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { isAuthenticated, loginWithPassword, logout as authLogout, initAuthFromStorage } from '$lib/stores/auth';
	import {
		posts,
		status,
		loadPosts,
		createPost as createPostAction,
		deletePost as deletePostAction,
	} from '$lib/features/posts/store';

	let username = '';
	let password = '';
	let title = '';
	let body = '';

	async function handleLogin() {
		status.set('');
		try {
			await loginWithPassword(username, password);
			status.set('Logged in');
			await loadPosts();
		} catch (error) {
			status.set('Login failed');
		}
	}

	async function handleCreatePost() {
		await createPostAction(title, body);
		title = '';
		body = '';
	}

	async function handleDeletePost(id: number) {
		await deletePostAction(id);
	}

	function logout() {
		authLogout();
		posts.set([]);
		status.set('Logged out');
	}

	onMount(async () => {
		initAuthFromStorage();
		if (get(isAuthenticated)) {
			await loadPosts();
		}
	});
</script>

<main class="min-h-screen bg-slate-950 text-slate-50">
	<div class="max-w-3xl mx-auto py-10 space-y-8">
		<h1 class="text-3xl font-bold">Posts demo</h1>
		<p class="text-sm text-slate-300">
			Simple CRUD example using Django REST framework, JWT auth and SvelteKit proxy.
		</p>

		<section class="space-y-4 border border-slate-800 rounded-lg p-4">
			<header class="flex items-center justify-between">
				<h2 class="font-semibold">Auth</h2>
				{#if $isAuthenticated}
					<button
						class="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-xs font-medium"
						on:click={logout}
					>
						Log out
					</button>
				{/if}
			</header>

			<div class="grid gap-3 sm:grid-cols-2">
				<label class="flex flex-col gap-1 text-sm">
					<span>Username</span>
					<input
						class="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
						bind:value={username}
						autocomplete="username"
					/>
				</label>
				<label class="flex flex-col gap-1 text-sm">
					<span>Password</span>
					<input
						type="password"
						class="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
						bind:value={password}
						autocomplete="current-password"
					/>
				</label>
			</div>

			<button
				class="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-sm font-medium"
				on:click={handleLogin}
			>
				Log in and load posts
			</button>

			{#if $status}
				<p class="text-xs text-slate-300">{$status}</p>
			{/if}
		</section>

		<section class="space-y-4 border border-slate-800 rounded-lg p-4">
			<h2 class="font-semibold">Create post</h2>
			<div class="space-y-3">
				<label class="flex flex-col gap-1 text-sm">
					<span>Title</span>
					<input
						class="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
						bind:value={title}
					/>
				</label>
				<label class="flex flex-col gap-1 text-sm">
					<span>Body</span>
					<textarea
						class="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm min-h-[120px]"
						bind:value={body}
					></textarea>
				</label>
				<button
					class="px-4 py-2 rounded bg-sky-500 hover:bg-sky-600 text-sm font-medium"
					on:click={handleCreatePost}
				>
					Save post
				</button>
			</div>
		</section>

		<section class="space-y-4 border border-slate-800 rounded-lg p-4">
			<h2 class="font-semibold">Your posts</h2>
			{#if $posts.length === 0}
				<p class="text-sm text-slate-300">No posts yet.</p>
			{:else}
				<ul class="space-y-3">
					{#each $posts as post}
						<li class="border border-slate-800 rounded-lg p-3 flex flex-col gap-2">
							<div class="flex items-start justify-between gap-3">
								<div>
									<h3 class="font-semibold">{post.title}</h3>
									<p class="text-xs text-slate-400">
										by {post.owner_username} • {new Date(post.created_at).toLocaleString()}
									</p>
								</div>
								<button
									class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs"
									on:click={() => handleDeletePost(post.id)}
								>
									Delete
								</button>
							</div>
							<p class="text-sm whitespace-pre-line">{post.body}</p>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
</main>
