import { Card, CardContent, createStyles, makeStyles, Typography } from '@material-ui/core'
import * as React from 'react'
const useStyles = makeStyles(() => {
  return createStyles({
    blogCard: {
      height: '100%',
      borderRadius: '25px',
      display: 'flex',
      flexFlow: 'column',
    },
    blogCardMedia: {
      height: '270px',
      objectFit: 'cover',
      width: '100%',
    },
    blogCardContent: {
      flexGrow: 1,
      padding: '1rem',
      border: '2px solid #13a5ad',
      borderTop: 0,
      borderRadius: '0 0 25px 25px',
    },
    blogCardTitle: {
      margin: '1rem 0',
      fontSize: '20px',
      fontWeight: 700,
    },
    blogCardDescription: {
      marginBottom: '1rem',
    },
  })
})

export interface BlogCardProps {
  title: string
  excerpt: string
  image: string
}

const BlogCard: React.FC<BlogCardProps> = (props) => {
  const classes = useStyles()

  return (
    <Card className={classes.blogCard}>
      <img className={classes.blogCardMedia} src={props.image} alt={props.title} />
      <CardContent className={classes.blogCardContent}>
        <Typography gutterBottom variant="h5" component="h2" className={classes.blogCardTitle}>
          {props.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" className={classes.blogCardDescription}>
          {props.excerpt}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default BlogCard
