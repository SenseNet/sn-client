const { BABEL_ENV } = process.env
const { existsSync, lstatSync } = require('fs')
const { dirname, extname, resolve } = require('path')

const isBundling = BABEL_ENV === 'bundle'
const scriptExtensions = new Set(['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs'])

const addJsExtensionToLocalScriptImports = () => {
  const updateSource = (path, state) => {
    const { source, exportKind, importKind } = path.node

    if (!source || exportKind === 'type' || importKind === 'type') {
      return
    }

    const modulePath = source.value

    if (!modulePath.startsWith('.') && !modulePath.startsWith('/')) {
      return
    }

    const extension = extname(modulePath)

    if (extension === '.js' || (extension && !scriptExtensions.has(extension))) {
      return
    }

    const absolutePath = resolve(dirname(state.file.opts.filename), modulePath)
    const modulePathWithoutExtension = extension ? modulePath.slice(0, -extension.length) : modulePath

    source.value =
      existsSync(absolutePath) && lstatSync(absolutePath).isDirectory()
        ? `${modulePath}${modulePathWithoutExtension.endsWith('/') ? '' : '/'}index.js`
        : `${modulePathWithoutExtension}.js`
  }

  return {
    visitor: {
      ImportDeclaration: updateSource,
      ExportNamedDeclaration: updateSource,
      ExportAllDeclaration: updateSource,
    },
  }
}

const sharedPresets = ['@babel/typescript', '@babel/preset-react']

const shared = {
  presets: sharedPresets,
  plugins: [],
}

!isBundling && shared.plugins.push('@babel/plugin-transform-runtime')

module.exports = {
  env: {
    esm: {
      ...shared,
      presets: [
        [
          '@babel/env',
          {
            targets: 'chrome 79, last 1 edge version, last 1 safari version, last 1 firefox version, node 14',
            modules: false,
          },
        ],
        ...sharedPresets,
      ],
      plugins: [...shared.plugins, addJsExtensionToLocalScriptImports],
    },
    bundle: {
      ...shared,
      presets: [
        [
          '@babel/env',
          {
            targets: '> 0.5%, last 2 versions, not dead, not IE 11',
          },
        ],
        ...sharedPresets,
      ],
    },
    cjs: {
      ...shared,
      presets: [
        [
          '@babel/env',
          {
            modules: 'commonjs',
            targets: {
              node: '10.0',
            },
          },
        ],
        ...sharedPresets,
      ],
    },
  },
}
