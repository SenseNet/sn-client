import { editor, languages, Uri } from 'monaco-editor'

const personalSettingsPath = 'sensenet://settings/PersonalSettings'

const uriString = Uri.parse(personalSettingsPath).toString()
languages.json.jsonDefaults.setDiagnosticsOptions({
  validate: true,
  enableSchemaRequest: false,
  schemas: [
    {
      uri: 'sn-admin-personal-settings',
      fileMatch: [uriString],
      schema: {
        definitions: {
          drawer: {
            type: 'object',
            description: 'Options for the left drawer',
            properties: {
              enabled: { type: 'boolean', description: 'Enable or disable the drawer' },
              items: {
                description: 'An array of enabled items',
                type: 'array',
                uniqueItems: true,
                items: { enum: ['Content', 'Search', 'Users and Groups', 'Setup'] },
              },
            },
          },
          commandPalette: {
            type: 'object',
            description: 'Options for the command palette',
            properties: {
              enabled: { type: 'boolean', description: 'Enable or disable the command palette' },
              wrapQuery: {
                type: 'string',
                description: 'A wrapper for all queries executed from the command palette',
              },
            },
          },
          content: {
            type: 'object',
            description: 'Content browsing and basic editing functions',
            properties: {
              browseType: {
                description:
                  'Choose between a simple list, a two-panel (commander) or a tree + single panel (explorer) style view',
                enum: ['simple', 'commander', 'explorer'],
              },
            },
          },
          settings: {
            type: 'object',
            description: 'One platform dependent setting object',
            properties: {
              theme: { enum: ['dark', 'light'] },
              content: { $ref: '#/definitions/content' },
              drawer: { $ref: '#/definitions/drawer' },
              commandPalette: { $ref: '#/definitions/commandPalette' },
            },
          },
        },
        type: 'object',
        required: ['default'],
        properties: {
          default: { $ref: '#/definitions/settings' },
          mobile: { $ref: '#/definitions/settings' },
          tablet: { $ref: '#/definitions/settings' },
          desktop: { $ref: '#/definitions/settings' },
        },
      },
    },
  ],
})

export const personalSettingsModel = editor.createModel('', 'json', Uri.parse(personalSettingsPath))
