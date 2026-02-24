<script lang="ts">
	import { authState } from '$lib/stores/auth';
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-50">
	<div class="p-8 bg-slate-800 rounded-lg shadow-xl text-center space-y-6">
		<h1 class="text-4xl font-bold text-teal-400">Student Only Area</h1>
		<p class="text-lg text-slate-300">
			Welcome, <span class="font-semibold text-white">{$authState.username}</span>!
		</p>
		<p class="text-slate-400">
			You are seeing this page because you have the <span class="font-mono bg-slate-700 px-1 rounded">student</span> role.
		</p>
		
		<div class="pt-4">
			<a href="/" class="text-teal-400 hover:text-teal-300 underline">Go back home</a>
		</div>
	</div>
</main>
