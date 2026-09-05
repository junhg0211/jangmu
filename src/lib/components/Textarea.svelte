<script lang="ts">
	import { oninput } from './input';
	let { value = $bindable(), ...restProps } = $props();
</script>

<textarea {...restProps} bind:value {oninput} />
