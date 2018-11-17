(async () => {
  const assert = require('assert').strict
  let text2Wav = require('./index.js')
  let out = await text2Wav("test")
  assert.equal(out[0], 82) //R
  assert.equal(out[1], 73) //I
  assert.equal(out[2], 70) //F
  assert.equal(out[3], 70) //F
})()