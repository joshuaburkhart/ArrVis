var AWS = require('aws-sdk');
var util = require('util');
var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.logger());
app.use(express.bodyParser());
AWS.config.update({region: 'us-west-1'});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});


var s3 = new AWS.S3({params: {Bucket: 'arrvis', Key: 'myKey'}});
s3.putObject({Body: 'Hello!'}, function() {
    console.log("Successfully uploaded data to arrvis/myKey");
});

app.post('/test', function(request, response) {
    var infile = request.files.datFile.path;
    var contents = fs.readFileSync(infile);
    response.send("<html>\n<head>\n</head>\n<body>\nFile Contents:<br> " + contents + "\n</body>\n</html>");
});

app.get('/', function(request, response) {
    var infile = "index.html";
    var contents = fs.readFileSync(infile);
    response.send(contents.toString());
});
