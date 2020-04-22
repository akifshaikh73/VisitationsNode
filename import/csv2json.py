import csv
import json
import ddlconfigreader as config

def serializeMap(mapVar,delimiter):
     mstr=""
     for k in mapVar.keys():
        mstr+=(mapVar[k]+delimiter)
     mstr=mstr.rstrip(delimiter)
     return mstr



refFile = open(config.csvfile,mode='rt')
i=0
fields=[]
Attributes=[]
record = ''
jsonItem = {}
jsonItems=[]
for line in refFile:
    if(i==0):
        # Headers , Field Names
        fields=line.split(',')
        f=0
        for field in fields:
            field=(''.join(field.lower().split('_')))
            # Remove special characters
            field=''.join(e for e in field if ord(e) < 128)
            if(field == config.pkeyColumn.lower()):
                Attributes.append(config.partitionKey)
            elif(field == config.skeyColumn.lower()):
                Attributes.append(config.sortKey)
            else:             
                Attributes.append(field.strip('\n'))
            f=f+1

    else:
        if(line.count(',') >= len(Attributes)):
            print(line)
        # Records
        jsonItem = {}
        students=[]
        # Visits is an array of Visit
        visits=[]
        # Visit is a timestamp and a comment for that timestamp
        visit={}

        contactItem = {}
        nameItem={}
        metadata={}
        context={}
        record=line.split(',')
        sortkeyvalue=record[0]
        #if(len(pkvalue) > 0):
        #   jsonItem["_id"]=pkvalue   
        r=0
        for attribute in Attributes:
            fvalue = record[r].strip("\"")
            fvalue = fvalue.rstrip()
            # Records with null sort key are skipped
            if(attribute==config.sortKey and len(fvalue) ==0): 
                break

            # Ignore null attributes
            if(len(fvalue) > 0 and fvalue != "NULL"):
                if(attribute == config.sortKey): 
                    jsonItem[attribute]=int(fvalue)    
                elif(attribute in config.name_columns): 
                    nameItem[attribute]=fvalue.title()
                elif(attribute in config.contact_columns): 
                    contactItem[attribute]=fvalue
                elif(attribute in config.metadata_columns): 
                    metadata[attribute]=fvalue
                elif(attribute in config.context_columns): 
                    context[attribute]=fvalue
                elif(attribute in config.students_columns): 
                    students=fvalue.split('-')
                elif(attribute in config.visits_columns): 
                    if(attribute =="lastvisit"):
                        visit["timestamp"]=fvalue
                    else:
                        visit[attribute]=fvalue
                else:
                    jsonItem[attribute]=fvalue
            r=r+1 # Next field
        jsonItem["name"]=serializeMap(nameItem,' ')
        jsonItem["contact"]=serializeMap(contactItem,':')
        jsonItem["metadata"]=metadata
        jsonItem["context"]=context
        jsonItem["area"]=jsonItem["area"].title()

        if(len(students) >0):
            jsonItem["students"]=students
        if(len(visit) >0):
            visits.append(visit)
            jsonItem["visits"]=visits
        jsonItems.append(jsonItem)
    i=i+1

refFile.close()
jsonstr=json.dumps(jsonItems)
print(jsonstr)

#with open(refData+'.csv', 'rt') as csvfile:
#    refdatafile = csv.reader(csvfile, delimiter=' ', quotechar='|')
#    for row in refdatafile:
#        print(', '.join(row))
