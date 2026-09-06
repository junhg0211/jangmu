<script lang="ts">
	import Autocomplete from './Autocomplete.svelte';
	import { createAutocomplete } from './autocompleteLogic.svelte';

	let { value = $bindable(), ...restProps } = $props();

	let element: HTMLInputElement;

	const autocomplete = createAutocomplete(
		() => element,
		(v) => (value = v),
		{ allowEnter: true }
	);
</script>

<input
	{...restProps}
	bind:this={element}
	bind:value
	oninput={autocomplete.handleInput}
	onkeydown={autocomplete.handleKeydown}
/>

<Autocomplete
	words={autocomplete.suggestions}
	selected={autocomplete.selectedIndex}
	onselect={autocomplete.select}
/>
