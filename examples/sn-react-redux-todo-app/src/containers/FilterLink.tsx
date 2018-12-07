import { connect } from 'react-redux'
import InnerLink from '../components/LinkInner'
import { setVisibilityFilter } from '../reducers/filtering'

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.listByFilter.VisibilityFilter,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    },
  }
}

const filterLink = connect(
  mapStateToProps,
  mapDispatchToProps,
)(InnerLink)

export default filterLink
