import knex from 'knex'
import path from 'path'

const connection = knex({
    client: "mysql",
    connection: {
        host: '127.0.0.1',
        database: 'nlw',
        port: 3306,
        password: 'mysql',
        user: 'root'
    },
})

export default connection