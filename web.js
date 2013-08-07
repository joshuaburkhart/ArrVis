var AWS = require('aws-sdk');
var util = require('util');
var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.logger());
AWS.config.update({region: 'us-west-1'});

app.get('/test.html', function(request, response) {
    response.send("<html>\n<head>\n</head>\n<body>\n" + request.query.userInput + "\n</body>\n</html>");
});

var s3 = new AWS.S3({params: {Key: 'myKey'}});
s3.createBucket(function() {
    s3.putObject({Body: 'Hello!'}, function() {
        console.log("Successfully uploaded data to " + process.env.S3_BUCKET_NAME + "/myKey");
    });
});

app.get('/', function(request, response) {
    var infile = "index.html";
    var contents = fs.readFileSync(infile);
    response.send(contents.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
