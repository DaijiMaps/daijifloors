extract_cmd=${PWD}/../../cli/packages/map-extract-floors/dist/map-extract-floors.js

pushd data
${extract_cmd} ../floors.svg
popd

files='
locs.json
locs-wide.json
'

cp ${files} data

pnpx prettier -w data
