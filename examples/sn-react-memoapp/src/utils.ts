export const tuple: any = <T extends string[]>(...args: T) => args
export const widgetTypes: string[] = tuple('markdown', 'query')
