import AmoryScrubPlugin from "@amory/scrub"
import AmoryXHTMLPlugin from "@amory/xhtml/plugin"
import Config from "webpack-chain"

export default ({
  config = new Config ()
}) =>
  /* eslint-disable indent */
  config
    .output
      .libraryTarget ("commonjs2")
      .end ()
    .plugin ("xhtml")
      .use (AmoryXHTMLPlugin)
      .end ()
    .plugin ("exclude")
      .use (AmoryScrubPlugin)
      .after ("xhtml")
      .end ()
