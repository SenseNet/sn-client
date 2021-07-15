import { createStyles, makeStyles } from '@material-ui/core'
import { EditorContent, EditorOptions, useEditor } from '@tiptap/react'
import React, { FC, useCallback, useState } from 'react'
import { LocalizationProvider, LocalizationType } from '../context'
import { createExtensions } from '../extension-list'
import { getCommonStyles } from '../styles'
import { BubbleMenu } from './bubble-menu'
import { ContextMenu, ContextMenuPosition } from './context-menu'
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

      '& .ProseMirror': {
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

        '& table': {
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          width: '100%',
          margin: 0,
          overflow: 'hidden',

          '& th': {
            fontWeight: 700,
            textAlign: 'left',
            backgroundColor: theme.palette.type === 'light' ? '#f1f3f5' : '#403f3f',
          },

          '& td, & th': {
            minWidth: '1em',
            border: '2px solid #ced4da',
            padding: '3px 5px',
            verticalAlign: 'top',
            boxSizing: 'border-box',
            position: 'relative',

            '& > *': {
              margin: 0,
            },
          },

          '& .selectedCell:after': {
            zIndex: 2,
            position: 'absolute',
            content: '""',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            background: 'rgba(200, 200, 255, 0.4)',
            pointerEvents: 'none',
          },
        },

        '& .ProseMirror-selectednode': {
          '& img': {
            outline: `3px solid ${theme.palette.primary.main}`,
          },
        },
      },
    },
  })
})

export interface EditorProps {
  autofocus?: EditorOptions['autofocus']
  content?: EditorOptions['content']
  onChange?: EditorOptions['onUpdate']
  readOnly?: boolean
  placeholder?: string
  localization?: Partial<LocalizationType>
}

export const Editor: FC<EditorProps> = (props) => {
  const classes = useStyles()
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<ContextMenuPosition>({ x: null, y: null })

  const sensenetEditor = useEditor({
    extensions: createExtensions({ placeholder: { placeholder: props.placeholder || '' } }),
    autofocus: props.autofocus ?? false,
    editable: !props.readOnly,
    content: props.content,
    onUpdate(updateProps) {
      props.onChange?.(updateProps)
    },
  })

  const handleContextMenu = useCallback(
    (ev) => {
      if (sensenetEditor?.isActive('table')) {
        ev.preventDefault()
        setContextMenuOpen(true)
        setContextMenuPosition({
          x: ev.clientX - 2,
          y: ev.clientY - 4,
        })
      }
    },
    [sensenetEditor],
  )

  return (
    <LocalizationProvider localization={props.localization}>
      <div className={classes.root}>
        <MenuBar editor={sensenetEditor} />
        {sensenetEditor && <BubbleMenu editor={sensenetEditor} />}
        {sensenetEditor && (
          <ContextMenu
            editor={sensenetEditor}
            open={contextMenuOpen}
            setOpen={setContextMenuOpen}
            mousePosition={contextMenuPosition}
            setMousePosition={setContextMenuPosition}
          />
        )}
        <EditorContent editor={sensenetEditor} className={classes.editorWrapper} onContextMenu={handleContextMenu} />
      </div>
    </LocalizationProvider>
  )
}
