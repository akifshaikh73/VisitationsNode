@echo off
set unit=%1
set name=%2
aws dynamodb query --table-name visitations  --index-name nameIndex ^
    --return-consumed-capacity TOTAL ^
    --key-condition-expression "#unit = :unit AND #name = :name"  ^
    --expression-attribute-names "{ \"#unit\": \"unit\", \"#name\": \"name\"  }"    ^
    --expression-attribute-values "{ \":unit\": {\"S\":\"%unit%\"}, \":name\": {\"S\":\"%name%\"}  }"  --output json
