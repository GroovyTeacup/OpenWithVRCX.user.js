import type { BunPlugin, BunFile } from "bun";
import { userscriptMetadataGenerator, Metadata } from 'userscript-metadata-generator';
import meta from "./config/metadata.cjs"
import chokidar from "chokidar";

// Check if process args contains "--watch"
const watch = process.argv.includes("--watch");

async function doBuild() {
  let time = Date.now()
  const build = await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: './dist',
    target: "browser",
    naming: "[dir]/openWithVRCX.user.[ext]", // default
  });
  
  const metadataStr = userscriptMetadataGenerator(meta);
  
  for (const output of build.outputs) {
    const file = Bun.file(output.path)
    // console.log("Adding metadata to", output.path)
  
    // output metadata str to built file
    let src = await output.text()
    src = metadataStr + "\n\n" + src
  
    await Bun.write(file, src)
    // console.log(await output.text()); // string
  }

  console.log(`Built in ${Date.now() - time}ms`)
}

doBuild()

if (watch) {
  console.log("Watching for file changes...")
  // Monitor src directory for file changes
  chokidar.watch('./src', { ignoreInitial: true }).on('all', doBuild);
}

//console.log(userscriptMetadataGenerator(meta))