import { Container, createStyles, makeStyles, Link as MaterialLink, Typography } from '@material-ui/core'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { graphql, Link } from 'gatsby'
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
    markdownRemark: {
      html: string
      excerpt: string
      frontmatter: {
        title: string
        author: string[]
        image: string
        date: string
      }
    }
  }
}

const PageTemplate: React.FC<PageTemplateProps> = ({ data }) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <IndexLayout>
      <Page>
        <Container maxWidth="lg" className={globalClasses.container}>
          <Link to="/" className={classes.link}>
            Back to blog
          </Link>
          <div className={classes.postHeader}>
            <Typography variant="h2" className={classes.title}>
              {data.markdownRemark.frontmatter.title}
            </Typography>
            <Typography variant="subtitle1">
              <span className={classes.date}>{format(parseISO(data.markdownRemark.frontmatter.date), 'PP')}</span>
              {data.markdownRemark.frontmatter.author.map((author, index) => (
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
          <img
            className={classes.image}
            src={`../../${data.markdownRemark.frontmatter.image}`}
            alt={data.markdownRemark.frontmatter.title}
          />
          <div className={classes.markdown} dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt
      frontmatter {
        title
        author
        image
        date
      }
    }
  }
`
