import * as esbuild from 'esbuild'

// npx esbuild loader.jsx --watch --bundle --outfile="C:\Program Files (x86)\Steam\steamapps\common\Cities Skylines II\Cities2_Data\StreamingAssets\~UI~\HookUI\loader.transpiled.js"

// const outPath = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Cities Skylines II\\Cities2_Data\\StreamingAssets\\~UI~\\HookUI\\lib\\'
const outPath = "./dist/"

const shouldBundle = true

await esbuild.build({
  entryPoints: ["ui_lib/loader.jsx"],
  bundle: shouldBundle,
  outfile: outPath + 'hookui.loader.bundle.js',
})

await esbuild.build({
  entryPoints: ["ui_lib/menu.jsx"],
  bundle: shouldBundle,
  outfile: outPath + 'hookui.menu.bundle.js',
})

await esbuild.build({
  entryPoints: ["ui_lib/api.js"],
  bundle: shouldBundle,
  outfile: outPath + 'hookui.api.bundle.js',
})