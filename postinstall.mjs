import path from 'path'
import * as url from 'url'
import fs from 'fs-extra'
// const topDir = import.meta.dirname

try {
  const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
  fs.emptyDirSync(path.join(__dirname, 'apps', 'sensenet', 'tinymce'))
  fs.copySync(path.join(__dirname, 'node_modules', 'tinymce'), path.join(__dirname, 'apps', 'sensenet', 'tinymce'), {
    overwrite: true,
  })

  console.log('tinymcye has been installed')
} catch (error) {
  console.error(error)
}
