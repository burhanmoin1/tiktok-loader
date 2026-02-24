<script lang="ts">
	import { onMount } from 'svelte';
	import { items, isLoading, error, loadTeacherList } from '$lib/features/teacher';
</script>

<main class="min-h-screen bg-slate-950 text-slate-50">
	<div class="max-w-3xl mx-auto py-10 space-y-6">
		<h1 class="text-3xl font-bold">Teacher</h1>
		<button
			class="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-sm font-medium"
			on:click={() => loadTeacherList()}
		>
			Reload
		</button>
		{#if $isLoading}
			<p class="text-sm text-slate-300">Loading</p>
		{:else if $error}
			<p class="text-sm text-red-400">{$error}</p>
		{:else}
			<ul class="space-y-2">
				{#each $items as item}
					<li class="border border-slate-800 rounded px-3 py-2 text-sm">
						<span>{item.id}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</main>

<svelte:window on:load={() => loadTeacherList()} />
