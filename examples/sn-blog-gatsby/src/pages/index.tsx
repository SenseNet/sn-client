import { Container, createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import { graphql, Link } from 'gatsby'
import * as React from 'react'
import BlogCard from '../components/blog-card'
import Page from '../components/page'
import IndexLayout from '../layouts'

const useStyles = makeStyles(() => {
  return createStyles({
    blog: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    blogItem: {
      minHeight: '350px',
      overflow: 'hidden',
      padding: 0,
    },
    link: {
      textDecoration: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    title: {
      textAlign: 'center',
      fontWeight: 500,
      marginBottom: '3rem',
    },
  })
})

export interface PostNode {
  node: {
    DisplayName: string
    Keywords: string
    Author: string
    PublishDate: Date
    leadImage: any
    fields: {
      slug: string
    }
    markdownLead: {
      childMdx: {
        body: any
      }
    }
  }
}
export interface IndexPageProps {
  data: {
    allBlogPost: {
      edges: PostNode[]
    }
  }
}

const IndexPage: React.FC<IndexPageProps> = (props) => {
  const { data } = props
  const classes = useStyles()
  return (
    <IndexLayout>
      <Page>
        <Container maxWidth="lg">
          <Typography variant="h2" className={classes.title}>
            News around sensenet
          </Typography>
          <Grid container spacing={4} className={classes.blog}>
            {data.allBlogPost.edges.map(({ node }, index) => (
              <Grid item xs={12} sm={6} md={4} className={classes.blogItem} key={index}>
                <Link to={node.fields.slug} key={index} className={classes.link}>
                  <BlogCard title={node.DisplayName} excerpt={node.markdownLead.childMdx.body} image={node.leadImage} />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Page>
    </IndexLayout>
  )
}

export default IndexPage

export const query = graphql`
  query MyQuery {
    allBlogPost {
      edges {
        node {
          id
          Name
          DisplayName
          Keywords
          Author
          PublishDate
          leadImage {
            childImageSharp {
              gatsbyImageData(layout: FIXED)
            }
          }
          fields {
            slug
          }
          markdownLead {
            childMdx {
              body
            }
          }
        }
      }
    }
  }
`
