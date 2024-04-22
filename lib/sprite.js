const path = require('path')
const Spritesmith = require('spritesmith')
const {
  validateStart, getImagePaths, getTargetDirs, generateStyles,
  SPRITE, saveFile, Log, fileWithHash, MSG
} = require("./utils");


function handleResultWithPromise(resolve, reject) {
  return async function (err, result, targetDir, conf) {
    try {
      const hashedImgFileName = fileWithHash(path.resolve(targetDir, SPRITE.resultImgName), result.image)
      const imgErr = await saveFile(path.resolve(targetDir, hashedImgFileName), result.image)
      if (imgErr) return reject(imgErr)

      const hashedCSSFileName = fileWithHash(path.resolve(targetDir, SPRITE.resultCSSName), result.image)
      const cssErr = await saveFile(path.resolve(targetDir, hashedCSSFileName), generateStyles(result, hashedImgFileName, conf))
      if (cssErr) return reject(cssErr)

      resolve(targetDir)
    } catch (e) {
      reject(e)
    }
  }
}

async function spriteUnder(targetDir, conf) {
  const files = await getImagePaths(targetDir)
  if (!files.length) return

  return new Promise((resolve, reject) => {
    const handleResult = handleResultWithPromise(resolve, reject)
    Spritesmith.run({ src: files }, (err, result) => handleResult(err, result, targetDir, conf))
  })
}

async function spriteEntry(conf) {
  validateStart(conf)

  const targetDirs = await getTargetDirs(conf.source)

  for (const dir of targetDirs) {
    await spriteUnder(dir, conf)
    Log({ msg: MSG.spriteUnder + dir })
  }
}

module.exports = spriteEntry