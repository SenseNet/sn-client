import { UniversalHeader } from '@sensenet/universal-header-react'
import { createStyles, CssBaseline, makeStyles, MuiThemeProvider } from '@material-ui/core'
import { graphql, StaticQuery } from 'gatsby'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import { globals, useGlobalStyles } from '../styles/globalStyles'
import { theme } from '../theme'

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
  useGlobalStyles()

  return (
    <MuiThemeProvider theme={theme}>
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
            <Helmet
              title={data.site.siteMetadata.title}
              meta={[
                { name: 'description', content: data.site.siteMetadata.description },
                { name: 'keywords', content: data.site.siteMetadata.keywords },
              ]}
            />
            <UniversalHeader title="Gatsby example" classes={headerStyle} appName="sn-blog-gatsby" />
            {children}
          </>
        )}
      />
    </MuiThemeProvider>
  )
}

export default IndexLayout
