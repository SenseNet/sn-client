import React, { useState, useEffect, useContext } from 'react'
import { Typography } from '@material-ui/core'
import ReactMarkdown from 'react-markdown'
import { MarkdownWidget as MarkdownWidgetModel } from '../../services/PersonalSettings'
import { SessionContext } from '../../context'
import { useRepository, usePersonalSettings } from '../../hooks'

export const MarkdownWidget: React.FunctionComponent<MarkdownWidgetModel> = props => {
  const [replacedContent, setReplacedContent] = useState('')
  const session = useContext(SessionContext)
  const repo = useRepository()
  const personalSettings = usePersonalSettings()

  useEffect(() => {
    const currentRepo = personalSettings.repositories.find(r => r.url === repo.configuration.repositoryUrl)

    const newReplacedContent = props.settings.content
      .replace(
        '{currentUserName}',
        session.currentUser.FullName || session.currentUser.DisplayName || session.currentUser.Name,
      )
      .replace(
        '{currentRepositoryName}',
        currentRepo && currentRepo.displayName
          ? currentRepo.displayName
          : repo.configuration.repositoryUrl || repo.configuration.repositoryUrl,
      )
      .replace('{currentRepositoryUrl}', repo.configuration.repositoryUrl)

    setReplacedContent(newReplacedContent)
  }, [
    personalSettings.repositories,
    props.settings.content,
    repo.configuration.repositoryUrl,
    session.currentUser.DisplayName,
    session.currentUser.FullName,
    session.currentUser.Name,
  ])

  return (
    <div>
      <Typography
        variant="h5"
        title={props.title}
        gutterBottom={true}
        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {props.title}
      </Typography>
      <div style={{ overflow: 'auto' }}>
        <ReactMarkdown escapeHtml={false} source={replacedContent} />
      </div>
    </div>
  )
}
