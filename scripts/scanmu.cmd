set unit=%1
IF NOT DEFINED unit (
aws dynamodb query --table-name visitations  --index-name masjidIndex ^
--select SPECIFIC_ATTRIBUTES  --projection-expression "masjid, #unit,area" ^
--key-condition-expression "#masjid = :masjid"      ^
--expression-attribute-names "{ \"#unit\": \"unit\", \"#masjid\": \"masjid\"  }"        ^
--expression-attribute-values "{ \":masjid\": {\"S\":\"Masjid Uthman\"}  }"  --output json     

) ELSE (
aws dynamodb query --table-name visitations  --index-name masjidIndex ^
--select SPECIFIC_ATTRIBUTES  --projection-expression "masjid, #unit,area" ^
--key-condition-expression "#masjid = :masjid AND #unit = :unit"      ^
--expression-attribute-names "{ \"#unit\": \"unit\", \"#masjid\": \"masjid\"  }"        ^
--expression-attribute-values "{ \":masjid\": {\"S\":\"Masjid Uthman\"}, \":unit\": {\"S\":\"%unit%\"}  }"  --output json     
)

