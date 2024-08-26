NAME=$( basename ${PWD} )

app_main=@daijimaps/daijifloors-app-main
app_main_dir=${PWD}/../../app/packages/main
app_lib=@daijimaps/daijifloors-app-lib
app_lib_dir=${PWD}/../../app/packages/lib

do_build() {
  [ -f .env.production ] || printf 'BASE_URL=/demos/%s/\nVITE_APP_TITLE=%s\n' "${NAME}" "Daiji Floors for ${NAME}" >.env.production

  [ -f package.json ] || cp ../node_modules/${app_main}/package.json .
  # XXX edit package.json

  pnpm install --ignore-workspace

  pkg=${app_lib}
  [ -d ${app_lib_dir} ] && pkg=${app_lib_dir}
  pnpm install --ignore-workspace ${pkg}

  [ -f index.html ] || {
    cp ../node_modules/${app_main}/index.html .
    cp ../node_modules/${app_main}/tsconfig.* .
    cp ../node_modules/${app_main}/vite.* .
  }

  [ -d src ] ||
  cp -R ../node_modules/${app_main}/src src
  [ -d data ] ||
  cp -R ../data data

  pnpm build
}

main() {
  [ -f package.json ] || pnpm init
  # XXX edit package.json

  pkg=${app_main}
  [ -d ${app_main_dir} ] && pkg=${app_main_dir}
  pnpm install --ignore-workspace ${pkg}

  [ -d build ] || mkdir build

  pushd build
  do_build
  popd
}

main
