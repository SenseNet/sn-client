import { Repository } from '@sensenet/client-core'
import { editor, languages, Uri } from 'monaco-editor'
import defaultLanguage from '../../localization/default'

export const setupModel = (language = defaultLanguage, repo: Repository) => {
  const personalSettingsPath = `sensenet://PersonalSettings/PersonalSettings`
  const uri = Uri.parse(personalSettingsPath)
  const uriString = uri.toString()

  languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: false,
    schemas: [
      {
        uri: uriString.toString(),
        fileMatch: [uriString],
        schema: {
          definitions: {
            drawer: {
              type: 'object',
              description: language.personalSettings.drawer,
              properties: {
                enabled: { type: 'boolean', description: language.personalSettings.drawerEnable },
                type: {
                  description: language.personalSettings.drawerType,
                  enum: ['temporary', 'permanent', 'mini-variant'],
                },
                items: {
                  description: language.personalSettings.drawerItems,
                  type: 'array',
                  uniqueItems: true,
                  items: { enum: ['Content', 'Search', 'Users and Groups', 'Setup', 'Version info', 'Events'] },
                },
              },
            },
            repository: {
              type: 'object',
              required: ['url'],
              properties: {
                url: {
                  type: 'string',
                  description: language.personalSettings.repositoryUrl,
                },
                loginName: {
                  type: 'string',
                  description: language.personalSettings.repositoryLoginName,
                },
                displayName: {
                  type: 'string',
                  description: language.personalSettings.repositoryDisplayName,
                },
              },
            },
            repositories: {
              type: 'array',
              description: language.personalSettings.repositoryTitle,
              items: { $ref: '#/definitions/repository' },
            },
            commandPalette: {
              type: 'object',
              description: language.personalSettings.commandPaletteTitle,
              properties: {
                enabled: { type: 'boolean', description: language.personalSettings.commandPaletteEnable },
                wrapQuery: {
                  type: 'string',
                  description: language.personalSettings.commandPaletteWrapQuery,
                },
              },
            },
            content: {
              type: 'object',
              description: language.personalSettings.contentTitle,
              properties: {
                browseType: {
                  description: language.personalSettings.contentBrowseType,
                  enum: ['simple', 'commander', 'explorer'],
                },
                fields: {
                  description: language.personalSettings.contentFields,
                  type: 'array',
                  uniqueItems: true,
                  items: {
                    enum: [
                      'Actions',
                      'Type',
                      /** ToDo: check for other displayable system fields */
                      ...repo.schemas.getSchemaByName('GenericContent').FieldSettings.map(f => f.Name),
                    ],
                  },
                },
              },
            },
            settings: {
              type: 'object',
              description: language.personalSettings.platformDependentTitle,
              properties: {
                theme: { enum: ['dark', 'light'], description: language.personalSettings.themeTitle },
                content: { $ref: '#/definitions/content' },
                drawer: { $ref: '#/definitions/drawer' },
                commandPalette: { $ref: '#/definitions/commandPalette' },
              },
            },
          },
          type: 'object',
          required: ['default', 'repositories', 'lastRepository'],
          properties: {
            default: { $ref: '#/definitions/settings' },
            mobile: { $ref: '#/definitions/settings' },
            tablet: { $ref: '#/definitions/settings' },
            desktop: { $ref: '#/definitions/settings' },
            repositories: { $ref: '#/definitions/repositories' },
            lastRepository: { type: 'string', description: language.personalSettings.lastRepository },
            eventLogSize: { type: 'number', description: language.personalSettings.eventLogSize },
            sendLogWithCrashReports: {
              type: 'boolean',
              description: language.personalSettings.sendLogWithCrashReports,
            },
            language: {
              description: language.personalSettings.languageTitle,
              enum: ['default', 'hungarian'],
            },
          },
        },
      },
    ],
  })
  const existingModel = editor.getModel(uri)
  if (!existingModel) {
    return editor.createModel('', 'json', Uri.parse(personalSettingsPath))
  }
}
