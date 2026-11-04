import { MetadataAction } from '@sensenet/client-core'

type ActionParameter = MetadataAction['parameters'][number]

export const getEnumValues = (parameter: ActionParameter) => parameter.enumValues

export const getJsonType = (type: string) => {
  const lowerType = type.toLowerCase()
  if (
    lowerType.includes('[]') ||
    lowerType.includes('collection') ||
    lowerType.includes('ienumerable') ||
    lowerType.includes('list<')
  ) {
    return 'array'
  }
  if (
    lowerType.includes('number') ||
    lowerType.includes('int') ||
    lowerType.includes('double') ||
    lowerType.includes('float') ||
    lowerType.includes('decimal') ||
    lowerType.includes('long') ||
    lowerType.includes('short') ||
    lowerType.includes('byte')
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

const getInitialValue = (parameter: ActionParameter) => {
  const enumValues = getEnumValues(parameter)
  if (enumValues?.length) {
    return enumValues[0]
  }

  switch (getJsonType(parameter.type)) {
    case 'array':
      return []
    case 'boolean':
      return false
    case 'number':
      return 0
    case 'object':
      return {}
    default:
      return ''
  }
}

export const createActionParameterTemplate = (parameters: ActionParameter[]) =>
  JSON.stringify(
    parameters.reduce<Record<string, unknown>>((body, parameter) => {
      body[parameter.name] = getInitialValue(parameter)
      return body
    }, {}),
    undefined,
    2,
  )

export const createCustomActionModel = async (
  uri: import('react-monaco-editor').monaco.Uri,
  actionMetadata: MetadataAction,
) => {
  const { monaco } = await import('react-monaco-editor')
  const uriString = uri.toString()

  const properties: any = {}
  actionMetadata.parameters.forEach((parameter) => {
    const enumValues = getEnumValues(parameter)
    properties[parameter.name] = {
      type: getJsonType(parameter.type),
      default: getInitialValue(parameter),
      ...(enumValues?.length ? { enum: enumValues } : {}),
      description: `${parameter.required ? 'Required' : 'Optional'} OData parameter. Type: ${parameter.type}`,
      markdownDescription: `**${parameter.required ? 'Required' : 'Optional'}** OData parameter. Type: \`${
        parameter.type
      }\``,
    }
  })

  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
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
