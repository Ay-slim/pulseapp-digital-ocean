import dotenv from 'dotenv';
import { createPool, Pool} from 'mysql';

let pool: Pool;

dotenv.config();

export const db_init = () => {
  try {
    pool = createPool({
      host: process.env.MY_SQL_DB_HOST,
      user: process.env.MY_SQL_DB_USER,
      database: process.env.MY_SQL_DB_DATABASE,
      password: process.env.MY_SQL_DB_PASSWORD,
      port: Number(process.env.MY_SQL_DB_PORT),
    });

    console.debug('MySql Adapter Pool generated successfully');
  } catch (error) {
    console.error('[mysql.connector][init][Error]: ', error);
    throw new Error('failed to initialized pool');
  }
};

export const execute_query = <T>(query: string, params: string[] | Object): Promise<T> => {
  try {
    if (!pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');

    return new Promise<T>((resolve, reject) => {
      pool.query(query, params, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

  } catch (error) {
    console.error('[mysql.connector][execute][Error]: ', error);
    throw new Error('failed to execute MySQL query');
  }
}