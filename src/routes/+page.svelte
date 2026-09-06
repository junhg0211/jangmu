<script lang="ts">
	import { onMount } from 'svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';

	type Word = {
		id: number;
		word: string;
		pronunciation: string;
		pos: string;
		meaning: string;
		etymology: string;
	};

	let words = $state<Word[]>([]);
	let selected = $state<Word | null>(null);

	let loading = $state(true);
	let otp = $state('');
	let showOtp = $state(false);
	let error = $state('');
	let isNew = $state(false);
	let search = $state('');
	let deleteMode = $state(false);

	let filteredWords = $derived(
		words.filter((word) => {
			const q = search.trim().toLowerCase();

			if (!q) return true;

			return (
				word.id == q ||
				word.word.toLowerCase().includes(q) ||
				word.pronunciation.toLowerCase().includes(q) ||
				word.pos.toLowerCase().includes(q) ||
				word.meaning.toLowerCase().includes(q) ||
				word.etymology.toLowerCase().includes(q)
			);
		})
	);

	async function loadWords() {
		loading = true;

		const response = await fetch('/api/words');

		if (!response.ok) {
			error = '단어 목록을 불러오지 못했습니다.';
			loading = false;
			return;
		}

		words = await response.json();
		loading = false;

		localStorage.setItem('words', JSON.stringify(words));
	}

	function selectWord(word: Word) {
		selected = { ...word };
		error = '';
	}

	function requestDelete() {
		if (!selected) return;

		otp = '';
		error = '';
		showOtp = true;
		deleteMode = true;
	}

	async function deleteWord() {
		if (!selected) return;

		const response = await fetch(`/api/words/${selected.id}`, {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				otp
			})
		});

		if (!response.ok) {
			const result = await response.json().catch(() => null);

			error = result?.error ?? '삭제하지 못했습니다.';
			otp = '';

			return;
		}

		showOtp = false;
		deleteMode = false;
		otp = '';
		selected = null;

		await loadWords();

		if (words.length > 0) {
			selected = { ...words[0] };
		}
	}

	function requestSave() {
		if (!selected) return;

		otp = '';
		error = '';
		showOtp = true;
	}

	function closeOtp() {
		showOtp = false;
		deleteMode = false;
		otp = '';
	}

	async function saveWord() {
		if (!selected) return;

		const url = isNew ? '/api/words' : `/api/words/${selected.id}`;

		const method = isNew ? 'POST' : 'PATCH';

		const response = await fetch(url, {
			method,
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				...selected,
				otp
			})
		});

		if (!response.ok) {
			const result = await response.json().catch(() => null);
			error = result?.error ?? '저장하지 못했습니다.';
			otp = '';
			return;
		}

		showOtp = false;
		otp = '';
		isNew = false;

		await loadWords();

		const refreshed = words.find((word) => word.word === selected?.word);

		if (refreshed) {
			selected = { ...refreshed };
		}
	}

	function createNewWord() {
		selected = {
			id: 0,
			word: '',
			pronunciation: '',
			pos: '',
			meaning: '',
			etymology: ''
		};

		isNew = true;
		error = '';
	}

	function downloadFont() {
		const link = document.createElement('a');
		link.href = '/fonts/JangmuKana-Regular.ttf';
		link.download = 'JangmuKana-Regular.ttf';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	onMount(() => {
		loadWords();
	});
</script>

<svelte:head>
	<title>장무</title>
</svelte:head>

<div style="max-width: 600px; margin: 0 auto;">
	<div style="margin-bottom: 16px;">
		<div>
			<h1>장무</h1>
			<p>
				<button onclick={downloadFont}>폰트 다운로드</button>
				<button onclick={createNewWord}>새 단어</button>
				<button onclick={selectWord(null)}>선택 해제</button>
				<Input bind:value={search} placeholder="검색" />
			</p>
		</div>
		{#if search.length > 0}
			<p>검색 결과: {filteredWords.length}개</p>
			<div>
				{#if loading}
					<p>단어 불러오는 중...</p>
				{:else}
					<table style="width: 100%; border-collapse: collapse;">
						<thead>
							<tr style="border-top: 1px solid black; border-bottom: 1px solid black;">
								<th>ID</th>
								<th>단어</th>
								<th>발음</th>
								<th>품사</th>
								<th>뜻</th>
								<th>어원</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredWords as word}
								<tr
									onclick={() => selectWord(word)}
									style="border-bottom: 1px solid black; cursor: pointer;"
								>
									<td>{word.id}</td>
									<td>{word.word}</td>
									<td>{word.pronunciation}</td>
									<td>{word.pos}</td>
									<td>{word.meaning}</td>
									<td>{word.etymology}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		{/if}
	</div>
	<div>
		{#if selected}
			<div style="display: flex; flex-direction: column; gap: 8px;">
				<label>
					<span>단어</span>
					<Input bind:value={selected.word} />
				</label>
				<label>
					<span>발음</span>
					<Input bind:value={selected.pronunciation} />
				</label>
				<label>
					<span>품사</span>
					<input bind:value={selected.pos} />
				</label>
				<label>
					<span>뜻</span>
					<textarea bind:value={selected.meaning}></textarea>
				</label>
				<label>
					<span>어원</span>
					<textarea bind:value={selected.etymology}></textarea>
				</label>
				<button onclick={requestDelete} disabled={!selected || isNew}> 삭제 </button>
				{#if error}
					<p class="error">{error}</p>
				{/if}
				{#if showOtp}
					<div class="backdrop">
						<div class="dialog">
							<h2>수정 인증</h2>
							<p>변경사항을 저장하려면 OTP를 입력하세요.</p>
							<form>
								<Input
									bind:value={otp}
									type="text"
									inputmode="numeric"
									pattern={`\\d{6}`}
									maxlength="6"
									placeholder="000000"
									autocomplete="one-time-code"
								/>
								<div class="dialog-actions">
									<button onclick={deleteMode ? deleteWord : saveWord} type="submit"> 확인 </button>
								</div>
							</form>
							<button onclick={closeOtp}>취소</button>
						</div>
					</div>
				{/if}
				<div class="actions">
					<button onclick={requestSave}>저장</button>
				</div>
			</div>
		{:else}
			<p>단어를 선택하세요.</p>
		{/if}
		<Textarea style="width: 100%; height: 200px; margin-top: 16px;"></Textarea>
	</div>
</div>
