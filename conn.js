var mysql = require('mysql2');
var util = require('util');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hr_consultancy'
});
var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;