<script lang="ts">
	import type { DictionaryWord } from './input';

	let { value }: { value: string } = $props();

	function getWord(id: number): DictionaryWord | undefined {
		if (typeof localStorage === 'undefined') return;

		const words = JSON.parse(localStorage.getItem('words') ?? '[]') as DictionaryWord[];

		return words.find((word) => word.id === id);
	}

	function parse(text: string) {
		const parts: ({ type: 'text'; value: string } | { type: 'word'; id: number })[] = [];

		let lastIndex = 0;

		for (const match of text.matchAll(/#(\d+)/g)) {
			const index = match.index ?? 0;

			if (index > lastIndex) {
				parts.push({
					type: 'text',
					value: text.slice(lastIndex, index)
				});
			}

			parts.push({
				type: 'word',
				id: Number(match[1])
			});

			lastIndex = index + match[0].length;
		}

		if (lastIndex < text.length) {
			parts.push({
				type: 'text',
				value: text.slice(lastIndex)
			});
		}

		return parts;
	}
</script>

{#each parse(value) as part}
	{#if part.type === 'text'}
		{part.value}
	{:else}
		{@const word = getWord(part.id)}

		{#if word}
			<a href={`/?word=${word.id}`}>
				{word.word}
			</a>
		{:else}
			<span>#{part.id}</span>
		{/if}
	{/if}
{/each}
