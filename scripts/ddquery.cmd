@echo off
set unit=%1
set area=%2
aws dynamodb query --table-name visitations_data  --index-name areaIndex --key-condition-expression "#unit = :unit AND #area = :area"  ^
    --expression-attribute-names "{ \"#unit\": \"unit\", \"#area\": \"area\"  }"    ^
    --expression-attribute-values "{ \":unit\": {\"S\":\"%unit%\"}, \":area\": {\"S\":\"%area%\"}  }"  --output json
