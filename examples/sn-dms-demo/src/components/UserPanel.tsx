import Avatar from '@material-ui/core/Avatar'
import { Reducers } from '@sensenet/redux'
import { fullName, userAvatarPath, userContent, userLanguage, userName } from '@sensenet/redux/dist/reducers'
import * as React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../store/rootReducer'

// tslint:disable-next-line:no-var-requires
const defaultAvatar = require('../assets/no-avatar.jpg')

const mapStateToProps = (state: rootStateType) => {
    return {
        repositoryUrl: Reducers.getRepositoryUrl(state.sensenet),
        user: state.sensenet.session.user,
    }
}

const userPanel = ({ user, repositoryUrl }: {
    user: {
        userName: ReturnType<typeof userName>,
        fullName: ReturnType<typeof fullName>,
        userLanguage: ReturnType<typeof userLanguage>,
        userAvatarPath: ReturnType<typeof userAvatarPath>,
        content: ReturnType<typeof userContent>,
    }, repositoryUrl: string,
}) => (
        <Avatar
            style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 15 }}
            alt={user.fullName}
            src={user.userAvatarPath.length > 0 ? repositoryUrl + user.userAvatarPath : defaultAvatar}
            aria-label={user.fullName} />
    )

export default connect(
    mapStateToProps,
    {
    })(userPanel as React.StatelessComponent)
