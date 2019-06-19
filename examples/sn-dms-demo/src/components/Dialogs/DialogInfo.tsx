import Avatar from '@material-ui/core/Avatar'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'
import MediaQuery from 'react-responsive'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'

const styles = {
  contentName: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    flexShrink: 0,
    marginRight: 5,
  },
  avatar: {
    flexShrink: 0,
    marginRight: 5,
  },
  displayName: {
    fontSize: 16,
  },
  displayNameMobile: {
    fontFamily: 'Raleway SemiBold',
    fontSize: 14,
  },
  tableHead: {
    fontFamily: 'Raleway SemiBold',
    fontSize: 12,
    color: '#000',
    border: 0,
    paddingBottom: 0,
  },
  tableHeadMobile: {
    fontFamily: 'Raleway SemiBold',
    fontSize: 12,
    color: '#000',
    border: 0,
    paddingBottom: 0,
    whiteSpace: 'nowrap',
    paddingRight: 20,
  },
  tableCell: {
    border: 0,
    fontStyle: 'italic',
    fontSize: 12,
  },
  tableCellMobile: {
    border: 0,
    fontStyle: 'italic',
    fontSize: 12,
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    fontFamily: 'Raleway Semibold',
    opacity: 0.54,
  },
  tableRow: {
    height: 24,
  },
  table: {
    boxShadow: '0px 0px 3px 0px rgba(0,0,0,0.3)',
    marginTop: 10,
  },
  inner: {
    fontFamily: 'Raleway Medium',
    fontSize: 14,
    margin: '20px 0',
  },
}

interface DialogInfoProps {
  currentContent: GenericContent | null
  hideVersionInfo?: boolean
  repositoryUrl: string
}

class DialogInfo extends React.Component<{ classes: any } & DialogInfoProps, {}> {
  public render() {
    const { classes, currentContent, repositoryUrl } = this.props
    const icon = currentContent ? currentContent.Icon || currentContent.Type : ''
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => (
          <div style={styles.inner}>
            <div style={styles.contentName}>
              {currentContent && currentContent.Type === 'User' ? (
                <Avatar
                  src={`${repositoryUrl}${currentContent ? (currentContent as any).Avatar.Url : ''}`}
                  style={styles.avatar}
                />
              ) : (
                <Icon
                  color="primary"
                  style={styles.icon}
                  iconName={icons[icon.toLowerCase()]}
                  type={iconType.materialui}
                />
              )}
              <span className={matches ? classes.displayName : classes.displayNameMobile}>
                {currentContent ? currentContent.DisplayName : ''}
              </span>
            </div>
            {this.props.hideVersionInfo ? null : (
              <Table>
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell className={matches ? classes.tableHead : classes.tableHeadMobile} padding="none">
                      {resources.VERSIONING_MODE}
                    </TableCell>
                    <TableCell className={matches ? classes.tableHead : classes.tableHeadMobile} padding="none">
                      {resources.PATH}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className={classes.tableRow}>
                    <TableCell className={matches ? classes.tableCell : classes.tableCellMobile} padding="none">
                      {currentContent ? resources.VERSIONING[currentContent.VersioningMode || ''] : ''}
                    </TableCell>
                    <TableCell className={matches ? classes.tableCell : classes.tableCellMobile} padding="none">
                      {currentContent ? currentContent.Path : ''}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </MediaQuery>
    )
  }
}

export default withStyles(styles as any)(DialogInfo)
