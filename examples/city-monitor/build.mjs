import * as esbuild from 'esbuild'

// const outPath = './out/'
// const outPath = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Cities Skylines II\\Cities2_Data\\StreamingAssets\\~UI~\\HookUI\\Extensions\\'
const outPath = "./dist/"

await esbuild.build({
  entryPoints: ["city_monitor.jsx"],
  bundle: true,
  outfile: outPath + 'city_monitor.transpiled.js',
})