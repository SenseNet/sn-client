import { UniversalHeader } from '@sensenet/universal-header-react'
import { CssBaseline } from '@material-ui/core'
import { graphql, StaticQuery } from 'gatsby'
import * as React from 'react'
import Helmet from 'react-helmet'

import LayoutMain from '../components/LayoutMain'
import LayoutRoot from '../components/LayoutRoot'

interface StaticQueryProps {
  site: {
    siteMetadata: {
      title: string
      description: string
      keywords: string
    }
  }
}

const IndexLayout: React.FC = ({ children }) => (
  <StaticQuery
    query={graphql`
      query IndexLayoutQuery {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `}
    render={(data: StaticQueryProps) => (
      <>
        <CssBaseline />
        <LayoutRoot>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: 'description', content: data.site.siteMetadata.description },
              { name: 'keywords', content: data.site.siteMetadata.keywords },
            ]}
          />
          <UniversalHeader title="Gatsby example" />
          <LayoutMain>{children}</LayoutMain>
        </LayoutRoot>
      </>
    )}
  />
)

export default IndexLayout
