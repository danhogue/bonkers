var AWS = require("aws-sdk");

if(process.env.ENVIRONMENT == "local"){
    AWS.config.update({
        region: "us-west-2",
        endpoint: "http://localhost:8000"
    });
}

var docClient = new AWS.DynamoDB.DocumentClient();
var table_name = "Users";

exports.get = function (key, cb) {

    // Return fake user so that you can log in
    // TODO: remove the following return line when you get your test db set up
    return cb('', {
            'user_id': 'admin',
            'password': '$2a$08$Y3kXZRelvYGEVIV5NrXD6ugEXLRXoqQHZRKOstgSPtiAfkbOhRhTW',
            'user_enabled': 'true',
            'default_app_id': ''
            }
    ); // password is 'password'

    var params = {
        TableName: table_name,
        Key: key
    };
    docClient.get(params, function(err, data){
        if(data) {
            cb(err, data.Item);
        } else {
            cb(err, null);
        }
    });
};

exports.put = function (item, cb) {
    var params = {
        TableName: table_name,
        Item: item
    };
    docClient.put(params, function(err, data){
        cb(err, data);
    });
};
