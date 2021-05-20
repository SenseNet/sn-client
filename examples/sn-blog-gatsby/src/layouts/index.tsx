import { UniversalHeader } from '@sensenet/universal-header-react'
import { createStyles, CssBaseline, makeStyles } from '@material-ui/core'
import { graphql, StaticQuery } from 'gatsby'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import LayoutMain from '../components/layout-main'
import LayoutRoot from '../components/layout-root'
import { globals } from '../styles/globalStyles'

const useHeaderStyle = makeStyles(() => {
  return createStyles({
    appBar: {
      backgroundColor: globals.common.headerColor,
    },
  })
})

interface StaticQueryProps {
  site: {
    siteMetadata: {
      title: string
      description: string
      keywords: string
    }
  }
}

const IndexLayout: React.FC = ({ children }) => {
  const headerStyle = useHeaderStyle()

  return (
    <StaticQuery
      query={graphql`
        query IndexLayoutQuery {
          site {
            siteMetadata {
              title
              description
              keywords
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
            <UniversalHeader title="Gatsby example" classes={headerStyle} />
            <LayoutMain>{children}</LayoutMain>
          </LayoutRoot>
        </>
      )}
    />
  )
}

export default IndexLayout
