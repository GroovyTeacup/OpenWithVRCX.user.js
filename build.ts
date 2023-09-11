import type { BunPlugin, BunFile } from "bun";
import { userscriptMetadataGenerator, Metadata } from 'userscript-metadata-generator';
import meta from "./config/metadata.cjs"

const build = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: './dist',
  target: "browser",
  naming: "[dir]/openWithVRCX.user.[ext]", // default
});

const metadataStr = userscriptMetadataGenerator(meta);

for (const output of build.outputs) {
  const file = Bun.file(output.path)
  console.log("Adding metadata to", output.path)

  // output metadata str to built file
  let src = await output.text()
  src = metadataStr + "\n\n" + src

  await Bun.write(file, src)
  //console.log(await output.text()); // string
}

//console.log(userscriptMetadataGenerator(meta))