import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { verifyOtp } from '$lib/server/auth';

export const GET: RequestHandler = async () => {
	const [rows] = await db.query(`
		SELECT *
		FROM words
    ORDER BY id DESC
	`);

	return json(rows);
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!verifyOtp(body.otp)) {
		return json({ message: 'OTP가 올바르지 않습니다.' }, { status: 401 });
	}

	const [result] = await db.execute(
		`
	INSERT INTO words (
		word,
		pronunciation,
		pos,
		meaning,
		etymology
	)
	VALUES (?, ?, ?, ?, ?)
	`,
		[body.word, body.pronunciation, body.pos, body.meaning, body.etymology]
	);

	return json({ message: 'OK', result });
};
