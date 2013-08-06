#!/usr/bin/env node
var fs = require('fs');
var outfile = "hello.txt";
var out = "Modify this script to write \n";
fs.writeFileSync(outfile,out);
console.log("Script: " + __filename + "\nWrote: " + out + "to: " + outfile);
