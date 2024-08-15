DIR="${HOME}/Library/Application Support/org.inkscape.Inkscape/config/inkscape/extensions"

rm "${DIR}"/*.inx "${DIR}"/*.py
cp -p *.inx *.py "${DIR}"

subdirs='
daijimaps
'

for subdir in ${subdirs}; do
  mkdir -p "${DIR}/${subdir}"
  rm "${DIR}/${subdir}/"*.py
  cp -p ${subdir}/*.py "${DIR}/${subdir}"
done
