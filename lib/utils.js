const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto');
const { Glob } = require('glob')

const MSG = {
  start: 'Sprite start ...',
  success: 'Sprite success!',
  validateError: 'vite-plugin-sprite has no source config',
  spriteUnder: 'spriteUnder:',
}

const SUPPORT_EXTS = ['.png', '.jpg', '.jpeg', '.gif']

const SPRITE = {
  resultImgName: 'sprite.png',
  resultCSSName: 'sprite.css'
}

const SPRITE_PATTERN = {
  resultImg: /^sprite\..*png$/,
  resultCSS: /^sprite\..*css$/
}

function Log(logConf) {
  let logFC
  switch (logConf.level) {
    case 'warn':
      logFC = console.warn
      break
    case 'error':
      logFC = console.error
      break
    default:
      logFC = (msg) => {
        console.log('\x1B[32m', msg)
      }
      break
  }
  logFC(`[${new Date()}]:${typeof logConf === 'string' ? logConf.msg : logConf}`)
}

function validateStart(conf) {
  if (!conf.source) {
    throw Error(MSG.validateError)
  }
}

/**
 * 过滤支持的文件扩展名
 * @param files
 * @returns {*}
 */
function filterImages(files) {
  return files.filter(fPath => {
    const ext = path.extname(fPath)
    return SUPPORT_EXTS.includes(ext) &&
      !SPRITE_PATTERN.resultImg.test(fPath) &&
      !SPRITE_PATTERN.resultCSS.test(fPath)
  })
}

async function getTargetDirs(source) {
  const g = new Glob(source, {})
  const targetDirs = []
  for await (const dir of g) {
    targetDirs.push(path.resolve(dir))
  }

  return targetDirs
}

/**
 * css类名只允许字母数字下划线
 * @param str
 * @returns {string}
 */
function parseToValidClassName(str) {
  return str.replaceAll(/[^a-zA-Z0-9-_]/g, '')
}

async function getImagePaths(targetDir) {
  const files = await fs.readdir(targetDir);

  return filterImages(files).map(file => {
    return path.join(targetDir, file)
  })
}


const cssTemplate = ({ key, properties, target, fileName, scale }) =>
  `.${parseToValidClassName(key)} {
  width: ${target.width / scale}px;
  height: ${target.height / scale}px;
  background-image: url(./${fileName});
  background-position: -${target.x / scale}px -${target.y / scale}px;
  background-size: ${properties.width / scale}px ${properties.height / scale}px;
  background-repeat: no-repeat;
}`

function generateStyles(result, fileName, conf) {
  const positions = []
  Object.keys(result.coordinates).map(key => {
    const ext = path.extname(key)
    const target = result.coordinates[key]

    const imgName = `${ext}-${path.basename(key, ext)}-${target.x}-${target.y}`
    positions.push(cssTemplate({
      key: imgName,
      target,
      fileName,
      scale: conf.scale,
      properties: result.properties,
    }))
  })

  return positions.join('\n')
}

function fileWithHash(targetPath, content) {
  const ext = path.extname(targetPath)
  const fileName = path.basename(targetPath, ext)
  return `${fileName}.${crypto.createHash('md5').update(content).digest('hex')}${ext}`
}

/**
 * 保存文件，失败会有err
 * @param targetPath
 * @param data
 * @returns {Promise<void>}
 */
async function saveFile(targetPath, data) {
  const err = await fs.writeFile(targetPath, data)

  return err
}

function handleError(err) {
  // handle your error appropriately here, e.g.:
  console.error(err) // print the error to STDERR
  process.exit(1) // exit program with non-zero exit code
}

module.exports = {
  MSG,
  SPRITE,
  validateStart,
  getImagePaths,
  fileWithHash,
  saveFile,
  Log,
  handleError,
  getTargetDirs,
  generateStyles,
}