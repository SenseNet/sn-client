import { Container } from '@material-ui/core'
import { Link } from 'gatsby'
import * as React from 'react'
import Page from '../components/page'
import IndexLayout from '../layouts'

const NotFoundPage = () => (
  <IndexLayout>
    <Page>
      <Container maxWidth="lg">
        <h1>404: Page not found.</h1>
        <p>
          You have hit the void. <Link to="/">Go back.</Link>
        </p>
      </Container>
    </Page>
  </IndexLayout>
)

export default NotFoundPage
