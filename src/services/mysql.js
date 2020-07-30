const mysql = require('mysql');
const config = require('config');
module.exports = (app)=>{
    app.services.mysql = {
        _connection: null,
        connect:()=>{
            if(!app.services.mysql._connection) {
                app.services.mysql._connection = mysql.createConnection({
                    host: config.get('mysql.host'),
                    user: config.get('mysql.user'),
                    password: config.get('mysql.pass'),
                    database: config.get('mysql.db_name')
                });

                app.services.mysql._connection.connect();
            }

            //connection.end();
            return app.services.mysql._connection;
        }

    }
}