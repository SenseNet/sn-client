import { PathHelper } from '@sensenet/client-utils'
import { ActionModel, GenericContent, isActionModel } from '@sensenet/default-content-types'
import { PATHS } from '../application-paths'

export const FULLSCREEN_EDIT_ACTION = 'EditBinary'

const fullscreenEditRoots = [PATHS.settings.snPath, PATHS.localization.snPath, PATHS.contentTypes.snPath]
const fullscreenEditSystemTypes = new Set(['Settings', 'Resource', 'ContentType'])

// Only explicitly recognized text formats may be opened in the binary text editor.
const fullscreenEditFileExtensions = new Set([
  'adoc',
  'asax',
  'ascx',
  'asp',
  'aspx',
  'bash',
  'bat',
  'c',
  'cc',
  'cfg',
  'cjs',
  'cmd',
  'conf',
  'config',
  'cpp',
  'cs',
  'cshtml',
  'css',
  'cts',
  'csv',
  'cxx',
  'ejs',
  'env',
  'fish',
  'go',
  'gql',
  'graphql',
  'h',
  'hbs',
  'hpp',
  'htm',
  'html',
  'hxx',
  'ics',
  'ini',
  'java',
  'js',
  'json',
  'json5',
  'jsonc',
  'jsonl',
  'jsx',
  'kt',
  'kts',
  'less',
  'log',
  'lua',
  'markdown',
  'md',
  'mjs',
  'mts',
  'mustache',
  'ndjson',
  'php',
  'phtml',
  'pl',
  'pm',
  'properties',
  'ps1',
  'psd1',
  'psm1',
  'py',
  'r',
  'razor',
  'rb',
  'resx',
  'rs',
  'rst',
  'sass',
  'scala',
  'scss',
  'settings',
  'sh',
  'sql',
  'svelte',
  'svg',
  'swift',
  'tex',
  'text',
  'toml',
  'ts',
  'tsv',
  'tsx',
  'txt',
  'vb',
  'vbhtml',
  'vcf',
  'vue',
  'xaml',
  'xhtml',
  'xml',
  'xsd',
  'xsl',
  'xslt',
  'yaml',
  'yml',
  'zsh',
])

export const supportsFullscreenEdit = (content: GenericContent) => {
  if (!content.Path || content.IsFolder === true || content.Type?.endsWith('Folder')) {
    return false
  }

  if (
    isActionModel(content.Actions) &&
    content.Actions.some((action) => ['Edit', FULLSCREEN_EDIT_ACTION].includes(action.Name) && action.Forbidden)
  ) {
    return false
  }

  // System documents have well-defined text binaries, even when their names have no extension.
  const containingRoot = fullscreenEditRoots.find((rootPath) => PathHelper.isInSubTree(content.Path, rootPath))
  if (containingRoot && content.Path !== containingRoot && fullscreenEditSystemTypes.has(content.Type)) {
    return true
  }

  const fileName = content.Name || content.Path.split('/').pop() || ''
  const extension = fileName.match(/\.([^.]+)$/)?.[1].toLowerCase()
  return (
    (content.IsFile === true || content.Type === 'File') &&
    extension !== undefined &&
    fullscreenEditFileExtensions.has(extension)
  )
}

export const addFullscreenEditAction = (
  content: GenericContent,
  actions: ActionModel[],
  displayName?: string,
): ActionModel[] => {
  if (!supportsFullscreenEdit(content)) {
    return actions.some((action) => action.Name === FULLSCREEN_EDIT_ACTION)
      ? actions.filter((action) => action.Name !== FULLSCREEN_EDIT_ACTION)
      : actions
  }

  if (actions.some((action) => action.Name === FULLSCREEN_EDIT_ACTION)) {
    return actions
  }

  const fullscreenEditAction = {
    Name: FULLSCREEN_EDIT_ACTION,
    DisplayName: displayName || 'Full-screen edit',
  } as ActionModel
  const editActionIndex = actions.findIndex((action) => action.Name === 'Edit')

  if (editActionIndex === -1) {
    return [...actions, fullscreenEditAction]
  }

  return [...actions.slice(0, editActionIndex + 1), fullscreenEditAction, ...actions.slice(editActionIndex + 1)]
}
