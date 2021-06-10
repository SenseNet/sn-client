import { createStyles, makeStyles } from '@material-ui/core'
import { EditorContent, EditorOptions, useEditor } from '@tiptap/react'
import React, { FC } from 'react'
import { createExtensions } from '../extension-list'
import { getCommonStyles } from '../styles'
import { BubbleMenu } from './bubble-menu'
import { MenuBar } from './menu-bar'

const useStyles = makeStyles((theme) => {
  const commonStyles = getCommonStyles(theme)
  return createStyles({
    root: {
      margin: '0.5rem 0',
      boxShadow: '0px 10px 15px -7px rgba(0,0,0,0.4)',
      borderRadius: '10px',
    },
    editorWrapper: {
      padding: '0rem 1rem 0.5rem',
      marginTop: '1rem',
      background: commonStyles.editorBackground,
      borderRadius: commonStyles.editorBorderRadius,
      border: theme.palette.type === 'dark' ? commonStyles.editorBorder : 'unset',
    },
    editor: {
      outline: 0,

      '&:after': {
        clear: 'both',
        content: '""',
        display: 'block',
      },

      '& p.is-empty:only-child:before': {
        content: 'attr(data-placeholder)',
        float: 'left',
        opacity: 0.5,
        pointerEvents: 'none',
        height: 0,
        fontStyle: 'italic',
      },

      '& a': {
        textDecoration: 'underline',
        color: '#06c',
      },

      '& figure': {
        margin: 0,

        '& img': {
          maxWidth: '100%',
          height: 'auto',
        },
      },

      '& .ProseMirror-selectednode': {
        '& img': {
          outline: `3px solid ${theme.palette.primary.main}`,
        },
      },
    },
  })
})

interface EditorProps {
  autofocus?: EditorOptions['autofocus']
  content?: EditorOptions['content']
  onChange?: EditorOptions['onUpdate']
  readOnly?: boolean
  placeholder?: string
}

export const Editor: FC<EditorProps> = (props) => {
  const classes = useStyles()

  const sensenetEditor = useEditor({
    extensions: createExtensions({ placeholder: { placeholder: props.placeholder || '' } }),
    autofocus: props.autofocus ?? false,
    editable: !props.readOnly,
    content: props.content,
    onUpdate(updateProps) {
      props.onChange?.(updateProps)
    },
    editorProps: {
      attributes: {
        class: classes.editor,
      },
    },
  })

  return (
    <div className={classes.root}>
      <MenuBar editor={sensenetEditor} />
      {sensenetEditor && <BubbleMenu editor={sensenetEditor} />}
      <EditorContent editor={sensenetEditor} className={classes.editorWrapper} contentEditable={false} />
    </div>
  )
}
