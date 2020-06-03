import path from 'path'

module.exports = {
    client: "mysql",
    connection: {
        host: '127.0.0.1',
        database: 'nlw',
        port: 3306,
        password: 'mysql',
        user: 'root'
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'databases', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'databases', 'seeds')
    },
    // useNullAsDefault: true
}