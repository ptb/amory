const fs = require('fs-extra');
const path = require('path');
const Config = require('webpack-chain');

const dest = ({ context, mode }) => {
  const dir = path.resolve (
    context,
    mode === "development" ? "dev" : "web"
  );

  fs.ensureDirSync (dir);

  return dir
};

const index = ({
  config = new Config (),
  context = path.resolve (process.cwd ()),
  mode = "production"
}) =>
  /* eslint-disable indent */
  config
    .context (context)
    .entry ("index")
      .add (path.resolve (context, "src", "index"))
      .end ()
    .mode (mode)
    .output
      .path (dest ({ context, mode }))
      .end ();

module.exports = index;
