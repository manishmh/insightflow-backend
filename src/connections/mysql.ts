import mysql from 'mysql2'

const connectToSQL = async (host: string, user: string, password: string, database: string) => {
    const pool = mysql.createPool({
        host,
        user,
        password,
        database,
    }).promise()

    return pool;
}

export const getNotes = async (user: string, host: string, password: string, database: string) => {
    const pool = connectToSQL(host, user, password, database)
    const notes = (await pool).query('SELECT * FROM notes')
    return notes;
}

