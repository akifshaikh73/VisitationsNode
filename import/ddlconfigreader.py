# Dynamo DB Loader Config Reader
import configparser
import sys

config = configparser.ConfigParser()
configfile = 'import.properties'

config.read(configfile)

s3bucket = config.get("CSV","s3.bucket")
csvfile = config.get("CSV","file")
pkeyColumn=config.get("CSV","pkeyColumn")
skeyColumn=config.get("CSV","skeyColumn")

ddtable = config.get("DynamoDB","table")
metatable = config.get("DynamoDB","metatable")
partitionKey=config.get("DynamoDB","partitionKey")
sortKey=config.get("DynamoDB","sortKey")

mappings = config["Mappings"]

name_columns = mappings["name"].lower().split(',')
contact_columns=mappings["contact"].lower().split(',')
metadata_columns=mappings["metadata"].lower().split(',')
context_columns=mappings["context"].lower().split(',')
visits_columns=mappings["visits"].lower().split(',')
students_columns=mappings["students"].lower().split(',')

def getTopLevelAttribute(column):
    for key in mappings.keys():
        columns = mappings[key].split(',')
        if (column in columns):
            return key
    return ''




