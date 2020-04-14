import { MetadataAction } from '@sensenet/client-core'
import { languages, Uri } from 'monaco-editor'

const getJsonType = (type: string) => {
  const lowerType = type.toLowerCase()
  if (lowerType.includes('[]')) {
    return 'array'
  }
  if (
    lowerType.includes('number') ||
    lowerType.includes('int') ||
    lowerType.includes('double') ||
    lowerType.includes('float')
  ) {
    return 'number'
  }
  if (lowerType.includes('bool')) {
    return 'boolean'
  }
  if (lowerType.includes('object')) {
    return 'object'
  }
  return 'string'
}

export const createCustomActionModel = (uri: Uri, actionMetadata: MetadataAction) => {
  const uriString = uri.toString()

  const properties: any = {}
  actionMetadata.parameters.forEach((prop) => (properties[prop.name] = { type: getJsonType(prop.type) }))

  languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: false,
    schemas: [
      {
        uri: uriString.toString(),
        fileMatch: [uriString],
        schema: {
          type: 'object',
          required: actionMetadata.parameters.filter((p) => p.required).map((p) => p.name),
          properties,
        },
      },
    ],
  })
}
