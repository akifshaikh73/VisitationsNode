const express  = require("express");
var cors = require('cors');

const app=express();
app.use(cors());

const db = "visitations";
const masterlist = "masterlist";

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(url);

function title(letters) {
    return letters.charAt(0).toUpperCase() + letters.slice(1);
}

app.use(cors());

app.get("/health", (req,res)=>{
    res.send("OK");
});

app.get("/visitations/unit/:unit",(req,res)=>{
    var unit = req.params.unit;
    console.log(unit);
    client.connect((err,client)=> {
        assert.equal(null,err);
        console.log("Connected");
        const visitations = client.db(db);
        const master_collection = visitations.collection(masterlist);
        master_collection.find({"Unit":unit},(err,docs)=>{
            if(err !=null) {
                console.error(err);
                res.send(JSON.stringify(err));
            }
            var list = [];
            var pcount = docs.count();
            pcount.then(val =>{
                console.log(val);
                docs.forEach(doc=> {
                    list.push(doc);
                    console.log(doc);
                    if(list.length == val)
                        res.send(JSON.stringify(list));
                })
            })
        });      
    });
    
});


app.get("/visitations/metadata",(req,res)=>{
    client.connect((err,client)=> {
        assert.equal(null,err);
        console.log("Connected");
        const visitations = client.db(db);
        const master_collection = visitations.collection(masterlist);
        let pipeline = [ 
            { $group : { _id: "$Masjid" } } 
        ];
        var allmasjid_p=master_collection.aggregate(pipeline).toArray();
        allmasjid_p.then(masjidlist => {
            var count =0;
            //console.log(JSON.stringify(masjidlist));
            masjidlist.forEach(masjid => {
                console.log(masjid);
                masjid["masjid"]=masjid["_id"];
                masjid["units"]=[];
                let m_pipeline = [ 
                    { $match : { Masjid: masjid["_id"] } } ,
                    { $group : { _id: "$Unit" , areas:{$addToSet:"$Area"}} } 
                ];
                console.log("<<");
                var masjidunit_p=master_collection.aggregate(m_pipeline).toArray();
                console.log(">>");
                masjidunit_p.then(masjidunitareas=>{
                    masjidunitareas.forEach(unitareas => {
                        var unit = {};
                        unit["name"]=unitareas["_id"];
                        unit["areas"]=unitareas["areas"];
                        count++;
                        masjid["units"].push(unit);
                    });    
                });
            });
            var _flagCheck = setInterval(()=> {
                if (count > 0) {
                    clearInterval(_flagCheck);
                    console.log("returning");
                    res.send(JSON.stringify(masjidlist));
                }
            }, 100);
        });
    });
    
});


app.get("/visitations/masjid/:masjid/unit/:unit/area/:area",(req,res)=>{
    var masjid = req.params.masjid;
    var unit = req.params.unit;
    var area = req.params.area;
    console.log(masjid+unit+area);
    client.connect((err,client)=> {
        assert.equal(null,err);
        console.log("Connected");
        const visitations = client.db(db);
        const master_collection = visitations.collection(masterlist);
        var listp=master_collection.find({"Masjid":masjid,"Unit":unit,"Area":area}).toArray();
        listp.then(val=>{
            var vlist = [];
            val.forEach(entry=>{
                vlist.push(entry) ;
            });
            console.log(vlist);
            res.send(JSON.stringify(vlist));
        });
    });

});


app.get("/visitations/unit/:unit/id/:id",(req,res)=>{
    var _id = parseInt(req.params.id);
    var unit = req.params.unit;
});


app.get("/visitations/unit/:unit/area/:area",(req,res)=>{
    var unit = req.params.unit;
    var area = req.params.area;
    
});



app.get("/visitations/name/:unit/:name",(req,res)=>{
    var unit = req.params.unit;
    var name = title(req.params.name);

});


var port = 8081;

app.listen(port,() => {
    console.log(`listening on ${port}`);
});
