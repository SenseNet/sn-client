import { Actions } from 'gatsby'
import { PluginConfig } from './gatsby-node'
export declare const snPrefix = 'sensenet'
export declare const createTreeNode: (
  parentNode: any,
  content: any,
  level: number,
  createNodeId: {
    (input: string): string
    (arg0: string): any
  },
  actions: Actions,
  createContentDigest: {
    (input: string | object): string
    (arg0: any): any
  },
  options: PluginConfig,
) => Promise<void>
//# sourceMappingURL=utils.d.ts.map
