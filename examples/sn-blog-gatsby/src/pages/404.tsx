import { Container } from '@material-ui/core'
import { Link } from 'gatsby'
import * as React from 'react'
import Page from '../components/page'
import IndexLayout from '../layouts'
import { useGlobalStyles } from '../styles/globalStyles'

const NotFoundPage: React.FC = () => {
  const globalClasses = useGlobalStyles()

  return (
    <IndexLayout>
      <Page>
        <Container maxWidth="lg" className={globalClasses.container}>
          <h1>404: Page not found.</h1>
          <Link to="/">Go back.</Link>
        </Container>
      </Page>
    </IndexLayout>
  )
}

export default NotFoundPage
