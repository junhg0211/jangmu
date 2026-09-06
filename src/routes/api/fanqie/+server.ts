import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { verifyOtp } from '$lib/server/auth';

export const GET: RequestHandler = async () => {
	const [rows] = await db.query(`
		SELECT
			id,
			fanqie,
			shengmu,
			reading,
			created_at,
			updated_at
		FROM fanqie
		ORDER BY id
	`);

	return json(rows);
};

export const POST: RequestHandler = async ({ request }) => {
	const { fanqie, shengmu, reading, otp } = await request.json();

	if (!(await verifyOtp(otp))) {
		return json({ error: 'OTP가 올바르지 않습니다.' }, { status: 401 });
	}

	console.log(fanqie, shengmu, reading);

	if (typeof fanqie !== 'string' || typeof shengmu !== 'boolean' || typeof reading !== 'string') {
		return json({ error: '잘못된 데이터입니다.' }, { status: 400 });
	}

	await db.execute(
		`
		INSERT INTO fanqie (
			fanqie,
			shengmu,
			reading
		)
		VALUES (?, ?, ?)
		`,
		[fanqie, shengmu, reading]
	);

	return json({ success: true }, { status: 201 });
};
