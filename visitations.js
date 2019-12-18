var express = require('express');
var chalk = require('chalk');
var debug=require('debug');
var morgan=require('morgan');
var path=require('path');

var app=express();

//app.use(morgan('combined'));
app.use(morgan('tiny')); // Get logging

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname ,'views/index.html'));
});


app.get('/api',function(req,res) {
    res.send('Visitations Web Service');
});

var port = 8080;

app.listen(port,function() {
    console.log(`listening on ${chalk.green(port)}`);
    debug(`listening on ${chalk.green(port)}`);
    //debug('listening on port '+ chalk.green(port));
});
