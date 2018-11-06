import Avatar from '@material-ui/core/Avatar'
import { Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'

// tslint:disable-next-line:no-var-requires
const defaultAvatar = require('../assets/no-avatar.jpg')

const userPanel = ({ user, repositoryUrl }) => (
    <Avatar
        style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 15 }}
        alt={user.fullName}
        src={user.userAvatarPath.length > 0 ? repositoryUrl + user.userAvatarPath : defaultAvatar}
        aria-label={user.fullName} />
)

const mapStateToProps = (state, match) => {
    return {
        repositoryUrl: Reducers.getRepositoryUrl(state.sensenet),
    }
}

export default connect(
    mapStateToProps,
    {
    })(userPanel)
