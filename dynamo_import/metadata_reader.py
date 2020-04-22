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

dbItem = metatable.get_item(
    Key={
        'masjid': 'Masjid Uthman',
        'unit': '1',
    }
)
print(json.dumps(dbItem['Item']))
dbItem = metatable.get_item(
    Key={
        'masjid': 'Masjid Uthman',
        'unit': '5',
    }
)
print(json.dumps(dbItem['Item']))
