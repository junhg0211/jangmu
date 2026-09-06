export type Word = {
	id: number;
	word: string;
	pronunciation: string;
	pos: string;
	meaning: string;
	etymology: string;
	created_at: string;
	updated_at: string;
};

export type Fanqie = {
	id: number;
	fanqie: string;
	shengmu: boolean;
	reading: string;
	created_at: string;
	updated_at: string;
};
