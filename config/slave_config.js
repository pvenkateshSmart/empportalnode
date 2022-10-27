const mysql = require('mysql')

//console.log(process.env.TOUCHSTONE_MASTER_MYSQL);

var connection = mysql.createConnection({
    "host": process.env.SLAVE_MYSQL_HOST,
    "user": process.env.SLAVE_MYSQL_USER,
    "password": process.env.SLAVE_MYSQL_PASS,
    "database": process.env.SLAVE_MYSQL_DB,
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Slave Database Connected");
    }
});

module.exports = connection;