import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { AccordionPluginControl } from '../controls/accordion-plugin'
import { PluginRegistrationProps } from '.'

export const AccordionPlugin = ({ editor }: PluginRegistrationProps) => {
  editor.ui.registry.addMenuItem('InsertAccordion' /*name of the plugin*/, {
    text: 'Insert Accordion',
    icon: 'accordion',
    onAction() {
      const dialogContainer = document.createElement('div')
      document.body.appendChild(dialogContainer)

      const closeDialog = () => {
        unmountComponentAtNode(dialogContainer)
        dialogContainer.remove()
      }

      const dialog = <AccordionPluginControl editor={editor} closeDialog={closeDialog} />

      render(dialog, dialogContainer)
    },
  })
}
