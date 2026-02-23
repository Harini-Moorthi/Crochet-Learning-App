import db from '../config/db';

export const getCurrentTime = async () => {
  const { rows } = await db.query('SELECT NOW() as now');
  return rows[0].now;
};