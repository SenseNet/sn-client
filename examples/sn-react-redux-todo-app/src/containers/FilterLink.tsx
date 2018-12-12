import Button from '@material-ui/core/Button'
import { Status } from '@sensenet/default-content-types'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { rootStateType } from '..'
import { updateFilter } from '../reducers/todos'

export const mapStateToProps = (state: rootStateType) => {
  return {
    currentFilter: state.todoList.filter,
  }
}

export const mapDispatchToProps = {
  updateFilter,
}

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
  name: string
  status?: Status
}

export interface FilterLinkState {
  isActive: boolean
}

export class InnerLink extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & FilterLinkProps,
  FilterLinkState
> {
  public state: FilterLinkState = {
    isActive: this.props.currentFilter === this.props.status,
  }

  public static getDerivedStateFromProps(props: InnerLink['props']) {
    return {
      isActive: props.currentFilter === props.status,
    }
  }

  public render() {
    return (
      <Button color="secondary" style={styles.tabButton}>
        <Link
          to={this.props.children === 'All' ? '/browse/All' : '/browse/' + this.props.children}
          onClick={() => {
            this.props.updateFilter(this.props.status)
          }}
          style={this.state.isActive ? styles.active : { color: '#fff', textDecoration: 'none' }}>
          {this.props.children}
        </Link>
      </Button>
    )
  }
}

const filterLink = connect(
  mapStateToProps,
  mapDispatchToProps,
)(InnerLink)

export default filterLink
