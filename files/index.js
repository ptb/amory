const fs = require('fs-extra');
const nodePath = require('path');
const Config = require('webpack-chain');

const dest = ({ context, mode }) => {
  const dir = nodePath.resolve (
    context,
    mode === "development" ? "dev" : "web"
  );

  fs.ensureDirSync (dir);

  return dir
};

const index = ({
  config = new Config (),
  context = nodePath.resolve (process.cwd ()),
  mode = "production"
}) =>
  /* eslint-disable indent */
  config
    .context (context)
    .entry ("index")
      .add (nodePath.resolve (context, "src", "index"))
      .end ()
    .mode (mode)
    .output
      .path (dest ({ context, mode }))
      .end ();

module.exports = index;
