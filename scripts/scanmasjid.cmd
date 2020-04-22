#echo off
set masjid=%1
set unit=%2
echo %masjid%
aws dynamodb query --table-name visitations  --index-name masjidIndex --key-condition-expression "#masjid = :masjid AND #unit = :unit"  ^
    --expression-attribute-names "{ \"#unit\": \"unit\", \"#masjid\": \"masjid\"  }"    ^
    --expression-attribute-values "{ \":masjid\": {\"S\":\"%masjid%\"}, \":unit\": {\"S\":\"%unit%\"}  }"  --output json
