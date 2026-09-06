<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style>
		body,
		input,
		textarea,
		select,
		button {
			font-family: 'Jangmu Kana', sans-serif;
		}

		@font-face {
			font-family: 'Jangmu Kana';
			src: url('/fonts/JangmuKana-Regular.woff2') format('woff2');
			font-weight: normal;
			font-style: normal;
		}
	</style>
</svelte:head>

{@render children()}
<div>
	<a href="/">홈</a>
	<a href="/fanqie">반절</a>
</div>
