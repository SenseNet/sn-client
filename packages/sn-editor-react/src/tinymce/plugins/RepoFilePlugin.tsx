import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { RepoFilePluginControl } from '../controls/repo-file-plugin'
import { PluginRegistrationProps } from '.'

export const RepoFilePlugin = ({ editor, repository, path }: PluginRegistrationProps) => {
  editor.ui.registry.addMenuItem('InsertRepoFile', {
    text: 'Browse file',
    icon: 'browse',
    onAction() {
      const dialogContainer = document.createElement('div')
      document.body.appendChild(dialogContainer)

      const closeDialog = () => {
        unmountComponentAtNode(dialogContainer)
        dialogContainer.remove()
      }

      render(
        <RepoFilePluginControl editor={editor} repository={repository} closeDialog={closeDialog} path={path} />,
        dialogContainer,
      )
    },
  })
}
