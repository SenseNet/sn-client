import * as React from 'react'
import { Reducers } from 'sn-redux'
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';

const styles = {
    avatar: {
        margin: '10px 0',
        background: '#fff'
    },
};

const defaultAvatar = require('../assets/no-avatar.jpg')

const UserPanel = ({ user, repositoryUrl }) => (
    <Avatar
        alt={user.fullName}
        src={user.userAvatarPath.length > 0 ? repositoryUrl + user.userAvatarPath : defaultAvatar}
        style={styles.avatar}
        title={user.fullName}
        aria-label={user.fullName} />
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