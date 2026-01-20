var mysql = require('mysql');
var util = require('util');

var conn = mysql.createConnection({
    host: 'bniyhug4bzpmrs1ldyt6-mysql.services.clever-cloud.com',
    user: 'utgw42ygx2squgb4',
    password: 'IRwMuz8GPe3014RrrM3x',
    database: 'bniyhug4bzpmrs1ldyt6'
});
var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
