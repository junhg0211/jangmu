import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

export const db = mysql.createPool({
	host: env.DB_HOST,
	port: Number(env.DB_PORT ?? 3306),
	user: env.DB_USER,
	password: env.DB_PASS,
	database: env.DB_NAME,
	connectionLimit: 10
});
