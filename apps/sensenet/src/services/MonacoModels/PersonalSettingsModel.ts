import { LogLevel } from '@furystack/logging'
import { Repository } from '@sensenet/client-core'
import { editor, languages, Uri } from 'monaco-editor'
import defaultLanguage from '../../localization/default'
import { DrawerItemType, widgetTypes } from '../PersonalSettings'
import { BrowseType } from '../../components/content'
import { wellKnownIconNames } from '../../components/Icon'

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
              title: language.personalSettings.dashboard.widgetName,
              default: null,
              required: ['widgetType', 'title'],
              properties: {
                minWidth: {
                  $id: '#/dashboardSection/properties/widgetType',
                  type: 'object',
                  title: language.personalSettings.dashboard.minWidth,
                  properties: {
                    default: { type: ['number', 'string'], default: 250 },
                    mobile: { type: ['number', 'string'] },
                    tablet: { type: ['number', 'string'] },
                    desktop: { type: ['number', 'string'] },
                  },
                  default: { default: 250 },
                },
                widgetType: {
                  $id: '#/dashboardSection/properties/widgetType',
                  type: 'string',
                  enum: [...widgetTypes],
                  title: language.personalSettings.dashboard.widgetType,
                  default: 'markdown',
                  examples: ['query', 'markdown', 'updates'],
                },
                title: {
                  $id: '#/dashboardSection/properties/title',
                  type: 'string',
                  title: language.personalSettings.dashboard.title,
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
                        title: language.personalSettings.dashboard.queryWidget.settings,
                        required: ['query', 'columns'],
                        properties: {
                          query: {
                            $id: '#/dashboardSection/properties/querySettings/properties/term',
                            type: 'string',
                            title: language.personalSettings.dashboard.queryWidget.query,
                            default: '',
                            examples: ['+alba'],
                            pattern: '^(.*)$',
                          },
                          emptyPlaceholderText: {
                            $id: '#/dashboardSection/properties/querySettings/properties/emptyPlaceholderText',
                            type: 'string',
                            title: language.personalSettings.dashboard.queryWidget.emptyPlaceholderText,
                            default: '',
                            examples: ['No results.'],
                            pattern: '^(.*)$',
                          },
                          showColumnNames: {
                            $id: '#/dashboardSection/properties/querySettings/properties/showColumnNames',
                            type: 'boolean',
                            title: language.personalSettings.dashboard.queryWidget.showColumnNames,
                            default: false,
                            examples: [true],
                          },
                          top: {
                            $id: '#/dashboardSection/properties/querySettings/properties/top',
                            type: 'number',
                            title: language.personalSettings.dashboard.queryWidget.top,
                            default: 10,
                            examples: [5, 10, 20],
                          },
                          showOpenInSearch: {
                            $id: '#/dashboardSection/properties/querySettings/properties/showOpenInSearch',
                            type: 'boolean',
                            title: language.personalSettings.dashboard.queryWidget.showOpenInSearch,
                            default: false,
                            examples: [true],
                          },
                          showRefresh: {
                            $id: '#/dashboardSection/properties/querySettings/properties/showRefresh',
                            type: 'boolean',
                            title: language.personalSettings.dashboard.queryWidget.showRefresh,
                            default: false,
                            examples: [true, false],
                          },
                          enableSelection: {
                            $id: '#/dashboardSection/properties/querySettings/properties/enableSelection',
                            type: 'boolean',
                            title: language.personalSettings.dashboard.queryWidget.enableSelection,
                            default: false,
                            examples: [true, false],
                          },
                          countOnly: {
                            $id: '#/dashboardSection/properties/querySettings/properties/countOnly',
                            type: 'boolean',
                            title: language.personalSettings.dashboard.queryWidget.countOnly,
                            default: false,
                            examples: [true],
                          },
                          columns: {
                            $id: '#/dashboardSection/properties/querySettings/properties/columns',
                            type: 'array',
                            title: language.personalSettings.dashboard.queryWidget.columns,
                            uniqueItems: true,
                            examples: [['DisplayName', 'CreatedBy']],
                            items: {
                              enum: [
                                'Actions',
                                'Type',
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
                        title: language.personalSettings.dashboard.markdownWidget.settings,
                        required: ['content'],
                        properties: {
                          content: {
                            $id: '#/dashboardSection/properties/markdownSettings/properties/term',
                            type: 'string',
                            title: language.personalSettings.dashboard.markdownWidget.content,
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
                  items: {
                    type: 'object',
                    properties: {
                      itemType: {
                        type: 'string',
                        enum: [
                          ...DrawerItemType,
                          // 'Content', // -> root
                          // 'Query', //
                          // // 'Content Types', // Query
                          // // 'Localization', // Query
                          // 'Search', // Custom
                          // 'Setup', // Custom
                          // 'Trash', // Custom
                          // // 'Users and Groups', // Content
                          // 'Version info', // Custom
                        ],
                      },
                    },
                    allOf: [
                      {
                        if: { properties: { itemType: { const: 'Content' } } },
                        then: {
                          properties: {
                            settings: {
                              type: 'object',
                              properties: {
                                root: { type: 'string', description: language.drawer.contentRootDescription },
                                title: { type: 'string', description: language.personalSettings.drawerItemTitle },
                                description: {
                                  type: 'string',
                                  description: language.personalSettings.drawerItemDescription,
                                },
                                icon: {
                                  type: 'string',
                                  enum: [...wellKnownIconNames],
                                  description: language.personalSettings.drawerItemDescription,
                                },
                                browseType: {
                                  description: language.personalSettings.contentBrowseType,
                                  enum: [...BrowseType],
                                },
                              },
                              required: ['root', 'title', 'icon'],
                            },
                          },
                          required: ['settings'],
                        },
                      },
                      {
                        if: { properties: { itemType: { const: 'Query' } } },
                        then: {
                          properties: {
                            settings: {
                              type: 'object',
                              properties: {
                                term: { type: 'string', description: language.drawer.contentRootDescription },
                                columns: {
                                  type: 'array',
                                  title: language.personalSettings.dashboard.queryWidget.columns,
                                  uniqueItems: true,
                                  examples: [['DisplayName', 'CreatedBy']],
                                  items: {
                                    enum: [
                                      'Actions',
                                      'Type',
                                      ...repo.schemas.getSchemaByName('GenericContent').FieldSettings.map(f => f.Name),
                                    ],
                                  },
                                },
                                title: { type: 'string', description: language.personalSettings.drawerItemTitle },
                                description: {
                                  type: 'string',
                                  description: language.personalSettings.drawerItemDescription,
                                },
                                icon: {
                                  type: 'string',
                                  enum: [...wellKnownIconNames],
                                  description: language.personalSettings.drawerItemDescription,
                                },
                              },
                              required: ['title', 'icon', 'term'],
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
                  enum: [...BrowseType],
                },
                fields: {
                  description: language.personalSettings.contentFields,
                  type: 'array',
                  uniqueItems: true,
                  items: {
                    enum: [
                      'Actions',
                      'Type',
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
