import { Container } from '@material-ui/core'
import { Link } from 'gatsby'
import * as React from 'react'
import IndexLayout from '../layouts'

const NotFoundPage: React.FC = () => {
  return (
    <IndexLayout>
      <Container maxWidth="lg">
        <h1>404: Page not found.</h1>
        <Link to="/">Go to the main page</Link>
      </Container>
    </IndexLayout>
  )
}

export default NotFoundPage
