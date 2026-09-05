import { env } from '$env/dynamic/private';
import { verify } from 'otplib';

export async function verifyOtp(token: string): Promise<boolean> {
	if (!env.OTP_SECRET) {
		throw new Error('OTP_SECRET is not configured');
	}

	const result = await verify({
		token,
		secret: env.OTP_SECRET
	});

	return result.valid;
}
