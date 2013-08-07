var AWS = require('aws-sdk');
var util = require('util');
var express = require('express');
var fs = require('fs');
var app = express();
var path = require('path');
var jade = require('jade');

app.use(express.logger());
app.use(express.bodyParser());
AWS.config.update({region: 'us-west-1'});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});

/*
var s3 = new AWS.S3({params: {Bucket: 'arrvis', Key: 'myKey'}});
s3.putObject({Body: 'Hello!'}, function() {
    console.log("Successfully uploaded data to arrvis/myKey");
});
*/

app.get('/wi-wiob_vs_kc-wi_manhattan-4.png', function(request, response) {
    response.sendfile(path.resolve('images/wi-wiob_vs_kc-wi_manhattan-4.png'));
});

app.post('/upload', function(request, response) {
    var file1_orig_name = request.files.file1.name;
    var file2_orig_name = request.files.file2.name;
    var file1_local_name = request.files.file1.path;
    var file2_local_name = request.files.file2.path;
    var file1_contents = fs.readFileSync(file1_local_name);
    var file2_contents = fs.readFileSync(file2_local_name);

    var jade_vars = {
        "file1_orig_name":file1_orig_name,
        "file2_orig_name":file2_orig_name,
        "file1_local_name":file1_local_name,
        "file2_local_name":file2_local_name,
        "file1_contents":file1_contents,
        "file2_contents":file2_contents
    }
    
    var jade_html = jade.renderFile('jade/layout.jade',jade_vars);
    
    response.send(jade_html);
});

app.get('/', function(request, response) {
    var infile = "index.html";
    var contents = fs.readFileSync(infile);
    response.send(contents.toString());
});
