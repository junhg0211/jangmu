<script lang="ts">
	import Autocomplete from './Autocomplete.svelte';
	import { createAutocomplete } from './autocompleteLogic.svelte';

	let { value = $bindable(), ...restProps } = $props();

	let element: HTMLTextAreaElement;

	const autocomplete = createAutocomplete(
		() => element,
		(v) => (value = v),
		{ allowEnter: false }
	);
</script>

<textarea
	{...restProps}
	bind:this={element}
	bind:value
	oninput={autocomplete.handleInput}
	onkeydown={autocomplete.handleKeydown}></textarea>

<Autocomplete
	words={autocomplete.suggestions}
	selected={autocomplete.selectedIndex}
	onselect={autocomplete.select}
/>
