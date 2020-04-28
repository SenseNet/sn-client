import React from 'react'
import { Paper, Typography } from '@material-ui/core'
import ReactMarkdown from 'react-markdown'
import { MarkdownWidget as MarkdownWidgetModel } from '../../services/PersonalSettings'
import { useStringReplace } from '../../hooks'

export const MarkdownWidget: React.FunctionComponent<MarkdownWidgetModel> = (props) => {
  const replacedContent = useStringReplace(props.settings.content)
  const replacedTitle = useStringReplace(props.title)
  const inheritedClasses = props.classes

  return (
    <div className={inheritedClasses.root}>
      <Typography variant="h2" title={replacedTitle} gutterBottom={true} className={inheritedClasses.title}>
        {replacedTitle}
      </Typography>
      <Paper className={inheritedClasses.container} style={{ overflow: 'auto' }} elevation={0}>
        <ReactMarkdown escapeHtml={false} source={replacedContent} />
      </Paper>
    </div>
  )
}
