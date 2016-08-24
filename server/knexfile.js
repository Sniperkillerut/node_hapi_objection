module.exports = {

    development: {
        client: 'postgresql',
        connection: {
            database: 'test1',
            host     : '127.0.0.1',
            user     : 'postgres',
            password : '16041990',
        },
        pool: {
            min: 2,
            max: 10
        }
    },

    production: {
        client: 'sqlite3',        
        filename: 'test1'
        
    }
};