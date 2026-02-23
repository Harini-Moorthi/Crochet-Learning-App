import db from '../config/db';

export const testConnection = async () => {
  const { rows } = await db.query('SELECT NOW() as current_time, version() as version');
  return rows[0];
};

export const findUserByEmail = async (email: string) => {
  const { rows } = await db.query(
    'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
    [email]
  );
  return rows[0];
};

export const createUser = async (name: string, email: string, passwordHash: string) => {
  const { rows } = await db.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, passwordHash]
  );
  return rows[0];
};