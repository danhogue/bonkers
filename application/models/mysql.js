var mysql = require('mysql');

var config = {
    host     : '',
    user     : '',
    password : '',
    database : ''
};

var tablename = "test";
var db = null;

try {
    db = mysql.createConnection(config);
    db.connect();
}
catch(err) {
    console.log(err);
}

exports.getAll = function (cb) {
    db.query('SELECT * from `' + tablename + '` where 1;', function(err, rows, fields) {
        if (err) {
            console.log(err);
            cb(null);
        }
        cb(rows);
    });
};

exports.get = function (key, cb) {
    // TODO use key
    db.query('SELECT * from `' + tablename + '` where 1;', function(err, rows, fields) {
        if (err) {
            console.log(err);
            cb(null);
        }
        cb(rows[0]);
    });
};
