// autocomplete.ts
import {
	applySuggestion,
	getCurrentWord,
	getSuggestions,
	transformInput,
	type Suggestion,
	type TextControl
} from './input';

export function createAutocomplete<T extends TextControl>(
	getElement: () => T,
	setValue: (value: string) => void,
	options?: {
		allowEnter?: boolean;
	}
) {
	let suggestions = $state<Suggestion[]>([]);
	let selectedIndex = $state(0);

	function updateSuggestions() {
		const element = getElement();
		const query = getCurrentWord(element);

		suggestions = getSuggestions(query);
		selectedIndex = 0;
	}

	function handleInput(e: Event & { currentTarget: T }) {
		transformInput(e);

		setValue(e.currentTarget.value);
		updateSuggestions();
	}

	function select(suggestion: Suggestion) {
		const element = getElement();

		applySuggestion(element, suggestion);

		setValue(element.value);
		suggestions = [];

		element.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (suggestions.length === 0) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % suggestions.length;
			return;
		}

		if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
			return;
		}

		if (e.key === 'Tab') {
			e.preventDefault();
			select(suggestions[selectedIndex]);
			return;
		}

		if (options?.allowEnter && e.key === 'Enter') {
			e.preventDefault();
			select(suggestions[selectedIndex]);
			return;
		}

		if (e.key === 'Escape') {
			suggestions = [];
		}
	}

	return {
		get suggestions() {
			return suggestions;
		},
		get selectedIndex() {
			return selectedIndex;
		},
		handleInput,
		handleKeydown,
		select
	};
}
