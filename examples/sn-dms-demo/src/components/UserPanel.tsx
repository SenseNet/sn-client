import * as React from 'react'
import { Reducers } from 'sn-redux'
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';

const styles = {
    avatar: {
        margin: '10px 0'
    },
};

const defaultAvatar = require('../assets/no-avatar.jpg')

const UserPanel = ({ user, repositoryUrl }) => (
    <div style={styles.avatar}>
    <Avatar
        alt={user.fullName}
        src={user.userAvatarPath.length > 0 ? repositoryUrl + user.userAvatarPath : defaultAvatar}
        aria-label={user.fullName} />
        </div>
)

const mapStateToProps = (state, match) => {
    return {
        repositoryUrl: Reducers.getRepositoryUrl(state.sensenet)
    }
}

export default connect(
    mapStateToProps,
    {
    })(UserPanel);