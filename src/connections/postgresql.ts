import { Pool } from 'pg';

let pool: Pool | undefined;

export function connectToPostgreSQL(connectionString?: string, host?: string, database?: string, user?: string, password?: string): void {
  if (!pool) {
    const poolConfig = connectionString
      ? {
          connectionString,
          ssl: { rejectUnauthorized: false },
        }
      : {
          host,
          database,
          user,
          password,
          ssl: { rejectUnauthorized: false },
        };

    console.log(poolConfig)
    pool = new Pool(poolConfig);

    pool.on('connect', () => {
      console.log('Connected to the PostgreSQL database.');
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on the database connection', err);
      pool = undefined;
    });
  }
}

export async function pgGetData(query: string, params?: any[]): Promise<any[]> {
  if (!pool) {
    throw new Error('Database connection not established.');
  }

  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}

