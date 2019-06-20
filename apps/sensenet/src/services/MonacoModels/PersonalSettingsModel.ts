import { LogLevel } from '@furystack/logging'
import { Repository } from '@sensenet/client-core'
import { editor, languages, Uri } from 'monaco-editor'
import defaultLanguage from '../../localization/default'
import { widgetTypes } from '../PersonalSettings'

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
            dashboardSection: {
              $id: '#/dashboardSection',
              type: 'object',
              title: 'Query widget',
              default: null,
              required: ['widgetType', 'title'],
              properties: {
                width: {
                  $id: '#/dashboardSection/properties/widgetType',
                  type: 'number',
                  title: 'The minimum width of the widget in pixels',
                  default: 250,
                  examples: [250, 500],
                },
                widgetType: {
                  $id: '#/dashboardSection/properties/widgetType',
                  type: 'string',
                  enum: [...widgetTypes],
                  title: 'Type of the widget',
                  default: 'markdown',
                  examples: ['query', 'markdown'],
                },
                title: {
                  $id: '#/dashboardSection/properties/title',
                  type: 'string',
                  title: 'Widget title',
                  default: '',
                  pattern: '^(.*)$',
                },
              },
              allOf: [
                {
                  if: { properties: { widgetType: { const: 'query' } } },
                  then: {
                    required: ['settings'],
                    properties: {
                      settings: {
                        $id: '#/dashboardSection/properties/querySettings',
                        type: 'object',
                        title: 'Settings for the Query widget',
                        required: ['query', 'columns'],
                        properties: {
                          query: {
                            $id: '#/dashboardSection/properties/querySettings/properties/term',
                            type: 'string',
                            title: 'The content query',
                            default: '',
                            examples: ['+alba'],
                            pattern: '^(.*)$',
                          },
                          showColumnNames: {
                            $id: '#/dashboardSection/properties/querySettings/properties/showColumnNames',
                            type: 'boolean',
                            title: 'Show column names',
                            default: false,
                            examples: [true],
                          },
                          top: {
                            $id: '#/dashboardSection/properties/querySettings/properties/showColumnNames',
                            type: 'number',
                            title: 'Limits the number of hits',
                            default: 10,
                            examples: [5, 10, 20],
                          },
                          showOpenInSearch: {
                            $id: '#/dashboardSection/properties/querySettings/properties/showOpenInSearch',
                            type: 'boolean',
                            title: 'Display a link to the Search view',
                            default: false,
                            examples: [true],
                          },
                          showRefresh: {
                            $id: '#/dashboardSection/properties/querySettings/properties/showRefresh',
                            type: 'boolean',
                            title: 'Display a refresh button',
                            default: false,
                            examples: [true, false],
                          },
                          columns: {
                            $id: '#/dashboardSection/properties/querySettings/properties/columns',
                            type: 'array',
                            title: 'Columns to display',
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
                    },
                  },
                },
                {
                  if: { properties: { widgetType: { const: 'markdown' } } },
                  then: {
                    required: ['settings'],
                    properties: {
                      settings: {
                        type: 'object',
                        title: 'Settings for the Markdown widget',
                        required: ['content'],
                        properties: {
                          content: {
                            $id: '#/dashboardSection/properties/markdownSettings/properties/term',
                            type: 'string',
                            title: 'The Markdown content',
                            default: '',
                            examples: [
                              "### Hey I'm a Paragraph \r\n Hey, I'm not",
                              '![jeeeee](https://imgix.ranker.com/user_node_img/50088/1001748292/original/like-a-turtle-and-part-fish-photo-u4?w=650&q=50&fm=pjpg&fit=crop&crop=faces "teknőc e")',
                            ],
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
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
                dashboard: {
                  type: 'array',
                  description: 'The customized Dashboard for the Repository',
                  items: { $ref: '#definitions/dashboardSection' },
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
            dashboards: {
              type: 'object',
              title: 'The default Dashboard definitions',
              properties: {
                globalDefault: {
                  type: 'array',
                  description: 'The customized Dashboard for the Repository',
                  items: { $ref: '#definitions/dashboardSection' },
                },
                repositoryDefault: {
                  type: 'array',
                  description: 'The customized Dashboard for the Repository',
                  items: { $ref: '#definitions/dashboardSection' },
                },
              },
            },
            lastRepository: { type: 'string', description: language.personalSettings.lastRepository },
            eventLogSize: { type: 'number', description: language.personalSettings.eventLogSize },
            logLevel: {
              type: 'array',
              uniqueItems: true,
              items: {
                enum: [
                  ...Object.entries(LogLevel)
                    .filter(entry => !isNaN(entry[1]))
                    .map(entry => entry[0]),
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
