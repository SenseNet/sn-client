import { Link } from 'gatsby'
import * as React from 'react'

import Container from '../components/Container'
import Page from '../components/Page'
import IndexLayout from '../layouts'

const NotFoundPage = () => (
  <IndexLayout>
    <Page>
      <Container>
        <h1>404: Page not found.</h1>
        <p>
          You have hit the void. <Link to="/">Go back.</Link>
        </p>
      </Container>
    </Page>
  </IndexLayout>
)

export default NotFoundPage
