import React from 'react'
import { Typography } from '@material-ui/core'
import ReactMarkdown from 'react-markdown'
import { MarkdownWidget as MarkdownWidgetModel } from '../../services/PersonalSettings'
import { useStringReplace } from '../../hooks/use-string-replace'

export const MarkdownWidget: React.FunctionComponent<MarkdownWidgetModel> = props => {
  const replacedContent = useStringReplace(props.settings.content)
  const replacedTitle = useStringReplace(props.title)

  return (
    <div>
      <Typography
        variant="h5"
        title={props.title}
        gutterBottom={true}
        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {replacedTitle}
      </Typography>
      <div style={{ overflow: 'auto' }}>
        <ReactMarkdown escapeHtml={false} source={replacedContent} />
      </div>
    </div>
  )
}
