import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { verifyOtp } from '$lib/server/auth';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const body = await request.json();

	if (!verifyOtp(body.otp)) {
		return json({ error: 'OTP가 올바르지 않습니다.' }, { status: 401 });
	}

	await db.execute(
		`
    UPDATE words
    SET
      word = ?,
      pronunciation = ?,
      pos = ?,
      meaning = ?,
      etymology = ?
    WHERE id = ?
    `,
		[body.word, body.pronunciation, body.pos, body.meaning, body.etymology, params.id]
	);

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ params, request }) => {
	const { otp } = await request.json();

	if (!verifyOtp(otp)) {
		return json({ error: 'OTP가 올바르지 않습니다.' }, { status: 401 });
	}

	if (!params.id) {
		return json({ error: '잘못된 단어 ID입니다.' }, { status: 400 });
	}

	await db.execute('DELETE FROM words WHERE id = ?', [params.id]);

	return json({ success: true });
};
