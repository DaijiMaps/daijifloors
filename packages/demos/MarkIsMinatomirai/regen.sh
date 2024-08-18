extract_cmd=${PWD}/../../cli/packages/map-extract-floors/dist/map-extract-floors.js

mkdir -p data

pushd data
${extract_cmd} ../floors.svg
popd

files='
addresses/addresses_1F.json
addresses/addresses_2F.json
addresses/addresses_3F.json
addresses/addresses_4F.json
addresses/addresses_5F.json
addresses/addresses_B1.json
addresses/addresses_B2.json
addresses/addresses_B4.json
addresses/addresses_GL.json
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
