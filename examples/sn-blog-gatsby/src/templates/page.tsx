import { Container, createStyles, makeStyles, Link as MaterialLink, Typography } from '@material-ui/core'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { graphql, Link } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import * as React from 'react'
import Page from '../components/page'
import IndexLayout from '../layouts'
import { globals, useGlobalStyles } from '../styles/globalStyles'

const useStyles = makeStyles(() => {
  return createStyles({
    postHeader: {
      alignSelf: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontWeight: 500,
    },
    link: {
      color: globals.common.linkColor,
    },
    date: {
      marginRight: '1rem',
    },
    image: {
      maxHeight: '400px',
      objectFit: 'cover',
      objectPosition: 'center',
      width: '100%',
      marginBottom: '4rem',
      alignSelf: 'center',
    },
    markdown: {
      '& img': {
        maxWidth: '100%',
      },
    },
  })
})

interface PageTemplateProps {
  data: {
    site: {
      siteMetadata: {
        title: string
        description: string
      }
    }
    blogPost: {
      Body: string
      Lead: string
      DisplayName: string
      Author: string
      PublishDate: string
      fields: {
        slug: string
      }
      markdownBody: {
        childMdx: {
          body: any
        }
      }
      markdownLead: {
        childMdx: {
          body: any
        }
      }
    }
  }
}

const PageTemplate: React.FC<PageTemplateProps> = ({ data }) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  const authors = data.blogPost.Author.split(',')

  return (
    <IndexLayout>
      <Page>
        <Container maxWidth="lg" className={globalClasses.container}>
          <Link to="/" className={classes.link}>
            Back to blog
          </Link>
          <div className={classes.postHeader}>
            <Typography variant="h2" className={classes.title}>
              {data.blogPost.DisplayName}
            </Typography>
            <Typography variant="subtitle1">
              <span className={classes.date}>{format(parseISO(data.blogPost.PublishDate), 'PP')}</span>
              {authors.map((author, index) => (
                <>
                  {index !== 0 && ', '}
                  <MaterialLink
                    key={author}
                    href={`https://github.com/${author}`}
                    target="_blank"
                    rel="noopener"
                    className={classes.link}>
                    {author}
                  </MaterialLink>
                </>
              ))}
            </Typography>
          </div>

          <MDXRenderer>{data.blogPost.markdownBody.childMdx.body}</MDXRenderer>
        </Container>
      </Page>
    </IndexLayout>
  )
}

export default PageTemplate

export const query = graphql`
  query PageTemplateQuery($slug: String!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    blogPost(fields: { slug: { eq: $slug } }) {
      Body
      Lead
      DisplayName
      Author
      PublishDate
      fields {
        slug
      }
      markdownBody {
        childMdx {
          body
        }
      }
      markdownLead {
        childMdx {
          body
        }
      }
    }
  }
`
