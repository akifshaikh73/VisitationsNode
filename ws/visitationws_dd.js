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

var table = "visitations";
var metadata_table = "visitations_metadata";

function title(letters) {
    return letters.charAt(0).toUpperCase() + letters.slice(1);
}


app.get("/visitations/unit/:unit/address/:address",(req,res)=>{
    var unit = req.params.unit;
    var address = req.params.address;
    
    var params = {
        TableName: table,
        
        KeyConditionExpression: "#unit = :unit",
        FilterExpression:" contains(searchable , :address)",

        // unit is  a reserved dynamodb keyword
        ExpressionAttributeNames: { "#unit": "unit" },
        ExpressionAttributeValues: {
            ":unit": unit,
            ":address": address.toLocaleLowerCase() // Searchable attribute has lower case
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



app.get("/visitations/unit/:unit/id/:id",(req,res)=>{
    var _id = parseInt(req.params.id);
    var unit = req.params.unit;
    //var unit = "1";
    
    var params = {
        TableName: table,
        Key:{
            "unit": unit,
            "id": _id
        }
    };
    docClient.get(params, function(err, data) {
        var restr ;
        if (err) {
            restr = JSON.stringify(err, null, 2);
            console.error("Unable to read item. Error JSON:", restr);

        } else if(data.Item == undefined) {
            restr = JSON.stringify("Item not available");
        }
        else {
            restr = JSON.stringify(data.Item, null, 2);
            console.log("Items scanned", data.ScannedCount);
        }
        res.end(restr);
    });
});


app.get("/visitations/unit/:unit/area/:area",(req,res)=>{
    var unit = req.params.unit;
    var area = req.params.area;
    
    var params = {
        TableName: table,
        IndexName: "areaIndex",
        
        KeyConditionExpression: "#unit = :unit and area = :area",
        // unit is  a reserved dynamodb keyword
        ExpressionAttributeNames: { "#unit": "unit" },
        ExpressionAttributeValues: {
            ":unit": unit,
            ":area": area
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



app.get("/visitations/name/:unit/:name",(req,res)=>{
    var unit = req.params.unit;
    var name = title(req.params.name);
    // First query
    var queryParams = {
        TableName: table,
        IndexName: "nameIndex",
        
        KeyConditionExpression: "#unit = :unit and  begins_with(#name ,:name)",
        // unit is  a reserved dynamodb keyword
        ExpressionAttributeNames: { 
            "#unit": "unit" ,
            "#name": "name" 
        },
        ExpressionAttributeValues: {
            ":unit": unit,
            ":name": name
        }
    };

    // then scan
    var scanParams = {
        TableName: table,
        
        KeyConditionExpression: "#unit = :unit ",
        FilterExpression:"contains(searchable ,:name)",
        // unit is  a reserved dynamodb keyword
        ExpressionAttributeNames: { 
            "#unit": "unit" 
        },
        ExpressionAttributeValues: {
            ":unit": unit,
            ":name": name.toLowerCase() // searchable attribute has all lower case
        }
    };


    docClient.query(queryParams, function(err, data) {
        var restr ;
        if (err) {
            restr = JSON.stringify(err, null, 2);
            console.error("Unable to read item. Error JSON:", restr);

        } else {
            restr = JSON.stringify(data.Items, null, 2);
            console.log("Items scanned", data.ScannedCount);
        }
        if(data.Items.length == 0) {
            docClient.query(scanParams, function(err, data) {
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
        } else
            res.end(restr);
    });
});


var port = 8081;

app.listen(port,() => {
    console.log(`listening on ${port}`);
});
