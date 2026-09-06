<script lang="ts">
	import { onMount } from 'svelte';
	import type { Fanqie } from '$lib/data/types';
	import { 資料 } from 'tshet-uinh';
	import Input from '$lib/components/Input.svelte';

	let query = $state('');

	const { query字頭 } = 資料;
	function getFanqie(hanja) {
		const [result] = query字頭(hanja);
		return result?.反切;
	}

	let searchResult = $derived(
		query.split('').map((letter) => {
			if (letter.length === 0) return { hanja: '', fanqie: '', reading: '' };

			const hanja = letter[0];
			const fanqie = getFanqie(hanja);

			if (!fanqie) return { hanja, fanqie: '', reading: '' };

			const reading = fanqie
				.split('')
				.map((letter) => fanqies.find((f) => f.fanqie === letter)?.reading ?? '-')
				.join('');

			return { hanja, fanqie, reading };
		})
	);

	let fanqies = $state<Fanqie[]>([]);
	let selected = $state<Fanqie | null>(null);

	let isNew = $state(false);

	let showOtp = $state(false);
	let deleteMode = $state(false);

	let otp = $state('');
	let error = $state('');

	async function loadFanqie() {
		const response = await fetch('/api/fanqie');

		if (!response.ok) {
			error = '반절 목록을 불러오지 못했습니다.';
			return;
		}

		fanqies = await response.json();

		if (!selected && fanqies.length > 0) {
			selected = { ...fanqies[0] };
		}
	}

	function selectFanqie(fanqie: Fanqie) {
		selected = { ...fanqie };
		isNew = false;
		error = '';
	}

	function createNewFanqie() {
		selected = {
			id: 0,
			fanqie: '',
			shengmu: true,
			reading: '',
			created_at: '',
			updated_at: ''
		};

		isNew = true;
		error = '';
	}

	function requestSave() {
		if (!selected) return;

		deleteMode = false;
		otp = '';
		error = '';
		showOtp = true;
	}

	function requestDelete() {
		if (!selected || isNew) return;

		deleteMode = true;
		otp = '';
		error = '';
		showOtp = true;
	}

	function closeOtp() {
		showOtp = false;
		deleteMode = false;
		otp = '';
	}

	async function saveFanqie() {
		if (!selected) return;

		const url = isNew ? '/api/fanqie' : `/api/fanqie/${selected.id}`;

		const method = isNew ? 'POST' : 'PATCH';

		const response = await fetch(url, {
			method,
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				fanqie: selected.fanqie,
				shengmu: selected.shengmu,
				reading: selected.reading,
				otp
			})
		});

		if (!response.ok) {
			const result = await response.json().catch(() => null);

			error = result?.error ?? '저장하지 못했습니다.';
			otp = '';

			return;
		}

		const previousId = selected.id;
		const previousFanqie = selected.fanqie;

		showOtp = false;
		deleteMode = false;
		otp = '';
		isNew = false;

		await loadFanqie();

		if (previousId !== 0) {
			const refreshed = fanqies.find((fanqie) => fanqie.id === previousId);

			if (refreshed) {
				selected = { ...refreshed };
			}
		} else {
			const created = [...fanqies].reverse().find((fanqie) => fanqie.fanqie === previousFanqie);

			if (created) {
				selected = { ...created };
			}
		}
	}

	async function deleteFanqie() {
		if (!selected || isNew) return;

		const response = await fetch(`/api/fanqie/${selected.id}`, {
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

		await loadFanqie();

		if (fanqies.length > 0) {
			selected = { ...fanqies[0] };
		}
	}

	async function confirmOtp() {
		if (deleteMode) {
			await deleteFanqie();
			return;
		}

		await saveFanqie();
	}

	onMount(() => {
		loadFanqie();
	});
</script>

<svelte:head>
	<title>반절 관리</title>
</svelte:head>

<h1>반절 관리</h1>

<Input type="text" placeholder="독법 검색" bind:value={query} />
{#if query.length > 0}
	<ol>
		{#each searchResult as result}
			<li>
				<strong>{result.hanja}</strong> - {result.fanqie} / {result.reading}
			</li>
		{/each}
	</ol>
{/if}

<button type="button" onclick={createNewFanqie}> 새 반절 </button>

{#if fanqies.length > 0}
	<ul>
		{#each fanqies as fanqie}
			<li>
				<button type="button" onclick={() => selectFanqie(fanqie)}>
					{fanqie.fanqie}
					/
					{fanqie.reading}
					/
					{fanqie.shengmu ? '성모' : '운모'}
				</button>
			</li>
		{/each}
	</ul>
{:else}
	<p>등록된 반절이 없습니다.</p>
{/if}

{#if selected}
	<section>
		<label>
			반절 문자
			<input bind:value={selected.fanqie} />
		</label>

		<label>
			읽기
			<input bind:value={selected.reading} />
		</label>

		<fieldset>
			<legend>종류</legend>

			<label>
				<input
					type="radio"
					name="shengmu"
					checked={selected.shengmu}
					onchange={() => {
						if (selected) {
							selected.shengmu = true;
						}
					}}
				/>
				성모
			</label>

			<label>
				<input
					type="radio"
					name="shengmu"
					checked={!selected.shengmu}
					onchange={() => {
						if (selected) {
							selected.shengmu = false;
						}
					}}
				/>
				운모
			</label>
		</fieldset>

		<button type="button" onclick={requestSave}>
			{isNew ? '추가' : '저장'}
		</button>

		{#if !isNew}
			<button type="button" onclick={requestDelete}> 삭제 </button>
		{/if}
	</section>
{/if}

{#if error}
	<p>{error}</p>
{/if}

{#if showOtp}
	<div>
		<p>
			{deleteMode ? '삭제하려면 OTP를 입력하세요.' : '저장하려면 OTP를 입력하세요.'}
		</p>

		<form>
			<input
				bind:value={otp}
				type="text"
				inputmode="numeric"
				autocomplete="one-time-code"
				maxlength="6"
				placeholder="000000"
			/>

			<button type="submit" onclick={confirmOtp}> 확인 </button>
		</form>
		<button type="button" onclick={closeOtp}> 취소 </button>
	</div>
{/if}
