import boto3
import json
import csv2json
import ddlconfigreader as config

# Get the service resource.
dynamodb = boto3.resource('dynamodb')
ddclient = boto3.client('dynamodb')
serializer = boto3.dynamodb.types.TypeSerializer()

# Instantiate a table resource object without actually
# creating a DynamoDB table. Note that the attributes of this table
# are lazy-loaded: a request is not made nor are the attribute
# values populated until the attributes
# on the table resource are accessed or its load() method is called.
table = dynamodb.Table(config.ddtable)


i=0
batchItems=[]
batchItemRequest = {}
putRequest = {}
for jsonitem in csv2json.jsonItems:
    i=i+1
    # Since DD doesn't do lower case searches , put addresses and names in a searchable field for scans
    jsonitem["searchable"] = jsonitem["name"].lower() + ":"+jsonitem["contact"].lower()
    print(jsonitem)
    # Convert regular json to dynamodb json as required by Batch Write interface
    ddjsonItem = {k: serializer.serialize(v) for k,v in jsonitem.items()}
    print(ddjsonItem)
    putRequest={"PutRequest":{"Item":ddjsonItem}}
    batchItems.append(putRequest)
    if(i % 25 ==0 or len(csv2json.jsonItems) == i):
        #response = table.put_item(Item=jsonitem)
        batchItemRequest[config.ddtable]=batchItems
        print(json.dumps(batchItemRequest, indent=4))
        response = ddclient.batch_write_item(RequestItems=batchItemRequest)
        print("PutItem succeeded:")
        print(json.dumps(response, indent=4))
        batchItems=[]

#response = table.get_item(
#    Key={
#        'docType': 'Airport',
#        '_id': 'ORD'
#    }
#)
#item = response['Item']
#print(item)

