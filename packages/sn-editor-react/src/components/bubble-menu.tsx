import { createStyles, IconButton, makeStyles } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import { Editor, posToDOMRect, BubbleMenu as TiptapBubbleMenu } from '@tiptap/react'
import React, { FC } from 'react'

const useStyles = makeStyles((theme) => {
  return createStyles({
    root: {
      backgroundColor: theme.palette.common.white,
      borderRadius: '10px',

      '&:not(:empty)': {
        padding: '3px 6px',
        boxShadow: '0 2px 7px 0 rgb(0 0 0 / 50%)',
      },

      '&:empty + .tippy-svg-arrow': {
        display: 'none',
      },
    },
  })
})

interface BubbleMenuProps {
  editor: Editor
}

export const BubbleMenu: FC<BubbleMenuProps> = (props) => {
  const classes = useStyles()
  return (
    <TiptapBubbleMenu
      className={classes.root}
      tippyOptions={{
        delay: 100,
        trigger: 'click',
        aria: {
          expanded: false,
        },
        hideOnClick: false,
        getReferenceClientRect: null,
        onShow: (instance) => {
          const { state } = props.editor.view
          const { selection } = state
          const { ranges } = selection

          const from = Math.min(...ranges.map((range) => range.$from.pos))
          const to = Math.max(...ranges.map((range) => range.$to.pos))

          instance.setProps({
            getReferenceClientRect: () => posToDOMRect(props.editor.view, from, to),
          })
        },
      }}
      editor={props.editor}>
      {props.editor.isActive('image') && (
        <IconButton
          aria-label="remove image"
          size="small"
          onClick={() => props.editor.chain().focus().deleteSelection().run()}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      )}
      {props.editor.isActive('link') && (
        <>
          <a
            href={props.editor.getMarkAttributes('link').href}
            target="_blank"
            rel="noreferrer"
            style={{ marginRight: '3px' }}>
            {props.editor.getMarkAttributes('link').href}
          </a>
          <IconButton
            aria-label="remove link"
            size="small"
            onClick={() => props.editor.chain().focus().unsetLink().run()}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </>
      )}
    </TiptapBubbleMenu>
  )
}
