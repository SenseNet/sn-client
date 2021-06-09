import { createStyles, IconButton, makeStyles } from '@material-ui/core'
import CodeIcon from '@material-ui/icons/Code'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter'
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify'
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight'
import FormatClearIcon from '@material-ui/icons/FormatClear'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined'
import RedoIcon from '@material-ui/icons/Redo'
import UndoIcon from '@material-ui/icons/Undo'
import { Editor } from '@tiptap/react'
import React, { FC } from 'react'

import { ImageControl, LinkControl, TypographyControl } from './controls'

const useStyles = makeStyles((theme) => {
  return createStyles({
    root: {
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      border: `2px solid ${theme.palette.primary.main}`,
    },

    divider: {
      background: 'rgba(57,76,96,.15)',
      width: '1px',
      display: 'inline-block',
      height: '28px',
      verticalAlign: 'middle',
      margin: '0 5px',
    },

    button: {
      borderRadius: '5px',
      color: '#556685',
      fontSize: '1.3rem',
      padding: '4px 8px',
      margin: '0 5px',
    },

    buttonPrimary: {
      backgroundColor: '#E2F3EE',
      color: theme.palette.primary.main,
    },
  })
})

interface MenuBarProps {
  editor: Editor | null
}

export const MenuBar: FC<MenuBarProps> = ({ editor }) => {
  const classes = useStyles()

  if (!editor) {
    return null
  }

  return (
    <div className={classes.root}>
      <TypographyControl editor={editor} />
      <div className={classes.divider} />
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        color={editor.isActive('bold') ? 'primary' : 'default'}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <strong>B</strong>
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        color={editor.isActive('italic') ? 'primary' : 'default'}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <em>I</em>
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        color={editor.isActive('underline') ? 'primary' : 'default'}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <FormatUnderlinedIcon />
      </IconButton>
      <div className={classes.divider} />
      <IconButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        color={editor.isActive('blockquote') ? 'primary' : 'default'}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <FormatQuoteIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        color={editor.isActive('code') ? 'primary' : 'default'}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <CodeIcon />
      </IconButton>
      <div className={classes.divider} />
      <IconButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <FormatAlignLeftIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          editor.chain().focus().setTextAlign('center').run()
        }}
        color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <FormatAlignCenterIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <FormatAlignRightIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        color={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <FormatAlignJustifyIcon />
      </IconButton>
      <div className={classes.divider} />
      <IconButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <FormatListBulletedIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        color={editor.isActive('orderedList') ? 'primary' : 'default'}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <FormatListNumberedIcon />
      </IconButton>
      <LinkControl
        editor={editor}
        buttonProps={{ classes: { root: classes.button, colorPrimary: classes.buttonPrimary } }}
      />
      <ImageControl
        editor={editor}
        buttonProps={{ classes: { root: classes.button, colorPrimary: classes.buttonPrimary } }}
      />
      <IconButton
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}
        onClick={() => {
          editor.chain().focus().unsetAllMarks().run()
          editor.chain().focus().clearNodes().run()
        }}>
        <FormatClearIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <UndoIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
        <RedoIcon />
      </IconButton>
    </div>
  )
}
