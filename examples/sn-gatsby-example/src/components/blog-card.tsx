import { Card, CardActionArea, CardContent, CardMedia, createStyles, makeStyles, Typography } from '@material-ui/core'
import * as React from 'react'

const useStyles = makeStyles(() => {
  return createStyles({
    blogCard: {},
  })
})

export interface BlogCardProps {
  title: string
  excerpt: string
}

const BlogCard: React.FC<BlogCardProps> = (props) => {
  const classes = useStyles()

  return (
    <Card className={classes.blogCard}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default BlogCard
