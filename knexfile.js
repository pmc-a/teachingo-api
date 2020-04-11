module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: '127.0.0.1',
            user: 'postgres',
            password: process.env.LOCAL_DATABASE_PASSWORD,
            database: 'teachingo_db',
        },
        seeds: {
            directory: './seeds',
        },
    },
    // production: {
    //     client: 'pg',
    //     debug: true,
    //     connection: process.env.DATABASE_URL,
    //     migrations: {
    //         tableName: 'knex_migrations',
    //     },
    //     ssl: true,
    // },
};
