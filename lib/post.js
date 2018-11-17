const path = require('path')
FS.createPath('/', 'usr/share', true, false)
FS.mount(NODEFS, {
  root: path.join(__dirname, "..")
}, '/usr/share')
Module.FS = FS
