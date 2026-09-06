const MT = {
	A: String.fromCharCode(0 + 0xe300),
	I: String.fromCharCode(1 + 0xe300),
	U: String.fromCharCode(2 + 0xe300),
	E: String.fromCharCode(3 + 0xe300),
	O: String.fromCharCode(4 + 0xe300),
	KA: String.fromCharCode(5 + 0xe300),
	CHI: String.fromCharCode(6 + 0xe300),
	KU: String.fromCharCode(7 + 0xe300),
	KE: String.fromCharCode(8 + 0xe300),
	KO: String.fromCharCode(9 + 0xe300),
	GA: '',
	ZHI: '',
	GU: '',
	GE: '',
	GO: '',
	HA: String.fromCharCode(10 + 0xe300),
	HI: String.fromCharCode(11 + 0xe300),
	HU: String.fromCharCode(12 + 0xe300),
	HE: String.fromCharCode(13 + 0xe300),
	HO: String.fromCharCode(14 + 0xe300),
	RHA: '',
	RHI: '',
	RHU: '',
	RHE: '',
	RHO: '',
	NGA: String.fromCharCode(15 + 0xe300),
	NGI: String.fromCharCode(16 + 0xe300),
	NGU: String.fromCharCode(17 + 0xe300),
	NGE: String.fromCharCode(18 + 0xe300),
	NGO: String.fromCharCode(19 + 0xe300),
	YA: String.fromCharCode(20 + 0xe300),
	YI: String.fromCharCode(21 + 0xe300),
	YU: String.fromCharCode(22 + 0xe300),
	YE: String.fromCharCode(23 + 0xe300),
	YO: String.fromCharCode(24 + 0xe300),
	SLA: String.fromCharCode(25 + 0xe300),
	SLI: String.fromCharCode(26 + 0xe300),
	SLU: String.fromCharCode(27 + 0xe300),
	SLE: String.fromCharCode(28 + 0xe300),
	SLO: String.fromCharCode(29 + 0xe300),
	ZLA: '',
	ZLI: '',
	ZLU: '',
	ZLE: '',
	ZLO: '',
	SA: String.fromCharCode(30 + 0xe300),
	SI: String.fromCharCode(31 + 0xe300),
	SU: String.fromCharCode(32 + 0xe300),
	SE: String.fromCharCode(33 + 0xe300),
	SO: String.fromCharCode(34 + 0xe300),
	ZA: '',
	ZI: '',
	ZU: '',
	ZE: '',
	ZO: '',
	TA: String.fromCharCode(35 + 0xe300),
	TSI: String.fromCharCode(36 + 0xe300),
	TU: String.fromCharCode(37 + 0xe300),
	TE: String.fromCharCode(38 + 0xe300),
	TO: String.fromCharCode(39 + 0xe300),
	DA: '',
	DZI: '',
	DU: '',
	DE: '',
	DO: '',
	NA: String.fromCharCode(40 + 0xe300),
	NI: String.fromCharCode(41 + 0xe300),
	NU: String.fromCharCode(42 + 0xe300),
	NE: String.fromCharCode(43 + 0xe300),
	NO: String.fromCharCode(44 + 0xe300),
	LA: String.fromCharCode(45 + 0xe300),
	LI: String.fromCharCode(46 + 0xe300),
	LU: String.fromCharCode(47 + 0xe300),
	LE: String.fromCharCode(48 + 0xe300),
	LO: String.fromCharCode(49 + 0xe300),
	RA: String.fromCharCode(50 + 0xe300),
	RI: String.fromCharCode(51 + 0xe300),
	RU: String.fromCharCode(52 + 0xe300),
	RE: String.fromCharCode(53 + 0xe300),
	RO: String.fromCharCode(54 + 0xe300),
	FA: String.fromCharCode(55 + 0xe300),
	FI: String.fromCharCode(56 + 0xe300),
	FU: String.fromCharCode(57 + 0xe300),
	FE: String.fromCharCode(58 + 0xe300),
	FO: String.fromCharCode(59 + 0xe300),
	VA: '',
	VI: '',
	VU: '',
	VE: '',
	VO: '',
	PA: String.fromCharCode(60 + 0xe300),
	PI: String.fromCharCode(61 + 0xe300),
	PU: String.fromCharCode(62 + 0xe300),
	PE: String.fromCharCode(63 + 0xe300),
	PO: String.fromCharCode(64 + 0xe300),
	BA: '',
	BI: '',
	BU: '',
	BE: '',
	BO: '',
	MA: String.fromCharCode(65 + 0xe300),
	MI: String.fromCharCode(66 + 0xe300),
	MU: String.fromCharCode(67 + 0xe300),
	ME: String.fromCharCode(68 + 0xe300),
	MO: String.fromCharCode(69 + 0xe300),
	NGG: String.fromCharCode(70 + 0xe300),
	NN: String.fromCharCode(71 + 0xe300),
	LL: String.fromCharCode(72 + 0xe300),
	MM: String.fromCharCode(73 + 0xe300),
	'?': '？',
	'!': '！',
	'.': '。',
	',': '，',
	'\\': '、',
	';': '；',
	':': '：',
	'(': '（',
	')': '）',
	'“': '「',
	'‘': '『',
	'”': '」',
	'’': '』',
	'~': '〜',
	' ': '　',
	'-': 'ー',
	'/': '・'
};

export type TextControl = HTMLInputElement | HTMLTextAreaElement;

export type DictionaryWord = {
	id: number;
	word: string;
	pronunciation: string;
	pos: string;
	meaning: string;
	etymology: string;
};

export function getCurrentWord(target: TextControl) {
	const cursor = target.selectionStart ?? 0;
	const before = target.value.slice(0, cursor);

	const match = before.match(/[^\s　。、，！？；：（）「」『』]+$/);

	return match?.[0] ?? '';
}

export function getSuggestions(query: string): Suggestion[] {
	if (!query || typeof localStorage === 'undefined') {
		return [];
	}

	try {
		const words = JSON.parse(localStorage.getItem('words') ?? '[]') as DictionaryWord[];

		const suggestions: Suggestion[] = [];

		for (const entry of words) {
			const { wordPart, pronunciationPart, suffix } = getConversionParts(entry);

			// PAGE까지 전부 입력한 경우
			if (query.endsWith(entry.pronunciation)) {
				suggestions.push({
					entry,
					display: entry.word,
					matched: entry.pronunciation
				});

				continue;
			}

			// 이미 표기 자체를 입력한 경우
			if (query.endsWith(entry.word)) {
				suggestions.push({
					entry,
					display: entry.word,
					matched: entry.word
				});

				continue;
			}

			// 한자 부분의 발음만 입력
			// PA → 旨
			if (pronunciationPart && query.endsWith(pronunciationPart)) {
				suggestions.push({
					entry,
					display: wordPart,
					matched: pronunciationPart
				});
			}
		}

		return suggestions.slice(0, 10);
	} catch {
		return [];
	}
}

function getCommonSuffixLength(a: string, b: string) {
	let length = 0;

	while (
		length < a.length &&
		length < b.length &&
		a[a.length - 1 - length] === b[b.length - 1 - length]
	) {
		length++;
	}

	return length;
}

function getConversionParts(entry: DictionaryWord) {
	const suffixLength = getCommonSuffixLength(entry.word, entry.pronunciation);

	if (suffixLength === 0) {
		return {
			wordPart: entry.word,
			pronunciationPart: entry.pronunciation,
			suffix: ''
		};
	}

	return {
		wordPart: entry.word.slice(0, -suffixLength),
		pronunciationPart: entry.pronunciation.slice(0, -suffixLength),
		suffix: entry.word.slice(-suffixLength)
	};
}

export type Suggestion = {
	entry: DictionaryWord;
	display: string;
	matched: string;
};

export function applySuggestion(target: TextControl, suggestion: Suggestion) {
	const cursor = target.selectionStart ?? 0;

	const before = target.value.slice(0, cursor);
	const after = target.value.slice(cursor);

	const { entry, matched } = suggestion;

	const { wordPart, pronunciationPart } = getConversionParts(entry);

	let replacement: string;

	if (matched === entry.pronunciation) {
		// PAGE → 旨GE
		replacement = entry.word;
	} else if (matched === pronunciationPart) {
		// PA → 旨
		replacement = wordPart;
	} else {
		replacement = entry.word;
	}

	const start = cursor - matched.length;

	target.value = before.slice(0, start) + replacement + after;

	const newCursor = start + replacement.length;

	target.selectionStart = newCursor;
	target.selectionEnd = newCursor;
}

export function transformInput(e: Event & { currentTarget: TextControl }) {
	const inputEvent = e as unknown as InputEvent;
	const target = e.currentTarget;

	// 한국어/일본어/중국어 IME 조합 중에는 건드리지 않기
	if (inputEvent.isComposing) {
		return;
	}

	if (!inputEvent.data) {
		return;
	}

	const cursor = target.selectionStart ?? 0;
	const previous = target.value.slice(0, cursor);
	const next = target.value.slice(cursor);

	if (inputEvent.data === "'") {
		const charCode = previous.charCodeAt(previous.length - 2);

		if (MT.A.charCodeAt(0) <= charCode && charCode <= MT.MO.charCodeAt(0)) {
			target.value = previous.slice(0, -2) + String.fromCharCode(charCode + 74) + next;

			target.selectionStart = target.selectionEnd = cursor - 1;

			return;
		}

		if (MT.A.charCodeAt(0) + 74 <= charCode && charCode <= MT.MO.charCodeAt(0) + 74) {
			target.value = previous.slice(0, -2) + String.fromCharCode(charCode + 70) + next;

			target.selectionStart = target.selectionEnd = cursor - 1;

			return;
		}

		if (MT.A.charCodeAt(0) + 144 <= charCode && charCode <= MT.MO.charCodeAt(0) + 144) {
			target.value = previous.slice(0, -2) + String.fromCharCode(charCode + 70) + next;

			target.selectionStart = target.selectionEnd = cursor - 1;

			return;
		}
	}

	for (const [key, value] of Object.entries(MT).sort((a, b) => b[0].length - a[0].length)) {
		if (!previous.endsWith(key)) continue;

		target.value = previous.slice(0, -key.length) + value + next;

		const newCursor = previous.length - key.length + value.length;

		target.selectionStart = newCursor;
		target.selectionEnd = newCursor;

		return;
	}
}
