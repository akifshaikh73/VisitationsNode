import boto3
import json
import ddlconfigreader as config
from boto3.dynamodb.conditions import Key, Attr
import sys

# Get the service resource.
dynamodb = boto3.resource('dynamodb')
ddclient = boto3.client('dynamodb')
serializer = boto3.dynamodb.types.TypeSerializer()

# argument - masjidname
# creating a DynamoDB table. Note that the attributes of this table
# are lazy-loaded: a request is not made nor are the attribute
# values populated until the attributes
# on the table resource are accessed or its load() method is called.
table = dynamodb.Table(config.ddtable)
metatable = dynamodb.Table(config.metatable)

print("Database Calls")
if len(sys.argv) == 1:
    print(sys.argv[0])
    response = table.scan(
        ProjectionExpression="masjid, #unit, area",
        ExpressionAttributeNames={ "#unit": "unit" }, # Expression Attribute Names for Projection Expression only.
)
else:
    masjid = sys.argv[1]
    response = table.query(
        IndexName='masjidIndex',
        ProjectionExpression="masjid, #unit, area",
        ExpressionAttributeNames={ "#unit": "unit" }, # Expression Attribute Names for Projection Expression only.
        KeyConditionExpression=Key('masjid').eq(masjid)
        #KeyConditionExpression=Key('masjid').eq('Masjid Uthman') & Key('unit').eq('1')
    )


items = response['Items']
print(json.dumps(items))
uniquelist=[]
for i in items:
    if i not in uniquelist:
        uniquelist.append(i)

sortedlist = sorted(uniquelist, key=lambda k: k['masjid'])
sortedlist = sorted(uniquelist, key=lambda k: k['unit'])

for jsonItem in sortedlist:
    print(json.dumps(jsonItem))
    dboutItem = metatable.get_item(
        Key={
            'masjid': jsonItem['masjid'],
            'unit': jsonItem['unit'],
        }
    )
    dbinItem = {}
    dbinItem['masjid']=jsonItem['masjid']
    dbinItem['unit']=jsonItem['unit']
    newMUA = False # New Masjid Unit Area combination
    if('Item' in dboutItem):
        # Item exists
        if(jsonItem['area'] not in dboutItem['Item']['areas']):
            newMUA = True
            dbinItem['areas']=dboutItem['Item']['areas']
            dbinItem['areas'].append(jsonItem['area'])
    else:    
        newMUA = True
        # Item doesn't exist
        dbinItem['areas']=[jsonItem['area']]
    if(newMUA):    
        metatable.put_item(Item=dbinItem)   
    print(json.dumps(dbinItem))
print(json.dumps(sortedlist))

