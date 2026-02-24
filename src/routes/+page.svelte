<script lang="ts">
	import { pingHealth } from '$lib/features/health/api';
	import { loginWithPassword, logout } from '$lib/stores/auth';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	let username = '';
	let password = '';
	let error = '';

	$: user = $page.data.user;

	async function handleLogin() {
		try {
			error = '';
			await loginWithPassword(username, password);
			await invalidateAll();
		} catch (e) {
			error = 'Login failed';
		}
	}

	async function handleLogout() {
		logout();
		await invalidateAll();
	}
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50 space-y-8">
	<div class="text-center space-y-2">
		<h1 class="text-4xl font-bold">Exam checker frontend</h1>
		<p class="text-slate-400">SvelteKit + Tailwind CSS + Django backend proxy.</p>
	</div>

	<div class="w-full max-w-sm p-6 bg-slate-900 rounded-lg border border-slate-800 space-y-6">
		{#if user}
			<div class="space-y-4">
				<div class="p-4 bg-slate-800 rounded">
					<p class="text-sm text-slate-400">Logged in as:</p>
					<p class="font-bold text-lg">{ user.username }</p>
					<p class="text-xs text-slate-500 mt-1">
						Roles: { user.roles.join(', ') || 'None' }
					</p>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<a href="/teacher-only" class="block p-3 text-center bg-indigo-600 hover:bg-indigo-700 rounded text-sm font-medium">
						Teacher Page
					</a>
					<a href="/student-only" class="block p-3 text-center bg-teal-600 hover:bg-teal-700 rounded text-sm font-medium">
						Student Page
					</a>
				</div>

				<button
					class="w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded text-sm font-medium"
					on:click={handleLogout}
				>
					Logout
				</button>
			</div>
		{:else}
			<form class="space-y-4" on:submit|preventDefault={handleLogin}>
				<div class="space-y-2">
					<label for="username" class="text-sm font-medium text-slate-300">Username</label>
					<input
						id="username"
						type="text"
						bind:value={username}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
						placeholder="username"
					/>
				</div>
				<div class="space-y-2">
					<label for="password" class="text-sm font-medium text-slate-300">Password</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
						placeholder="password"
					/>
				</div>
				
				{#if error}
					<p class="text-red-400 text-sm">{error}</p>
				{/if}

				<button
					type="submit"
					class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-medium transition-colors"
				>
					Login
				</button>
			</form>

			<div class="pt-4 border-t border-slate-800 text-xs text-slate-500">
				<p>Test Credentials:</p>
				<ul class="mt-1 space-y-1">
					<li>• admin / password123 (Role: admin)</li>
					<li>• teacher1 / password123 (Role: teacher)</li>
					<li>• student1 / password123 (Role: student)</li>
				</ul>
			</div>
		{/if}
	</div>

	<button
		class="px-4 py-2 rounded text-slate-500 hover:text-slate-300 text-sm"
		on:click={async () => alert(await pingHealth())}
	>
		Ping Health Check
	</button>
</main>
