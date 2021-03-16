import { graphql, Link } from 'gatsby'
import * as React from 'react'
import Container from '../components/Container'
import Page from '../components/Page'
import IndexLayout from '../layouts'

export interface PostNode {
  node: {
    excerpt: string
    frontmatter: {
      layout: string
      title: string
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

  console.log('Das ist das', data.allMarkdownRemark.edges)

  return (
    <IndexLayout>
      <Page>
        <Container>
          <h1>Hi people</h1>
          {data.allMarkdownRemark.edges.map(({ node }, index) => (
            <Link to={node.fields.slug} key={index}>
              <div key={index}>{node.frontmatter.title}</div>
              <div key={index}>{node.excerpt}</div>
            </Link>
          ))}
        </Container>
      </Page>
    </IndexLayout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    allMarkdownRemark {
      edges {
        node {
          fields {
            slug
          }
          excerpt
          frontmatter {
            layout
            title
          }
        }
      }
    }
  }
`
