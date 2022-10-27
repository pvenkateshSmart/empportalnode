const mysql = require('mysql')

//console.log(process.env.TOUCHSTONE_MASTER_MYSQL);

var connection = mysql.createConnection({
    "host": process.env.TOUCHSTONE_MYSQL_HOST,
    "user": process.env.TOUCHSTONE_MYSQL_USER,
    "password": process.env.TOUCHSTONE_MYSQL_PASS,
    "database": process.env.TOUCHSTONE_MYSQL_DB,
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Touchstone Database Connected");
    }
});

module.exports = connection;