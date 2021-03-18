import { Container, createStyles, List, ListItem, makeStyles } from '@material-ui/core'
import { graphql, Link } from 'gatsby'
import * as React from 'react'
import BlogCard from '../components/blog-card'
import Page from '../components/page'
import IndexLayout from '../layouts'

const useStyles = makeStyles(() => {
  return createStyles({
    title: {
      marginBottom: '3rem',
      textAlign: 'center',
      fontSize: '4rem',
    },
    blog: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      margin: '0 -15px',
      padding: 0,
      listStyle: 'none',
    },
    blogItem: {
      flexBasis: 'calc(33% - 60px)',
      margin: '40px 15px',
      minHeight: '350px',
      overflow: 'hidden',
      borderRadius: '25px',
    },
  })
})

export interface Image {
  relativePath: string
}

export interface PostNode {
  node: {
    excerpt: string
    frontmatter: {
      title: string
      image: Image
      redirect_to: string
      tags: string
      author: string
      date: Date
    }
    fields: {
      slug: string
    }
  }
}
export interface IndexPageProps {
  data: {
    allMarkdownRemark: {
      edges: PostNode[]
    }
  }
}

const IndexPage: React.FC<IndexPageProps> = (props) => {
  const { data } = props
  const classes = useStyles()

  console.log('Das ist das', data.allMarkdownRemark.edges)

  return (
    <IndexLayout>
      <Page>
        <Container maxWidth="lg">
          <div className={classes.title}>News around sensenet</div>
          <List className={classes.blog}>
            {data.allMarkdownRemark.edges.map(({ node }, index) => (
              <ListItem className={classes.blogItem} key={index}>
                <Link to={node.fields.slug} key={index}>
                  <BlogCard title={node.frontmatter.title} excerpt={node.excerpt} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Container>
      </Page>
    </IndexLayout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
          }
          excerpt
          frontmatter {
            title
            image {
              relativePath
            }
            redirect_to
            tags
            author
            date
          }
        }
      }
    }
  }
`
