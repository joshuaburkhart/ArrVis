var AWS = require('aws-sdk');
var util = require('util');
var express = require('express');
var fs = require('fs');
var app = express();
var path = require('path');
var jade = require('jade');
var execSync = require('execSync');

app.configure(function(){
    app.use(express.static(__dirname + '/'));
});
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

parsing
use scriptular...^([A-Z0-9]+)\s+([0-9-]+(\.[0-9]+)?)
matches Gene with $1 and M with $2
*/

app.get('/two-d', function(request, response) {
    var contents = jade.renderFile('jade/two-d.jade');
    response.send(contents.toString());
});
app.get('/dist', function(request, response) {
    var contents = jade.renderFile('jade/dist.jade');
    response.send(contents.toString());
});
app.get('/overlay', function(request, response) {
    var contents = jade.renderFile('jade/overlay.jade');
    response.send(contents.toString());
});
app.get('/three-d', function(request, response) {
    var contents = jade.renderFile('jade/three-d.jade');
    response.send(contents.toString());
});

app.post('/upload', function(request, response) {
    var file1_orig_name = request.files.file1.name;
    var file2_orig_name = request.files.file2.name;
    var file1_local_name = request.files.file1.path;
    var file2_local_name = request.files.file2.path;
    execSync.exec('ruby ma_qual.rb ' + file1_local_name + ' 0.05 false true | tail -n+2 > file1.q.stripped'); 
    execSync.exec('ruby ma_qual.rb ' + file2_local_name + ' 0.05 false true | tail -n+2 > file2.q.stripped'); 
    execSync.exec('ruby ma_intersect.rb true file1.q.stripped file2.q.stripped > file1.file2.intsct');
    execSync.exec('coord_extractor.sh file1.file2.intsct 2 2');
    execSync.exec('paste intsct.1 intsct.2 > intsct.12');
    var coords = execSync.exec('cat intsct.12');
    execSync.exec('ruby manhattan.rb intsct.12 4');
    execSync.exec('mkdir -p results');
    execSync.exec('mv intsct.12 results/');
    execSync.exec('mv file1.file2.intsct results/');
    execSync.exec('mv Manhattan* results/');
    execSync.exec('cp plot_expr_coords.r results/');
    execSync.exec('zip -r results.zip results');

    var jade_vars = {
        "file1_orig_name":file1_orig_name,
        "file2_orig_name":file2_orig_name,
        "file1_local_name":file1_local_name,
        "file2_local_name":file2_local_name,
        "coords":coords.stdout.replace(/\n/g,'<br>')
    }
    
    var jade_html = jade.renderFile('jade/layout.jade',jade_vars);
    
    //response.send(jade_html);
    response.download('results.zip');
});

app.get('/', function(request, response) {
    //var infile = "index.html";
    //var contents = fs.readFileSync(infile);
    var contents = jade.renderFile('jade/index.jade');
    response.send(contents.toString());
});
