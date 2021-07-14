import { createStyles, IconButton, makeStyles, Tooltip } from '@material-ui/core'
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
import { useLocalization } from '../hooks'
import { getCommonStyles } from '../styles'
import { ImageControl, LinkControl, TableControl, TypographyControl } from './controls'

const useStyles = makeStyles((theme) => {
  const commonStyles = getCommonStyles(theme)
  return createStyles({
    root: {
      position: 'sticky',
      top: '-14px',
      padding: '0.5rem 1rem',
      zIndex: 10,
      borderRadius: commonStyles.editorBorderRadius,
      border: commonStyles.editorBorder,
      backgroundColor: commonStyles.editorBackground,
    },

    divider: {
      background: theme.palette.type === 'dark' ? theme.palette.common.white : 'rgba(57,76,96,.15)',
      width: '1px',
      display: 'inline-block',
      height: '28px',
      verticalAlign: 'middle',
      margin: '0 5px',
    },

    button: {
      borderRadius: '5px',
      color: theme.palette.type === 'dark' ? theme.palette.common.white : '#556685',
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
  const localization = useLocalization()

  if (!editor) {
    return null
  }

  return (
    <div className={classes.root}>
      <TypographyControl editor={editor} />
      <div className={classes.divider} />
      <Tooltip title={`${localization.menubar.bold} (Ctrl + B)`}>
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive('bold') ? 'primary' : 'default'}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <strong>B</strong>
        </IconButton>
      </Tooltip>
      <Tooltip title={`${localization.menubar.italic} (Ctrl + I)`}>
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive('italic') ? 'primary' : 'default'}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <em>I</em>
        </IconButton>
      </Tooltip>
      <Tooltip title={`${localization.menubar.underline} (Ctrl + U)`}>
        <IconButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          color={editor.isActive('underline') ? 'primary' : 'default'}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <FormatUnderlinedIcon />
        </IconButton>
      </Tooltip>
      <div className={classes.divider} />
      <Tooltip title={`${localization.menubar.blockquote} (Ctrl + Shift + B)`}>
        <IconButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          color={editor.isActive('blockquote') ? 'primary' : 'default'}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <FormatQuoteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${localization.menubar.code} (Ctrl + E)`}>
        <IconButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          color={editor.isActive('code') ? 'primary' : 'default'}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <CodeIcon />
        </IconButton>
      </Tooltip>
      <div className={classes.divider} />
      <Tooltip title={`${localization.menubar.alignLeft} (Ctrl + Shift + L)`}>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <FormatAlignLeftIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${localization.menubar.alignCenter} (Ctrl + Shift + E)`}>
        <IconButton
          onClick={() => {
            editor.chain().focus().setTextAlign('center').run()
          }}
          color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <FormatAlignCenterIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${localization.menubar.alignRight} (Ctrl + Shift + R)`}>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <FormatAlignRightIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${localization.menubar.alignJustify} (Ctrl + Shift + J)`}>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          color={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <FormatAlignJustifyIcon />
        </IconButton>
      </Tooltip>
      <div className={classes.divider} />
      <Tooltip title={localization.menubar.bulletList}>
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={localization.menubar.orderedList}>
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive('orderedList') ? 'primary' : 'default'}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <FormatListNumberedIcon />
        </IconButton>
      </Tooltip>
      <LinkControl
        editor={editor}
        buttonProps={{ classes: { root: classes.button, colorPrimary: classes.buttonPrimary } }}
      />
      <ImageControl
        editor={editor}
        buttonProps={{ classes: { root: classes.button, colorPrimary: classes.buttonPrimary } }}
      />
      <TableControl
        editor={editor}
        buttonProps={{ classes: { root: classes.button, colorPrimary: classes.buttonPrimary } }}
      />
      <Tooltip title={localization.menubar.clearFormat}>
        <IconButton
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}
          onClick={() => {
            editor.chain().focus().unsetAllMarks().run()
            editor.chain().focus().clearNodes().run()
          }}>
          <FormatClearIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${localization.menubar.undo} (Ctrl + Z)`}>
        <IconButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <UndoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${localization.menubar.redo} (Ctrl + Y)`}>
        <IconButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          classes={{ root: classes.button, colorPrimary: classes.buttonPrimary }}>
          <RedoIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}
