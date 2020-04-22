const express  = require("express");
const AWS = require('aws-sdk');
var cors = require('cors');
AWS.config.loadFromPath('./configdd.json');

AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
      console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
      console.log("sessiontoken:", AWS.config.credentials.sessionToken);
      console.log("region:", AWS.config.region);
    }
  });

const app=express();
app.use(cors());
var docClient = new AWS.DynamoDB.DocumentClient();

var metadata_table = "visitations_metadata";

function title(letters) {
    return letters.charAt(0).toUpperCase() + letters.slice(1);
}

app.get("/visitations/metadata/",(req,res)=>{
    
    var params = {
        TableName: metadata_table,
        
        };
    docClient.scan(params, function(err, data) {
        var restr ;
        if (err) {
            restr = JSON.stringify(err, null, 2);
            console.error("Unable to read item. Error JSON:", restr);

        } else if(data.Items == undefined) {
            // query returns Items , not Item
            restr = JSON.stringify("Items not available");
        }
        else {
            restr = JSON.stringify(data.Items, null, 2);
            console.log("Items scanned", data.ScannedCount);
        }
        res.end(restr);
    });
});


app.get("/visitations/metadata/asyncawait",(req,res)=>{
    var restr = null;
    var params = {
        TableName: metadata_table,
        
        };
        console.log("before await");
        (async() => {
            console.log("before await");
            var data = await docClient.scan(params).promise();
            console.log(data);
            console.log("after await");
            restr = JSON.stringify(data.Items, null, 2);
            console.log("Items scanned", data.ScannedCount);
            res.end(restr);
        })();

});


app.get("/visitations/metadata/promise",(req,res)=>{
    var restr = null;
    var params = {
        TableName: metadata_table,
        
        };
    var scanpromise = docClient.scan(params).promise()    ;
    scanpromise.then(
        data=>{
            restr = JSON.stringify(data.Items, null, 2);
            console.log("Items scanned", data.ScannedCount);
            res.end(restr);
        },
        error => {
            restr = JSON.stringify(err, null, 2);
            console.error("Unable to read item. Error JSON:", restr);
            res.end(restr);
        }

    );
    scanpromise.catch(
        error => {
            restr = JSON.stringify(err, null, 2);
            console.error("Unable to read item. Error JSON:", restr);
            res.end(restr);
        }
    );

});



app.get("/visitations/metadata/masjid/:masjid/",(req,res)=>{
    var masjid = req.params.masjid;
    
    var params = {
        TableName: metadata_table,
        
        KeyConditionExpression: "masjid = :masjid",

        // unit is  a reserved dynamodb keyword
        ExpressionAttributeValues: {
            ":masjid": masjid // Searchable attribute has lower case
        }
        };
    docClient.query(params, function(err, data) {
        var restr ;
        if (err) {
            restr = JSON.stringify(err, null, 2);
            console.error("Unable to read item. Error JSON:", restr);

        } else if(data.Items == undefined) {
            // query returns Items , not Item
            restr = JSON.stringify("Items not available");
        }
        else {
            restr = JSON.stringify(data.Items, null, 2);
            console.log("Items scanned", data.ScannedCount);
        }
        res.end(restr);
    });
});

app.get("/visitations/metadata/masjid/:masjid/unit/:unit/",(req,res)=>{
    var unit = req.params.unit;
    var masjid = req.params.masjid;
    
    var params = {
        TableName: metadata_table,
        
        KeyConditionExpression: "masjid = :masjid and #unit = :unit",

        // unit is  a reserved dynamodb keyword
        ExpressionAttributeNames: { "#unit": "unit" },
        ExpressionAttributeValues: {
            ":unit": unit,
            ":masjid": masjid // Searchable attribute has lower case
        }
        };
    docClient.query(params, function(err, data) {
        var restr ;
        if (err) {
            restr = JSON.stringify(err, null, 2);
            console.error("Unable to read item. Error JSON:", restr);

        } else if(data.Items == undefined) {
            // query returns Items , not Item
            restr = JSON.stringify("Items not available");
        }
        else {
            restr = JSON.stringify(data.Items, null, 2);
            console.log("Items scanned", data.ScannedCount);
        }
        res.end(restr);
    });
});


var port = 8081;

app.listen(port,() => {
    console.log(`listening on ${port}`);
});
