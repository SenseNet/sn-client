import { Card, CardContent, createStyles, makeStyles, Typography } from '@material-ui/core'
import { GatsbyImage } from 'gatsby-plugin-image'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import * as React from 'react'
import { globals } from '../styles/globalStyles'

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      height: '100%',
      borderRadius: `${globals.common.borderRadius}px`,
      display: 'flex',
      flexFlow: 'column',
    },
    image: {
      height: `${globals.common.blogCardImageHeight}px !important`,
      objectFit: 'cover',
      width: '100% !important',
    },
    wrapper: {
      flexGrow: 1,
      padding: '1rem',
      border: '2px solid #13a5ad',
      borderTop: 0,
      borderRadius: `0 0 ${globals.common.borderRadius}px ${globals.common.borderRadius}px`,
    },
    title: {
      margin: '1rem 0',
      fontSize: '20px',
      fontWeight: 700,
    },
    description: {
      marginBottom: '1rem',
    },
  })
})

export interface BlogCardProps {
  title: string
  excerpt: string
  image?: any
}

const BlogCard: React.FC<BlogCardProps> = (props) => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      {props.image && (
        <GatsbyImage className={classes.image} image={props.image.childImageSharp.gatsbyImageData} alt="cover image" />
      )}
      <CardContent className={classes.wrapper}>
        <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
          {props.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="div" className={classes.description}>
          <MDXRenderer>{props.excerpt}</MDXRenderer>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default BlogCard
