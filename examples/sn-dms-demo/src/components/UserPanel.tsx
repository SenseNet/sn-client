import { Reducers } from '@sensenet/redux'
import Avatar from 'material-ui/Avatar'
import * as React from 'react'
import { connect } from 'react-redux'

const styles = {
    avatar: {
        margin: '10px 0',
    },
}

// tslint:disable-next-line:no-var-requires
const defaultAvatar = require('../assets/no-avatar.jpg')

const userPanel = ({ user, repositoryUrl }) => (
    <div style={styles.avatar}>
        <Avatar
            alt={user.fullName}
            src={user.userAvatarPath.length > 0 ? repositoryUrl + user.userAvatarPath : defaultAvatar}
            aria-label={user.fullName} />
    </div>
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
