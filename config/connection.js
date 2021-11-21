const { createPool } = require('mysql2');
const { database } = require('./config');

//conecction db
const connectionPool = createPool(database);

module.exports = {
    queryResult: (queryRaw) => {
        return new Promise(function (resolve, reject) {
            connectionPool.getConnection(function (err, connection) {
                if (err) {
                    resolve({
                        status: 'error',
                        msg: err
                    });
                } else {
                    connection.query(queryRaw, function (error, results, fields) {
                        connection.release(); // When done with the connection, release it.
                        if (error) {
                            resolve({
                                status: 'error',
                                msg: error
                            });
                        } else {
                            resolve({
                                status: 'success',
                                msg: results
                            });
                        }
                    });
                }
            });
        });
    }
}