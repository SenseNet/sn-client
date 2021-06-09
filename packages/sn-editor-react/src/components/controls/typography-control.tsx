import { createStyles, makeStyles, MenuItem, Select } from '@material-ui/core'
import { Editor } from '@tiptap/core'
import { HeadingOptions } from '@tiptap/extension-heading'
import React, { ChangeEvent, FC } from 'react'

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      color: '#556685',
      verticalAlign: 'middle',
    },
  })
})

interface TypographyControlProps {
  editor: Editor
}

type Level = 0 | HeadingOptions['levels'][number]

export const TypographyControl: FC<TypographyControlProps> = (props) => {
  const classes = useStyles()
  const getActiveValue = () => {
    if (props.editor.isActive('paragraph')) {
      return 0
    } else if (props.editor.isActive('heading', { level: 1 })) {
      return 1
    } else if (props.editor.isActive('heading', { level: 2 })) {
      return 2
    } else if (props.editor.isActive('heading', { level: 3 })) {
      return 3
    } else if (props.editor.isActive('heading', { level: 4 })) {
      return 4
    } else if (props.editor.isActive('heading', { level: 5 })) {
      return 5
    } else if (props.editor.isActive('heading', { level: 6 })) {
      return 6
    }

    return 0
  }

  const handleChange = (event: ChangeEvent<{ name?: string; value: Level }>) => {
    if (event.target.value !== 0) {
      props.editor.chain().focus().toggleHeading({ level: event.target.value }).run()
    } else {
      props.editor.chain().focus().setParagraph().run()
    }
  }

  return (
    <Select
      id="demo-simple-select"
      value={getActiveValue()}
      onChange={handleChange}
      disableUnderline={true}
      className={classes.root}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
      }}>
      <MenuItem value={0}>Paragraph</MenuItem>
      <MenuItem value={1}>Heading 1</MenuItem>
      <MenuItem value={2}>Heading 2</MenuItem>
      <MenuItem value={3}>Heading 3</MenuItem>
      <MenuItem value={4}>Heading 4</MenuItem>
      <MenuItem value={5}>Heading 5</MenuItem>
      <MenuItem value={6}>Heading 6</MenuItem>
    </Select>
  )
}
