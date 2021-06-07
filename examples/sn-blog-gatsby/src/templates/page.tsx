import { Container, createStyles, makeStyles, Link as MuiLink, Typography } from '@material-ui/core'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { graphql, Link } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import * as React from 'react'
import IndexLayout from '../layouts'
import { commonElementStyles, globals } from '../styles/globalStyles'

const useCommonElementStyle = makeStyles(commonElementStyles)

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
    sensenetBlogPost: {
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
  const commonClasses = useCommonElementStyle()

  const authors = data.sensenetBlogPost.Author.split(',')

  return (
    <IndexLayout>
      <article>
        <Container maxWidth="lg" className={commonClasses.container}>
          <Link to="/" className={classes.link}>
            Back to (post) list
          </Link>
          <div className={classes.postHeader}>
            <Typography variant="h2" className={classes.title}>
              {data.sensenetBlogPost.DisplayName}
            </Typography>
            <Typography variant="subtitle1">
              <span className={classes.date}>{format(parseISO(data.sensenetBlogPost.PublishDate), 'PP')}</span>
              {authors.map((author, index) => (
                <>
                  {index !== 0 && ', '}
                  <MuiLink
                    key={author}
                    href={`https://github.com/${author}`}
                    target="_blank"
                    rel="noopener"
                    className={classes.link}>
                    {author}
                  </MuiLink>
                </>
              ))}
            </Typography>
          </div>
          <MDXRenderer>{data.sensenetBlogPost.markdownBody.childMdx.body}</MDXRenderer>
        </Container>
      </article>
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
    sensenetBlogPost(fields: { slug: { eq: $slug } }) {
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
