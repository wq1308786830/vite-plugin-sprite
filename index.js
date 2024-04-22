const spriteEntry = require("./lib/sprite");
const {Log, MSG} = require("./lib/utils");

function sprite(spriteConf) {

  return {
    name: 'sprite',
    enforce: 'pre',
    buildStart() {
      spriteEntry(spriteConf).then(() => {
        Log({ msg: MSG.success })
      })
    }
  }
}

module.exports = sprite