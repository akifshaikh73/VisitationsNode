@echo off
set unit=%1
set name=%2

aws dynamodb query --table-name visitations_data  ^
    --return-consumed-capacity TOTAL ^
    --key-condition-expression "#unit = :unit"  ^
    --filter-expression "contains(searchable ,:name)" ^
    --expression-attribute-names "{ \"#unit\": \"unit\" }"    ^
    --expression-attribute-values "{ \":unit\": {\"S\":\"%unit%\"}, \":name\": {\"S\":\"%name%\"}  }"  --output json


