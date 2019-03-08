import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { DropFileArea } from './DropFileArea'
import { Icon } from './Icon'

export interface BreadcrumbItem {
  url: string
  displayName: string
  title: string
  content: GenericContent
}

export interface BreadcrumbProps {
  content: BreadcrumbItem[]
  currentContent: BreadcrumbItem
  onItemClick: (event: React.MouseEvent, item: BreadcrumbItem) => void
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbProps & RouteComponentProps> = props => (
  <Typography variant="h6" style={{ paddingLeft: '.5em' }}>
    {props.content.map((item, key) => (
      <DropFileArea key={key} parent={item.content} style={{ display: 'inline-block' }}>
        <Tooltip title={item.title}>
          <Button onClick={ev => props.onItemClick(ev, item)}>
            <Icon item={item.content} style={{ marginRight: '0.3em' }} />
            {item.displayName}
          </Button>
        </Tooltip>
        <KeyboardArrowRight style={{ verticalAlign: 'middle', height: '16px' }} />
      </DropFileArea>
    ))}
    <DropFileArea parent={props.currentContent.content} style={{ display: 'inline-block' }}>
      <Tooltip title={props.currentContent.content.Path || '/'}>
        <Button onClick={ev => props.onItemClick(ev, props.currentContent)}>
          <Icon item={props.currentContent.content} style={{ marginRight: '0.3em' }} />
          {props.currentContent.displayName}
        </Button>
      </Tooltip>
    </DropFileArea>
  </Typography>
)

const routed = withRouter(Breadcrumbs)

export default routed
