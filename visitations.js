var express = require('express');
var chalk = require('chalk');
var debug=require('debug');

var app=express();

app.get('/',function(req,res){
    res.send('Visitations Web with Debug');
});

app.listen(8080,function() {
    //console.log('listening on '+ chalk.green('3000'));
    debug('listening on port ${chalk.green(`8080`)}');
});
