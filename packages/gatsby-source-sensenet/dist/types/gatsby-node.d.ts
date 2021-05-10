import { ODataParams } from '@sensenet/client-core'
import { GatsbyNode, PluginOptions } from 'gatsby'
export interface PluginConfig extends PluginOptions {
  host: string
  path: string
  oDataOptions: ODataParams<any>
  accessToken: string
  level: number
}
export declare const sourceNodes: GatsbyNode['sourceNodes']
//# sourceMappingURL=gatsby-node.d.ts.map
