var mysql = require('mysql2');
var util = require('util');

var conn = mysql.createConnection({
    host: 'bjvh9ankxjic2er5su2a-mysql.services.clever-cloud.comt',
    user: 'udei2noavssvzlhs',
    password: 'HbB1rOFUIWSqyDc5El5F',
    database: 'bjvh9ankxjic2er5su2a'
});
var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
