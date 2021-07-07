import { Container } from '@material-ui/core'
import { Link } from 'gatsby'
import * as React from 'react'

const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <h1>404: Page not found.</h1>
      <Link to="/">Go to the main page</Link>
    </Container>
  )
}

export default NotFoundPage
