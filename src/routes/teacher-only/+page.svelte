<script lang="ts">
	import { requireRole } from '$lib/auth/guards';
	import { authState, logout } from '$lib/stores/auth';

	export function load() {
		requireRole('teacher');
	}
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-50">
	<div class="p-8 bg-slate-800 rounded-lg shadow-xl text-center space-y-6">
		<h1 class="text-4xl font-bold text-emerald-400">Teacher Only Area</h1>
		<p class="text-lg text-slate-300">
			Welcome, <span class="font-semibold text-white">{$authState.username}</span>!
		</p>
		<p class="text-slate-400">
			You are seeing this page because you have the <span class="font-mono bg-slate-700 px-1 rounded">teacher</span> role.
		</p>
		
		<div class="pt-4">
			<a href="/" class="text-emerald-400 hover:text-emerald-300 underline">Go back home</a>
		</div>
	</div>
</main>
