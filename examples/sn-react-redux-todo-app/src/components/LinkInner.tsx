import Button from '@material-ui/core/Button'
import * as React from 'react'
import { Link } from 'react-router-dom'

const styles = {
  active: {
    borderBottom: 'solid 2px #fff',
    color: '#fff',
    textDecoration: 'none',
  },
  tabButton: {
    color: '#fff',
  },
}

export interface FilterLinkProps {
  active
  children
  onClick
}

class InnerLink extends React.Component<FilterLinkProps, {}> {
  public render() {
    return (
      <Button color="secondary" style={styles.tabButton}>
        <Link
          to={this.props.children === 'All' ? '/browse/All' : '/browse/' + this.props.children}
          onClick={() => {
            this.props.onClick()
          }}
          style={this.props.active ? styles.active : { color: '#fff', textDecoration: 'none' }}>
          {this.props.children}
        </Link>
      </Button>
    )
  }
}

export default InnerLink
