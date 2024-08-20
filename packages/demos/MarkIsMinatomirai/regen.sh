extract_cmd=${PWD}/../../cli/packages/map-extract-floors/dist/map-extract-floors.js

mkdir -p data

pushd data
${extract_cmd} ../floors.svg
popd

files='
floors.json
header.ts
locs-wide.json
locs.json
logo.svg
params.ts
shops.json
'

for f in ${files}; do
  cp ${f} data/${f}
done

pnpx prettier -w data
