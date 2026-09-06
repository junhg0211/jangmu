import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { verifyOtp } from '$lib/server/auth';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const { fanqie, shengmu, reading, otp } = await request.json();

	if (!(await verifyOtp(otp))) {
		return json({ error: 'OTP가 올바르지 않습니다.' }, { status: 401 });
	}

	if (typeof fanqie !== 'string' || typeof shengmu !== 'boolean' || typeof reading !== 'string') {
		return json({ error: '잘못된 데이터입니다.' }, { status: 400 });
	}

	const id = Number(params.id);

	if (!Number.isInteger(id) || id <= 0) {
		return json({ error: '잘못된 ID입니다.' }, { status: 400 });
	}

	await db.execute(
		`
		UPDATE fanqie
		SET
			fanqie = ?,
			shengmu = ?,
			reading = ?
		WHERE id = ?
		`,
		[fanqie, shengmu, reading, id]
	);

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ params, request }) => {
	const { otp } = await request.json();

	if (!(await verifyOtp(otp))) {
		return json({ error: 'OTP가 올바르지 않습니다.' }, { status: 401 });
	}

	const id = Number(params.id);

	if (!Number.isInteger(id) || id <= 0) {
		return json({ error: '잘못된 ID입니다.' }, { status: 400 });
	}

	const [result] = await db.execute('DELETE FROM fanqie WHERE id = ?', [id]);

	return json({ success: true });
};
