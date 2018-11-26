#!/usr/bin/env node

const eSpeakNg = require('./lib/espeak-ng')
const optMap = {
  voice: '-v',
  amplitude: '-a',
  wordGap: '-g',
  capital: '-k',
  lineLength: '-l',
  pitch: '-p',
  speed: '-s',
  encoding: '-b',
  hasTags: '-m',
  noFinalPause: '-z',
  punct: '--punct',
}

module.exports = function () {
  let parsedArguments = [arguments[0], '-w wav.wav']
  if (arguments[1] && arguments[1] instanceof Object) {
    for (let prop in arguments[1]) {
      if (!optMap[prop]) {
        throw new Error(`invalid option ${prop}`)
      }
      if (typeof arguments[1][prop] == 'boolean') {
        if (arguments[1][prop] === true) {
          parsedArguments.push(optMap[prop])
        }
        continue
      }
      if (optMap[prop].startsWith('--')) {
        if (arguments[1][prop]) {
          parsedArguments.push(optMap[prop] + '="' + arguments[1][prop].replace('"', '\\"') + '"')
        }
        continue
      }
      parsedArguments.push(optMap[prop])
      parsedArguments.push(arguments[1][prop])
    }
  } else {
    parsedArguments = parsedArguments.concat(Array.from(arguments).slice(1))
  }
  return new Promise((resolve) => {
    let Module = {
      arguments: parsedArguments,
      postRun: function () {
        Module.FS.unmount('/usr/share')
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