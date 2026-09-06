<script lang="ts">
	import type { Suggestion } from './input';

	let {
		words,
		selected = 0,
		onselect
	}: {
		words: Suggestion[];
		selected?: number;
		onselect: (suggestion: Suggestion) => void;
	} = $props();
</script>

{#if words.length > 0}
	<div>
		{#each words as suggestion, index}
			<button
				type="button"
				aria-current={index === selected}
				onmousedown={(e) => {
					e.preventDefault();
					onselect(suggestion);
				}}
			>
				{suggestion.display}
			</button>
		{/each}
	</div>
{/if}
