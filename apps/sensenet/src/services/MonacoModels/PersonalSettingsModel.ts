import { LogLevel } from '@sensenet/client-utils'
import { BrowseType } from '../../components/content'
import defaultLanguage from '../../localization/default'
import { ActionType, CustomDrawerItemType } from '../PersonalSettings'

export const setupModel = async (language = defaultLanguage) => {
  const { monaco } = await import('react-monaco-editor')

  const personalSettingsPath = `sensenet://PersonalSettings/PersonalSettings`
  const uri = monaco.Uri.parse(personalSettingsPath)
  const uriString = uri.toString()

  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
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
                  items: {
                    type: 'object',
                    properties: {
                      itemType: {
                        type: 'string',
                        enum: [...CustomDrawerItemType],
                      },
                      permissions: {
                        type: 'array',
                        description: language.personalSettings.drawerItemPermissions,
                        items: {
                          type: 'object',
                          properties: {
                            path: { type: 'string', description: language.personalSettings.drawerItemPermissionPath },
                            action: {
                              type: 'string',
                              description: language.personalSettings.drawerItemPermissionName,
                              enum: [...ActionType],
                            },
                          },
                          required: ['path', 'action'],
                        },
                      },
                    },
                    allOf: [
                      {
                        if: { properties: { itemType: { const: 'CustomContent' } } },
                        then: {
                          properties: {
                            settings: {
                              type: 'object',
                              properties: {
                                root: {
                                  type: 'string',
                                  description: language.personalSettings.drawerCustomContentRoot,
                                },
                                appPath: {
                                  type: 'string',
                                  description: language.personalSettings.drawerCustomContentAppPath,
                                },
                                columns: { $ref: '#/definitions/columns' },
                              },
                              required: ['root', 'appPath'],
                            },
                          },
                          required: ['settings'],
                        },
                      },
                    ],
                  },
                },
              },
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
                  enum: [...BrowseType],
                },
                fields: { $ref: '#/definitions/columns' },
                root: { type: 'string', description: language.drawer.contentRootDescription },
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
          properties: {
            default: { $ref: '#/definitions/settings' },
            mobile: { $ref: '#/definitions/settings' },
            tablet: { $ref: '#/definitions/settings' },
            desktop: { $ref: '#/definitions/settings' },
            eventLogSize: { type: 'number', description: language.personalSettings.eventLogSize },
            logLevel: {
              type: 'array',
              uniqueItems: true,
              items: {
                enum: [
                  ...Object.entries(LogLevel)
                    .filter((entry) => !isNaN(entry[1] as LogLevel))
                    .map((entry) => entry[0]),
                ],
              },
            },
            sendLogWithCrashReports: {
              type: 'boolean',
              description: language.personalSettings.sendLogWithCrashReports,
            },
            language: {
              description: language.personalSettings.languageTitle,
              enum: ['default', 'hungarian'],
            },
            uploadHandlers: { type: 'array', description: language.personalSettings.uploadHandlerTitle },
          },
        },
      },
    ],
  })

  const existingModel = monaco.editor.getModel(uri)
  if (!existingModel) {
    return monaco.editor.createModel('', 'json', monaco.Uri.parse(personalSettingsPath))
  }
}
