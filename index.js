const eSpeakNg = require('./lib/espeak-ng')
module.exports = function () {
  return new Promise((resolve) => {
    let Module = {
      arguments: ['-w wav.wav', ...Array.from(arguments)],
      postRun: function () {
        resolve(new Uint8Array(Module.FS.root.contents['wav.wav'].contents))
      }
    }
    eSpeakNg(Module)
  })
}

if (require.main === module) {
  (async () => {
    let out = await module.exports(...process.argv.slice(2))
    process.stdout.write(out)
  })()
}